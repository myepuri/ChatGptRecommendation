const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const client = require("./esClient");
const OpenAI = require("openai");
const generateSuggestions = require("./agent");
const { emitToSubscribers } = require("./socket");
const { getJson } = require("serpapi");
const app = express();

console.log(process.env.OPENAI_KEY);

const openai = new OpenAI({
  apiKey: process.env.OpenAI_KEY,
  dangerouslyAllowBrowser: true,
});
app.use(cors());
app.use(bodyParser.json());

app.get("/posts", async (req, res) => {
  try {
    const results = await client.search({
      index: "posts",
      query: {
        match_all: {},
      },
      size: 50,
    });

    const posts = results.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    return res.status(201).json({
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Failed to fetched posts", error);
    return res.status(500).json({ message: "Failed to fetched posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  try {
    const result = await client.get({
      index: "posts",
      id: req.params.id,
    });

    const post = { id: result._id, ...result._source };

    return res.status(201).json({
      message: "Posts fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Failed to fetched posts", error);
    return res.status(500).json({ message: "Failed to fetched posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const post = req.body;
    const response = await client.index({
      index: "posts",
      body: post,
    });
    const result = await client.get({
      index: "posts",
      id: response._id,
    });

    const newPost = { id: result._id, ...result._source };

    // if (subscribers[newPost?.topic]) {
    //   subscribers[topic].forEach((socketID) => {
    //     io.to(socketID).emit("newPost", newPost);
    //   });
    // }

    emitToSubscribers(newPost?.topic, "newPost", newPost);

    return res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error("Failed to index post", error);
    return res.status(500).json({ message: "Failed to create post" });
  }
});

app.post("/posts/multiple", async (req, res) => {
  try {
    const posts = req.body;
    const operations = posts.flatMap((doc) => [
      { index: { _index: "posts" } },
      doc,
    ]);

    const bulkResponse = await client.bulk({ refresh: true, operations });
    console.log(bulkResponse);

    if (bulkResponse.errors) {
      const erroredDocuments = [];
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1],
          });
        }
      });
      console.log("Some documents failed to index:", erroredDocuments);
      return res.status(500).json({
        message: "Some documents failed to index",
        details: erroredDocuments,
      });
    }

    const insertedDocuments = bulkResponse.items.map((item, index) => ({
      ...posts[index],
      id: item.index._id,
    }));

    return res.status(201).json({
      message: "All posts created successfully",
      posts: insertedDocuments,
    });
  } catch (error) {
    console.error("Failed to index posts", error);
    return res
      .status(500)
      .json({ message: "Failed to create posts", error: error.message });
  }
});

app.put("/post/:id", async (req, res) => {
  const post = req.body;
  try {
    await client.index({
      index: "posts",
      id: req.params.id,
      body: post,
      refresh: "wait_for",
    });

    const resDoc = await client.get({
      index: "posts",
      id: req.params.id,
    });

    const updatedPost = {
      id: resDoc._id,
      ...resDoc._source,
    };

    console.log(updatedPost);

    res.status(201).json({
      updatedPost,
    });
  } catch (error) {
    console.error("Failed to update posts", error);
    return res.status(500).json({ message: "Failed to update post" });
  }
});

app.delete("/post/:id", async (req, res) => {
  try {
    const response = await client.delete({
      index: "posts",
      id: req.params.id,
    });

    if (response.result === "deleted") {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      // If the document to delete was not found, Elasticsearch returns 'not_found'
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Failed to delete post", error);
    if (error.meta && error.meta.statusCode === 404) {
      return res.status(404).json({ message: "Post not found" });
    } else {
      return res.status(500).json({ message: "Failed to delete post" });
    }
  }
});

app.get("/post/:id/generateComment", async (req, res) => {
  const result = await client.get({
    index: "posts",
    id: req.params.id,
  });

  const post = { id: result._id, ...result._source };

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `The post title is "${post.title}" and it says "${post.description}". Can you provide a reply or your thoughts on this?`,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
    n: 1,
    stop: null,
  });

  res.status(200).json({
    message: "AI Generated Comment Successfully",
    comment: completion.choices[0].message,
  });
});

app.post("/search-activities", async (req, res) => {
  const { ipAddress } = req.body;
  console.log(ipAddress);
  const response = await generateSuggestions(ipAddress);
  return res.status(200).json({
    activities: response,
  });
});

