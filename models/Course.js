const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        courseID: {
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
          selectSO: [Number],
          csoScore: Number
        }
      },
    { collection: 'courses' })

    module.exports = mongoose.model('courses', courseSchema);