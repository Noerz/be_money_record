const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const helmet = require("helmet");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({xPoweredBy:false}));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('Hello World');
})
app.use('/api/v1', routes);



app.listen(process.env.PORT, () => console.log('server berjalan pada port ' + process.env.PORT));