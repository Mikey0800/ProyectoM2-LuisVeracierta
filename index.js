require("dotenv").config({ quiet: true });

const app = require("./desarrollo/app");

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});