const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseNo: {
            type : String,
            required : 'Course can not be blank'},
        year : String,
        semester : String,
        section : {
            type : String,
            required : 'Course can not be blank'},
        csoList : {
          type : Array,
          objEN: String,
          objTH: String,
          selectedSO: [Number],
          csoScore: {
            type : Number,
            default : 0,
            required : true
          }
        }
      },
    { collection: 'courses' })

    module.exports = mongoose.model('courses', courseSchema);