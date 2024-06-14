const http = require("http");
const app = require("./app");
const client = require("./esClient");
const { init } = require("./socket");

const server = http.createServer(app);
init(server);

async function checkConnection() {
  try {
    const response = await client.ping(); // or await client.info();
    console.log("Connection to Elasticsearch is successful:", response);
  } catch (error) {
    console.error("Connection to Elasticsearch failed:", error);
  }
}

async function ensureIndexExists() {
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
}

server.listen(3000, async () => {
  console.log(`Server running on port 300`);
  await checkConnection();
  await ensureIndexExists();
});
