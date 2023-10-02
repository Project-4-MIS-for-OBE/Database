const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course.js');
const { Db, MongoDBCollectionNamespace } = require('mongodb');



router.get('/', async (req, res) => {
    try {
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
          res.status(200).json(courses);
          
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