let mongoose = require('mongoose');
let autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
let exerciseSchema = new mongoose.Schema({
  userId : { type: Number, ref: 'user' },
  date: {type: Date},
  duration: {type: Number},
  description: {type: String}
})
exerciseSchema.plugin(autoIncrement.plugin, 'exercise');
module.exports = mongoose.model('exercise', exerciseSchema)
