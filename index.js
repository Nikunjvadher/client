const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TableModel = require('./models/data');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/nsedata")

app.get('/getData', (req, res) => {
    TableModel.find()
        .then(table => res.json(table))
        .catch(err => res.status(400).json('Error: ' + err));
})


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});