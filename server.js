import app from "./app.js";
import colors from "colors";
import { PORT } from "./utils/secret.js";
import mongodbConnection from "./config/DBConnect.js";

//server listening on port
app.listen(PORT, async () => {
  await mongodbConnection();
  console.log(`listening on port : ${PORT}`.bgCyan.white);
});
