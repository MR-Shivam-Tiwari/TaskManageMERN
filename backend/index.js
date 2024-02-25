const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const taskRoutes = require("./Routes/tasks");
const app = express();
const port = 4000;
const User = require("./Model/user");

app.use(express.json());
app.use(cors());
const dbURI = `mongodb+srv://shivamt2023:ft123shivam123@cluster0.innzwqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("Database connected successfully");
});

app.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).send("User created successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send("Invalid password.");
    }

    const token = jwt.sign({ email: user.email }, "your-secret-key");
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use("/api", taskRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
