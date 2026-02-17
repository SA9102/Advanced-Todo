// Packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

// Routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const tagRoutes = require("./routes/tag");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser()); // Allows us to access cookies through the request object
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://advanced-todo-2zks.onrender.com"
        : "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// });

const apiRoute = "/api/";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/tag", tagRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT);
    console.log(`Listening on port ${PORT}`);
  })
  .catch((err) => console.log(err));
