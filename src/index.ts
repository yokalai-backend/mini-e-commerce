import buildApp from "./app";

async function server() {
  try {
    const app = await buildApp();

    app.listen({ port: 5000 });

    console.log("Server is running in port 5000");
  } catch (error) {
    console.error("Error while try to run server: ", error);

    process.exit(1);
  }
}

server();
