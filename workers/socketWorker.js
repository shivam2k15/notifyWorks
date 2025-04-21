const { Worker } = require("bullmq");
const { Server } = require("socket.io");
const httpsServer = require("../server");

const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const createSocketWorker = () => {
  //  Define the  Worker (to process jobs from the queue)
  const socketWorker = new Worker(
    "socket-queue",
    async (job) => {
      //sending for the new post created to all the followers
      const { from, to, title } = job.data;
      console.log(job, "job");
      to.forEach((followerId) => {
        io.to("join" + followerId).emit("new-post:" + followerId, {
          from,
          title,
        });
      });
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },

      defaultJobOptions: {
        attempts: 3, // Number of retries
        backoff: {
          type: "exponential", // Use exponential backoff strategy
          delay: 1000, // Initial delay in milliseconds
        },
      },
    }
  );

  // Optional:  Handle worker events for logging/monitoring
  socketWorker.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
  });

  socketWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
  });

  socketWorker.on("progress", (job, progress) => {
    console.log(`Job ${job.id} progress: ${progress}`);
  });
};

module.exports = { createSocketWorker };
