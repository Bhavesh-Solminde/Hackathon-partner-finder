import app from "./app.js";
import env from "./env.js";
import connectDB from "./lib/db.js";

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
};

startServer();

