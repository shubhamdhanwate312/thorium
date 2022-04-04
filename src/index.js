const express = require('express');
const bodyParser = require('body-parser');
const route = require("./route/routers");
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

mongoose.connect("mongodb+srv://thorium-cohort:qwertyuiop@cluster0.xyklh.mongodb.net/nasir_projectbloggingroom8?authSource=admin&replicaSet=atlas-wc30tm-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", {
    useNewUrlParser: true
})

    .then(() => console.log("MongoDb is connected sucessfully"))
    .catch((err) => console.log(err))





















