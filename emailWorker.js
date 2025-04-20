const { Queue, Worker } = require("bullmq");
const nodemailer = require("nodemailer");

//  Configure BullMQ Queue (for Email Jobs)
const emailQueue = new Queue("email-queue", {
  connection: {
    host: "localhost", // Default Redis host
    port: 6379, // Default Redis port
  },
});

//  Configure Email Transport (Nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your email service
  auth: {
    user: process.env.EMAIL_USER, //  Ensure these are in your .env file
    pass: process.env.EMAIL_PASS,
  },
});

//  Define the Email Sending Function
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

const getJob = async (followerEmails, title, description) => {
  const job = await emailQueue.add(
    "send-email",
    {
      to: followerEmails,
      subject: `New Post: ${title}`,
      html: `<p>A new post "${title}" has been created.</p><p>${description}</p>`,
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

const createEmailWorker = () => {
  //  Define the Email Worker (to process jobs from the queue)
  const emailWorker = new Worker(
    "email-queue",
    async (job) => {
      const { to, subject, html } = job.data;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      };
      const result = await sendEmail(mailOptions);
      if (!result.success) {
        throw new Error(`Email sending failed: ${result.error}`); //Important:  Throwing an error will retry the job, which is what we want.
      }
      return result; // Return the result for tracking
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
      // Add retry mechanism.  See https://github.com/taskforce/bullmq/blob/master/docs/README.md
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
  emailWorker.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
  });

  emailWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
  });

  emailWorker.on("progress", (job, progress) => {
    console.log(`Job ${job.id} progress: ${progress}`);
  });
};

module.exports = { createEmailWorker, getJob };
