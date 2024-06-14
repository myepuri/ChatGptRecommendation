const fs = require("fs");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTIC_CLOUD_USERNAME,
    password: process.env.ELASTIC_CLOUD_PASSWORD,
  },
});
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, "utf-8"));

const importData = async () => {
  try {
    const indexExists = await client.indices.exists({ index: "posts" });
    if (!indexExists) {
      await client.indices.create({
        index: "posts",
        body: {
          mappings: {
            properties: {
              id: { type: "keyword" },
              title: { type: "text" },
              description: { type: "text" },
              topic: { type: "keyword" },
              createdBy: { type: "keyword" },
              createdByName: { type: "text" },
              comments: {
                type: "nested",
                properties: {
                  text: { type: "text" },
                  createdBy: { type: "keyword" },
                  createdAt: { type: "date" },
                },
              },
            },
          },
        },
      });
    }
    const operations = posts.flatMap((doc) => [
      { index: { _index: "posts" } },
      doc,
    ]);
    const bulkResponse = await client.bulk({ refresh: true, operations });

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
    }

    const insertedDocuments = bulkResponse.items.map((item, index) => ({
      ...posts[index],
      id: item.index._id,
    }));

    console.log("Documents inserted successfully");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "--import") {
  importData();
}
