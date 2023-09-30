const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseNo: {
        type : String,
        required : true
    },
    year : {
        type : String,
        required : true,
        unique: true
    },
    semester : {
        type : String,
        required : true,
        unique: true
    },
    section : [{
        sectionNumber: {
            type: String,
            required: true
        },
        csoList: {
            type: Array,
            objEN: String,
            objTH: String,
            selectedSO: [Number],
            csoScore: {
                type: Number,
                default: 0,
                required: true
            }
        }
    }]
}, { collection: 'courses' });

courseSchema.pre('validate', function(next) {
    const sections = this.section.map(sec => sec.sectionNumber);
    const uniqueSections = new Set(sections);

    if (sections.length !== uniqueSections.size) {
        return next(new Error('Sections must be unique within a course.'));
    }

    next();
});

courseSchema.index({ year: 1, semester: 1}, { unique: true });

module.exports = mongoose.model('courses', courseSchema);
