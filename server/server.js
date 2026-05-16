const { connectDB, sequelize } = require("./config/db");
require("./models/Item");

connectDB().then(() => sequelize.sync());

const Item = require("./models/Item");

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});