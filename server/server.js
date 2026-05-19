

require("dotenv").config(); 

const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
const Item = require("./models/Items");
const authRoutes = require("./routes/authRoutes");

const app = express(); 

app.use(cors());
app.use(express.json());


app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});