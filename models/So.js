const mongoose = require('mongoose');

const soSchema = new mongoose.Schema(
    {
        courseNo: {
            type : String,
            required : 'Course can not be blank'},
        year : String,
        semester : String,
        section : {
            type : String,
            required : 'Course can not be blank'},
        soScore : 
        {
            so1: Number,
            so2: Number,
            so3: Number,
            so4: Number,
            so5: Number,
            so6: Number,
            so7: Number
        }
      },
    { collection: 'so' })

    module.exports = mongoose.model('so', soSchema);