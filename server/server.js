// Packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

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
    // origin: "http://localhost:5173",
    origin: "https://advanced-todo-2zks.onrender.com/",
    credentials: true,
  })
);

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
