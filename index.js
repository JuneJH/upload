const express = require('express');
const app = express();
const path = require("path");

const uploadRouter = require("./api/upload")

app.use(express.static(path.join(__dirname, './static')));

app.use("/upload",uploadRouter)

app.listen(9527,()=>{console.info("start server succeed")})
