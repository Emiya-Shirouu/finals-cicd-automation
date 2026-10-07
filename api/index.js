const createApp = require("./app");
const db = require("./db");
createApp(db).listen(3000, () => console.log("API running on port 3000"));
