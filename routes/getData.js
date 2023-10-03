const express = require('express');
const { default: axios } = require('axios');
const mongoose = require('mongoose');
const Course = mongoose.model('course');


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


      const courses = await Course.find({ courseNo: '261336', year: '2566', semester: '5' }).exec();
      const a = {
        courseNo: "261336",
        year: "2566",
        semester: "5",
        section: [
          {
            sectionNumber: "1",
            status: "In Progress",
            csoList: [
              {
                objEN: "Able to describe how web application technology works",
                objTH: "อธิบายหลักการทำงานของเว็บแอพพลิเคชันและการสื่อสารที่เกี่ยวข้อง",
                selectedSO: [7],
                csoScore: 1
              },
              {
                objEN: "Able to develop a web application using software framework",
                objTH: "พัฒนาเว็บแอพพลิเคชันด้วยเฟรมเวิร์คด้านซอฟต์แวร์ได้",
                selectedSO: [5, 1],
                csoScore: 2
              },
              {
                objEN: "Able to develop data service using software framework",
                objTH: "พัฒนาบริการข้อมูลเบื้องหลังด้วยเฟรมเวิร์คด้านซอฟต์แวร์ได้",
                selectedSO: [1, 5],
                csoScore: 3
              }
            ]
          },
          {
            sectionNumber: "2",
            status: "In Progress",
            csoList: [
              {
                objEN: "Example CSO for section 802",
                "objTH": "ตัวอย่าง CSO สำหรับหัวข้อ 802",
                selectedSO: [3],
                csoScore: 2
              }
            ]
          }
        ]
      }
      if (courses.length > 0) {
        // At least one course found
        const sectionNumbers = courses[0].section.map(section => section.sectionNumber);
        const allstatus = courses[0].section.map(section => section.status);
        let status = "fail"; // Default status if no sectionNumber equals "1"

        for (let i = 0; i < courses[0].section.length; i++) {
          if (sectionNumbers[i] === "3") {
            status = allstatus[i];
            break; // Found a section with sectionNumber === "1", exit the loop
          }
        }

        if (status == "fail") {
          (courses[0].section.push({
            sectionNumber: "3", status: "In Progress", csoList: [
              {
                objEN: "Example CSO for section 802",
                "objTH": "ตัวอย่าง CSO สำหรับหัวข้อ 802",
                selectedSO: [3],
                csoScore: 2
              }
            ]
          }))
          status = "In Progress";
          await courses[0].save();
        }
        res.status(200).json(status);
      } else {
        // No courses found
        (await Course.create(a)).save();
        res.status(200).json(a);
      }



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


module.exports = router