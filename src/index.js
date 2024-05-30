const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const cors = require('cors');
const Paper = require("./models/paper");
const paperRoutes = require("./routes/paperRoutes");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Ensure database is in sync before starting the server
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");

    // Routes
    app.use("/papers", paperRoutes);

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
