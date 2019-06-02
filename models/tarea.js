const mongoose = require("mongoose");
const toJson = require('@meanie/mongoose-to-json');
//const AutoIncrement = require('mongoose-sequence')(mongoose);
var Schema = mongoose.Schema;

var tareaSchema = new Schema({
  id: Number,
  description: String,
  status: String,
  date: Date
});
//tareaSchema.plugin(AutoIncrement);
tareaSchema.plugin(toJson);
const Tarea = mongoose.model('Task',tareaSchema);

module.exports = Tarea;