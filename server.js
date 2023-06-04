import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { NotFoundError, errorHandler } from "./middlewares/error-handler.js";
import morgan from "morgan";
import connectDb from "./config/db.js";
import router from "./routes/routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as socket } from "socket.io";


const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: 'http://localhost:3000',
};
dotenv.config();

const hostname = process.env.SERVERURL;
const port = process.env.SERVERPORT;

//info on req : GET /route ms -25
app.use(morgan("dev"));

app.use(cors(corsOptions));
connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/api/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
      console.log(err);
    }
  });
});

app.use("/public/mp3", express.static(path.join(__dirname, "public/mp3")));
app.use("/public/images", express.static(path.join(__dirname, "public/images")));

const server = app.listen(port, () =>
  console.log(`Server started on ${port}`)
);

const io = new socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

app.use(NotFoundError);
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running on ${hostname}:${port}`);
});
