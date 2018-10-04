let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
let shortenUrlSchema = new mongoose.Schema({
 originalUrl: String
})
shortenUrlSchema.plugin(autoIncrement.plugin, 'Book');
module.exports = mongoose.model('shortenUrl', shortenUrlSchema)
