const { Queue, Worker } = require("bullmq");
const { Server } = require("socket.io");
const httpsServer = require("../server");

const io = new Server(httpsServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//  Configure BullMQ Queue (for Jobs)
const socketQueue = new Queue("socket-queue", {
  connection: {
    host: "localhost", // Default Redis host
    port: 6379, // Default Redis port
  },
});

const getSocketJob = async (userId, followerIds, title) => {
  const job = await socketQueue.add(
    "send-notification",
    {
      from: userId,
      to: followerIds,
      title: `New Post: ${title}`,
    },
    {
      // Add this to each job, so individual jobs can have their own options.
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );
  return job;
};

const createSocketWorker = () => {
  //  Define the  Worker (to process jobs from the queue)
  const socketWorker = new Worker(
    "socket-queue",
    async (job) => {
      //sending for the new post created to all the followers
      const { from, to, title } = job.data;
      to.forEach((followerId) => {
        io.to(followerId).emit("new-post", { from, title });
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

module.exports = { createSocketWorker, getSocketJob };
