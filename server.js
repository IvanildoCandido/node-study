const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.development" });
const PORT = process.env.PORT;

//Database Connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error) =>
  console.error("Erro:" + error.message),
);

//Loading models
require("./models/Post");

const app = require("./app");

app.listen(PORT, () => console.log(`Server running on ${PORT} port!`));
