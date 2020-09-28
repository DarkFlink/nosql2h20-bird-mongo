const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
const verification = require('./helpers/verification');
const achievementsObserver = require('./helpers/achievementsObserver');
const combinedRoutes = require('./routes/combinedRoutes');

app.use(cors());

app.get('/', (req, res) => res.send('Welcome to Express'));

app.listen(port, function() {
    console.log("Running on Port "+ port);
})

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const dbPath = 'mongodb://docker-db:27017/bwdb';
const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(dbPath, options);
mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
});
app.use(express.static(__dirname));
app.use(verification);
combinedRoutes(app);
app.use(achievementsObserver);
