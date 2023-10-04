const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course.js');



router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({ courseNo: '261336', year: '2566', semester: '6' }).exec();
        const a = {
            courseNo: "261336",
            year: "2566",
            semester: "6",
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
                status: "Waiting",
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
            if (sectionNumbers[i] === "2") {
              status = allstatus[i];
              break; // Found a section with sectionNumber === "1", exit the loop
            }
          }

          if (status == "fail"){
            (courses[0].section.push({sectionNumber:"2",status:"In Progress",csoList: [
              {
                objEN: "Example CSO for section 802",
                "objTH": "ตัวอย่าง CSO สำหรับหัวข้อ 802",
                selectedSO: [3],
                csoScore: 2
              }
            ]}))
            status = "In Progress";
            await courses[0].save();
          }
          res.status(200).json(status);
        } else {
          // No courses found
          (await Course.create(a)).save();
          res.status(200).json(a);
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });





module.exports = router;