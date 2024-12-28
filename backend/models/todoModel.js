const mongoose = require("mongoose")

const dbSchema = new mongoose.Schema({
    name : {type : String , require : true},
    description : {type : String , require : true},
    completed : {type : Boolean , require : true}
})

module.exports = mongoose.model("Todo",dbSchema)