const express = require("express");
const bodyParser = require("body-parser")
const dotENV = require("dotenv");
const connection = require("./db");
const cors = require("cors");

dotENV.config();

const app = express();
connection()

app.use(cors({origin:'https://gentle-meringue-57d73a.netlify.app', credentials: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/api/users", require("./routes/UserRoute"));
app.use("/api/snippets", require("./routes/SnippetRoute"))

PORT = process.env.PORT || 4000;

app.listen(PORT, () => {console.log(`Server listening on port ${PORT}`)});