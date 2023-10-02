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
        instructorName  = section.teacher.firstNameEN + " " + section.teacher.lastNameEN;
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
  
      res.status(200).json({ instructorName,sectionsData });
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
        instructorName  = section.teacher.firstNameEN + " " + section.teacher.lastNameEN;
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
  
      res.status(200).json({ instructorName,sectionsData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })


module.exports = router