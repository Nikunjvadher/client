const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    // _id:ObjectId,
    date: String,
    open: String,
    high: String,
    low: String,
    close: String,
})

const TableModel = mongoose.model('table', tableSchema) // 'data' is the name of the collection
module.exports = TableModel

