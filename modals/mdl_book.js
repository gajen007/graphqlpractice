const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema({
    //NOT NECESSARY FOR ID, AS IT WILL BE ASSIGNED AUTOMATICALLY
    name: String,
    authorID: String
});
module.exports = mongoose.model("Book",bookSchema);
 