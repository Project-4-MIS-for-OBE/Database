const express = require('express');
const { default: axios } = require('axios');
const Coursess = require('../models/Course.js');


const router = express.Router()
let config_1 = {
  headers: {
    'Authorization': 'Bearer ' + 'CJ-OxPhaSCnn9GuWN0r2t'
  }
}
let config_2 = {
  headers: {
    'Authorization': 'Bearer ' + '1233057d-6e6b-4543-8e06-dd76c57154a8'
  }
}
router.get('/', async (req, res) => {
  try {
    // Get parameters from the request query
    const tEmail = req.query.tEmail;
    const year = req.query.year;
    const semester = req.query.semester;

    const emailPrefix = tEmail.split('.')[0].toLowerCase();

    // Fetch course data from the first API endpoint
    const response1 = await axios.get('https://qa.cpe.eng.cmu.ac.th/api/3rdParty/course?semester=' + `${semester}` + '&year=' + `${year}`, config_1);

    // Filter courses where coordinatorCmuAccount matches the specified email
    const coursesFilteredByCoordinator = response1.data.courses.filter((course) => {
      return course.coordinatorCmuAccount === tEmail;
    });

    // Extract courseNo for the filtered courses
    const courseNoList = coursesFilteredByCoordinator.map((course) => {
      return course.courseNo;
    });

    // Initialize an array to store sections data

    const sectionsData = [];

    // Iterate over each course number
    for (let i = 0; i < courseNoList.length; i++) {
      const courseNo = courseNoList[i];

      // Fetch section data from the second API endpoint
      const response = await axios.get('https://api.cpe.eng.cmu.ac.th/api/v1/course/sections?courseNo=' + `${courseNo}` + '&year=' + `${year}` + '&semester=' + `${semester}`, config_2);

      // Process sections data
      const sections = response.data.sections.map((section) => {
        const coTeachers = section.coTeachers || null;
        const coTeacherNames = coTeachers.map((coTeacher) => {
          return {
            // Check if type is 'ExternalTeacher', show fullName; else, show firstNameTH and firstNameEN
            type: coTeacher.type,
            fullName: coTeacher.type === 'ExternalTeacher' ? coTeacher.fullName : undefined,
            NameTH: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameTH + " " + coTeacher.lastNameTH : undefined,
            NameEN: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameEN + " " + coTeacher.lastNameEN : undefined,
          };
        });

        const courseTitleEN = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleEN;
        const courseTitleTH = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleTH;

        if (emailPrefix === section.teacher.firstNameEN.toLowerCase()) {
          instructorName = section.teacher.firstNameEN + " " + section.teacher.lastNameEN;
          return {
            courseNo: courseNo,
            sectionNo: section.section,
            courseTitleTH: courseTitleTH,
            courseTitleEN: courseTitleEN,
            NameTH: section.teacher.firstNameTH + " " + section.teacher.lastNameTH,
            NameEN: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
            coTeachers: coTeachers.length > 0 ? coTeacherNames : null,
          };
        } else {
          return null; // Skip this section if the condition is not met
        }
      });

      // Filter out sections that are null (didn't meet the condition)
      const validSections = sections.filter((section) => section !== null);

      // Group sections with the same courseNo, NameEN, and similar coTeachers
      validSections.forEach((section) => {
        const existingSection = sectionsData.find((s) =>
          s.courseNo === section.courseNo &&
          s.NameEN === section.NameEN &&
          JSON.stringify(s.coTeachers) === JSON.stringify(section.coTeachers)
        );

        if (existingSection) {
          existingSection.sectionNo.push(section.sectionNo);
        } else {
          section.sectionNo = [section.sectionNo];
          sectionsData.push(section);
        }
      });
    }

    // Convert sectionNo arrays to comma-separated strings
    sectionsData.forEach((section) => {
      section.sectionNo = section.sectionNo.join(', ');
    });

    sectionsData.sort((a, b) => a.courseNo.localeCompare(b.courseNo));

    res.status(200).json({ instructorName, sectionsData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/test', async (req, res) => {
  try {
    // Get parameters from the request query
    const tEmail = req.query.tEmail;
    const year = req.query.year;
    const semester = req.query.semester;

    const emailPrefix = tEmail.split('.')[0].toLowerCase();

    // Fetch course data from the first API endpoint
    const response1 = await axios.get('https://qa.cpe.eng.cmu.ac.th/api/3rdParty/course?semester=' + `${semester}` + '&year=' + `${year}`, config_1);

    // Filter courses where coordinatorCmuAccount matches the specified email
    const coursesFilteredByCoordinator = response1.data.courses.filter((course) => {
      return course.coordinatorCmuAccount === tEmail;
    });

    // Extract courseNo for the filtered courses
    const courseNoList = coursesFilteredByCoordinator.map((course) => {
      return course.courseNo;
    });

    // Initialize an array to store sections data

    const sectionsData = [];
    const relevantCourse = [];
    // Iterate over each course number
    for (let i = 0; i < courseNoList.length; i++) {

      const courseNo = courseNoList[i];

      // Fetch section data from the second API endpoint
      const response = await axios.get('https://api.cpe.eng.cmu.ac.th/api/v1/course/sections?courseNo=' + `${courseNo}` + '&year=' + `${year}` + '&semester=' + `${semester}`, config_2);

      // Process sections data
      const sections =  response.data.sections.map((section) => {
        const coTeachers = section.coTeachers || null;
        const coTeacherNames = coTeachers.map((coTeacher) => {
          return {
            // Check if type is 'ExternalTeacher', show fullName; else, show firstNameTH and firstNameEN
            type: coTeacher.type,
            fullName: coTeacher.type === 'ExternalTeacher' ? coTeacher.fullName : undefined,
            NameTH: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameTH + " " + coTeacher.lastNameTH : undefined,
            NameEN: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameEN + " " + coTeacher.lastNameEN : undefined,
          };
        });

        const courseTitleEN = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleEN;
        const courseTitleTH = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleTH;

        let statuss = "fail"; // Default status if no sectionNumber equals "1"
        let csoList = null;  // Initialize csoList to a default value (null) or an appropriate default based on your use case.
        function findCourse(courseNo) {
          return response1.data.courses.find((course) => {
            return course.courseNo === courseNo;
          });
        }

        



    
        Coursess.find({ courseNo: courseNo, year: year, semester: semester }).exec()
        .then(courses => {
          const foundCourse = findCourse(courseNo);
        if (foundCourse) {
           csoList = foundCourse.csoList;
        }
          const a = {
            courseNo: courseNo,
            year: year,
            semester: semester,
            csoList:csoList,
            section: [
              {
                sectionNumber: section.section,
                status: "In Progress"
              }
            ]
          };
      
          if (courses.length > 0) {
            // At least one course found
            const courseToUpdate = courses[0];
            const sectionNumbers = courseToUpdate.section.map(section => section.sectionNumber);
            const allstatus = courseToUpdate.section.map(section => section.status);
            let sectionAsString = section.section.toString();
      
            for (let i = 0; i < courseToUpdate.section.length; i++) {
              if (sectionNumbers[i] === sectionAsString) {
                statuss = allstatus[i];
                break; // Found a section with sectionNumber === "1", exit the loop
              }
            }
      
            if (statuss == "fail") {
              const existingSection = courseToUpdate.section.find(section => section.sectionNumber === sectionAsString);

              if (existingSection) {
                // Handle the case where the section already exists (update or handle as needed)
                // For example, you can update the status of the existing section:
                existingSection.status = "In Progress";
              } else {
                // Add the new section to the course
                courseToUpdate.section.push({
                  sectionNumber: sectionAsString,
                  status: "In Progress"
                });
                statuss = "In Progress";
                
                courseToUpdate.save()
                  .then(savedCourse => {
                    statuss = "In Progress";
                    // Course updated successfully
                  })
                  .catch(error => {
                  });
              }
            }
          } else {
            // No courses found, so create a new one
            const courseInstance = new Coursess(a);
            statuss = "In Progress";
            courseInstance.save()
              .then(savedCourse => {
                // Course created successfully
              })
              .catch(error => {
              });
          }
        });
      










        if (emailPrefix === section.teacher.firstNameEN.toLowerCase()) {
          instructorName = section.teacher.firstNameEN + " " + section.teacher.lastNameEN;
          return {
            courseNo: courseNo,
            sectionNo: [section.section],
            courseTitleTH: courseTitleTH,
            courseTitleEN: courseTitleEN,
            NameTH: section.teacher.firstNameTH + " " + section.teacher.lastNameTH,
            NameEN: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
            coTeachers: coTeachers.length > 0 ? coTeacherNames : null,
            status: statuss,
          };
        } else {
          const relevant = {
            courseNo: courseNo,
<<<<<<< HEAD
            section: section.section,
            courseTitleTH: courseTitleTH,
            courseTitleEN: courseTitleEN,
            instructorName: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
            coTeachers: coTeachers.length > 0 ? coTeacherNames : null,
            status: statuss
=======
            section: [section.section],
            courseTitleTH: courseTitleTH,
            courseTitleEN: courseTitleEN,
            instructorName: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
            coTeachers: coTeachers.length > 0 ? coTeacherNames : null
>>>>>>> 366841ee7fa1ba8d1a6bc041da272740716555f7
          };
          relevantCourse.push(relevant);
          return null; // Skip this section if the condition is not met
        }
      });

      // Filter out sections that are null (didn't meet the condition)
      const validSections = sections.filter((section) => section !== null);

      // Group sections with the same courseNo, NameEN, and similar coTeachers
      validSections.forEach((section) => {
        const existingSection = sectionsData.find((s) =>
          s.courseNo === section.courseNo &&
          s.NameEN === section.NameEN &&
          JSON.stringify(s.coTeachers) === JSON.stringify(section.coTeachers)
        );

        if (existingSection) {
          existingSection.sectionNo.push(section.sectionNo);
        } else {
          section.sectionNo = [section.sectionNo];
          sectionsData.push(section);
        }
      });
<<<<<<< HEAD
=======


     



>>>>>>> 366841ee7fa1ba8d1a6bc041da272740716555f7
    }

    // Convert sectionNo arrays to comma-separated strings
    sectionsData.forEach((section) => {
      section.sectionNo = section.sectionNo.join([', ']);
    });

    sectionsData.sort((a, b) => a.courseNo.localeCompare(b.courseNo));
    sectionsData.sectionNo = [sectionsData.sectionNo ];

<<<<<<< HEAD
    res.status(200).json({ instructorName, sectionsData, relevantCourse });
=======
    res.status(200).json({ instructorName, sectionsData,relevantCourse });
>>>>>>> 366841ee7fa1ba8d1a6bc041da272740716555f7
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


module.exports = router