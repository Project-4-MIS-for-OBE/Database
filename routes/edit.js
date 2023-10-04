var express = require('express');
var router = express.Router();
const { default: axios } = require('axios');


let config_1 = {
  headers: {
    'Authorization': 'Bearer ' + 'CJ-OxPhaSCnn9GuWN0r2t'
  }
};
let config_2 = {
  headers: {
    'Authorization': 'Bearer ' + '1233057d-6e6b-4543-8e06-dd76c57154a8'
  }
};




/* GET home page. */
router.get('/', async (req, res) => {
  try {
    // Get parameters from the request query
    const courseNo = req.query.courseNo;
    const year = req.query.year;
    const semester = req.query.semester;
    const section = req.query.section;

    // Fetch course data from the first API endpoint
    const response1 = await axios.get('https://qa.cpe.eng.cmu.ac.th/api/3rdParty/course?semester=' + `${semester}` + '&year=' + `${year}`, config_1);
    
    // Filter courses where coordinatorCmuAccount matches the specified email
    // const coursesFilteredByCoordinator = response1.data.courses.filter((courseno) => {
    //   return courseno.courseNo === courseNo;
    // });
    let curriculum = null;
    if(Number(section) >700 && Number(section)<=800){
         curriculum = 'ISNE';
    }else{
         curriculum = 'CPE';
    }
    console.log(curriculum);
     const response2 = await axios.get('https://qa.cpe.eng.cmu.ac.th/api/3rdParty/so?curriculum=' + `${curriculum}` + '&year=' + `${year}`, config_1);
     const soList = response2.data.so;
    // Initialize an array to store sections data

    // const sectionsData = [];
    // const relevantCourse = [];
    // // Iterate over each course number
    // for (let i = 0; i < courseNoList.length; i++) {

    //   const courseNo = courseNoList[i];
    //   // Fetch section data from the second API endpoint
    //   const response = await axios.get('https://api.cpe.eng.cmu.ac.th/api/v1/course/sections?courseNo=' + `${courseNo}` + '&year=' + `${year}` + '&semester=' + `${semester}`, config_2);
    //   const tempdatabese = await Coursess.find({ courseNo: courseNo, year: year, semester: semester }).exec();

    //   // Process sections data
    //   const sections =  response.data.sections.map((section) => {
    //     const coTeachers = section.coTeachers || null;
    //     const coTeacherNames = coTeachers.map((coTeacher) => {
    //       return {
    //         // Check if type is 'ExternalTeacher', show fullName; else, show firstNameTH and firstNameEN
    //         type: coTeacher.type,
    //         fullName: coTeacher.type === 'ExternalTeacher' ? coTeacher.fullName : undefined,
    //         NameTH: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameTH + " " + coTeacher.lastNameTH : undefined,
    //         NameEN: coTeacher.type !== 'ExternalTeacher' ? coTeacher.firstNameEN + " " + coTeacher.lastNameEN : undefined,
    //       };
    //     });

    //     const courseTitleEN = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleEN;
    //     const courseTitleTH = response1.data.courses.find((course) => course.courseNo === courseNo)?.courseTitleTH;

    //     let statuss = "fail"; // Default status if no sectionNumber equals "1"
    //     let csoList = null;  // Initialize csoList to a default value (null) or an appropriate default based on your use case.
    //     function findCourse(courseNo) {
    //       return response1.data.courses.find((course) => {
    //         return course.courseNo === courseNo;
    //       });
    //     }

        



    
    //       const foundCourse = findCourse(courseNo);
    //     if (foundCourse) {
    //        csoList = foundCourse.csoList;
    //        csoList.forEach((csoItem) => {
    //         csoItem.Csoscore = 0;
    //       });
    //     }
        
    //       const a = {
    //         courseNo: courseNo,
    //         year: year,
    //         semester: semester,
    //         csoList:csoList,
    //         section: [
    //           {
    //             sectionNumber: section.section,
    //             status: "In Progress"
    //           }
    //         ]
    //       };
      
    //       if (tempdatabese.length > 0) {
    //         // At least one course found
    //         //const tempdatabese = tempdatabese[0];
    //         const sectionNumbers = tempdatabese[0].section.map(section => section.sectionNumber);
    //         const allstatus = tempdatabese[0].section.map(section => section.status);
    //         let sectionAsString = section.section.toString();
      
    //         for (let i = 0; i < tempdatabese[0].section.length; i++) {
    //           if (sectionNumbers[i] === sectionAsString) {
    //             statuss = allstatus[i];
    //             break; // Found a section with sectionNumber === "1", exit the loop
    //           }
    //         }
      
    //         if (statuss == "fail") {
    //             // Add the new section to the course
    //             tempdatabese[0].section.push({
    //               sectionNumber: sectionAsString,
    //               status: "In Progress"
    //             });
    //             statuss = "In Progress";
    //         }
    //       } else {
    //         // No courses found, so create a new one
    //         statuss = "In Progress";
    //         tempdatabese.push(a);
    //       }
      










    //     if (emailPrefix === section.teacher.firstNameEN.toLowerCase()) {
    //       instructorName = section.teacher.firstNameEN + " " + section.teacher.lastNameEN;
    //       return {
    //         courseNo: courseNo,
    //         sectionNo: [section.section],
    //         courseTitleTH: courseTitleTH,
    //         courseTitleEN: courseTitleEN,
    //         NameTH: section.teacher.firstNameTH + " " + section.teacher.lastNameTH,
    //         NameEN: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
    //         coTeachers: coTeachers.length > 0 ? coTeacherNames : null,
    //         status: statuss,
    //       };
    //     } else {
    //       const relevant = {
    //         courseNo: courseNo,
    //         section: section.section,
    //         courseTitleTH: courseTitleTH,
    //         courseTitleEN: courseTitleEN,
    //         instructorName: section.teacher.firstNameEN + " " + section.teacher.lastNameEN,
    //         coTeachers: coTeachers.length > 0 ? coTeacherNames : null
    //       };
    //       relevantCourse.push(relevant);
    //       return null; // Skip this section if the condition is not met
    //     }
    //   });

    //   // Filter out sections that are null (didn't meet the condition)
    //   const validSections = sections.filter((section) => section !== null);

    //   // Group sections with the same courseNo, NameEN, and similar coTeachers
    //   validSections.forEach((section) => {
    //     const existingSection = sectionsData.find((s) =>
    //       s.courseNo === section.courseNo &&
    //       s.NameEN === section.NameEN &&
    //       JSON.stringify(s.coTeachers) === JSON.stringify(section.coTeachers)
    //     );

    //     if (existingSection) {
    //       existingSection.sectionNo.push(section.sectionNo);
    //     } else {
    //       section.sectionNo = [section.sectionNo];
    //       sectionsData.push(section);
    //     }
    //   });
    //   console.log(tempdatabese);
    //    const save = new Coursess(tempdatabese[0]);
    //    console.log(save);
    //   save.save();
    // }

    // // Convert sectionNo arrays to comma-separated strings
    // sectionsData.forEach((section) => {
    //   section.sectionNo = section.sectionNo.join([', ']);
    // });

    // sectionsData.sort((a, b) => a.courseNo.localeCompare(b.courseNo));
    // sectionsData.sectionNo = [sectionsData.sectionNo ];

    res.status(200).json({soList});
 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


module.exports = router
