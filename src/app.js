const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

const authController = require("./controllers/authController");

dotenv.config();
app.use(express.json());
app.use(cors());

// Authentificeringsruter
app.post("/createUser", authController.createUser);
app.post("/login", authController.login);
app.get("/accessToken/:accessToken", authController.validateToken);

module.exports = app;