async function getCoordinatesForAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_GEOCODE_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  if (data.status !== "OK") {
    console.log("Address not Found", address);
    return { status: "No Address Found" };
  }
  console.log(data.results[0].geometry.location);

  if (!data || data.length === 0) {
    console.log("Address not Found", address);
    return { status: "No Address Found" };
  } else {
    const location = data.results[0].geometry.location;
    const coordinates = {
      lat: location.lat,
      long: location.lng,
    };
    return coordinates;
  }
}

async function retrieveDetails(
  results,
  category,
  color,
  isIgnoredCategory = false
) {
  let resultDetails = {
    title: "",
    address: "",
    description: "",
    hours: "",
    lat: "",
    long: "",
    color,
    category,
  };
  if (isIgnoredCategory) {
    const events = results?.events_results;
    if (events?.length > 0) {
      let eventResultPromises = events.map(async (event) => {
        const coordinates = await getCoordinatesForAddress(
          event.address[0] + " " + event.address[1]
        );
        if (coordinates?.status) {
          return;
        }

        return {
          title: event.title,
          address: event.address[0] + " " + event.address[1],
          description: event.title,
          hours: event?.date?.start_date + " " + event?.date?.when,
          lat: parseFloat(coordinates.lat),
          long: parseFloat(coordinates.long),
          color,
          category,
        };
      });

      eventResults = await Promise.all(eventResultPromises);
      eventResults = eventResults?.filter((result) => result !== null);
      return eventResults;
    }
  }
  const localResults = results?.local_results?.places[0];
  const localMap = results?.local_map?.gps_coordinates;
  const knowledgeGraph = results?.knowledge_graph;

  if (localResults) {
    resultDetails["title"] = localResults.title;
    resultDetails["address"] = localResults.address;
    resultDetails["description"] = localResults.description;
    resultDetails["hours"] = localResults.hours;
    resultDetails["lat"] = parseFloat(localMap?.latitude);
    resultDetails["long"] = parseFloat(localMap?.longitude);
  }

  if (results?.knowledge_graph) {
    resultDetails["title"] = resultDetails.title
      ? resultDetails.title
      : knowledgeGraph?.title;
    resultDetails["address"] = knowledgeGraph.address;
    resultDetails["description"] = knowledgeGraph.description;
    resultDetails["hours"] = knowledgeGraph?.hours;
  }

  if (!resultDetails?.address) {
    return "skip";
  }

  if (resultDetails?.address && !resultDetails?.lat) {
    const coordinates = await getCoordinatesForAddress(resultDetails?.address);

    if (!coordinates || coordinates.status === "No Address Found") {
      return "skip";
    }

    resultDetails["lat"] = parseFloat(coordinates?.lat);
    resultDetails["long"] = parseFloat(coordinates?.long);
  }

  return resultDetails;
}

app.post("/recommended-for-you", async (req, res) => {
  let { restaurants, musics, sports } = req.body;
  if (!restaurants || !musics || !sports) {
    return res.status(400).json({
      message: "Restaurants, Musics and Sports are required",
    });
  }
  restaurants = restaurants?.map((restaurant) => ({
    name: restaurant,
    category: "restaurant",
    color: "red",
  }));
  musics = musics?.map((music) => ({
    name: music,
    category: "music",
    color: "blue",
  }));
  sports = sports?.map((sport) => ({
    name: sport,
    category: "sports",
    color: "orange",
  }));

  const config = {
    engine: "google",
    api_key: process.env.SERPAPI_KEY,
    q: "",
    location: "Chicago, Illinois",
  };

  const ignoredCategories = new Set();
  let finalResults = [];

  const resultPromises = [...restaurants, ...musics, ...sports].map(
    async (activity) => {
      const results = await getJson({ ...config, q: activity.name });
      const resultDetails = await retrieveDetails(
        results,
        activity.category,
        activity.color
      );

      if (resultDetails === "skip") {
        ignoredCategories.add(activity.category);
        return;
      }

      return resultDetails;
    }
  );

  const results = await Promise.all(resultPromises);
  finalResults = [...results];

  if ([...ignoredCategories].length > 0) {
    console.log(ignoredCategories);
    const otherResultPromises = [...ignoredCategories].map(async (category) => {
      const results = await getJson({ ...config, q: `${category} events` });
      const resultDetails = await retrieveDetails(
        results,
        category,
        category === "music"
          ? "blue"
          : category === "sports"
          ? "orange"
          : "red",
        true
      );
      return resultDetails;
    });

    const otherResults = await Promise.all(otherResultPromises);
    const otherFlatResults = otherResults.flat();
    finalResults = [...finalResults, ...otherFlatResults];
  }

  return res.status(200).json({
    results: finalResults,
  });
});

module.exports = app;
