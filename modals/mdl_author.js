const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const authorSchema = new Schema({
    //NOT NECESSARY FOR ID, AS IT WILL BE ASSIGNED AUTOMATICALLY
    name: String,
});
module.exports = mongoose.model("Author",authorSchema);