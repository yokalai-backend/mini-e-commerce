import buildApp from "./app";

async function server() {
  try {
    const app = await buildApp();

    await app.ready();

    await app.listen({ port: 5000, host: "0.0.0.0" });

    console.log("Server is running");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

server();
