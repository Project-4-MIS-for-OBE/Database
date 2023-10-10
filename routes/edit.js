var express = require('express');
var router = express.Router();
const { default: axios } = require('axios');
const Coursess = require('../models/Course.js');

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
    if (Number(section) > 700 && Number(section) <= 800) {
      curriculum = 'ISNE';
    } else {
      curriculum = 'CPE';
    }
    const response2 = await axios.get('https://qa.cpe.eng.cmu.ac.th/api/3rdParty/so?curriculum=' + `${curriculum}` + '&year=' + `${year}`, config_1);
    const soList = response2.data.so;

    const coursesFilteredBycourseNo = response1.data.courses.filter((course) => {
      return course.courseNo === courseNo;
    });

    const coursesFilteredBycurriculum = coursesFilteredBycourseNo.filter((course) => {
      return course.curriculum == curriculum;
    });
    const csoList = coursesFilteredBycurriculum[0].csoList;

    res.status(200).json({ csoList, soList });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.get('/csoScore', async (req, res) => {
  try {
    // Get parameters from the request query
    const courseNo = req.query.courseNo;
    const year = req.query.year;
    const semester = req.query.semester;
    const section = req.query.section;
    const scoreUsesList = req.body.scoreUsesList;
    const score = req.body.score;
    const standard = req.body.standard;

    const tempdatabese = await Coursess.find({ courseNo: courseNo, year: year, semester: semester }).exec();


    for (let i = 0; i < scoreUsesList.length; i++) {
      if (!tempdatabese[0].csoList[i]) {
        // If csoList[i] does not exist, initialize it as an object
        tempdatabese[0].csoList[i] = {};
      }
      if (!tempdatabese[0].csoList[i].scoreUsesList) {
        // If scoreUsesList does not exist, initialize it as an empty array
        tempdatabese[0].csoList[i].scoreUsesList = [];
      }
      if (tempdatabese[0].csoList[i].scoreUsesList.length == 0) {
        tempdatabese[0].csoList[i].scoreUsesList.push(scoreUsesList[i]);
      }
    }
    const save = new Coursess(tempdatabese[0]);
    save.save();
    const tempsec = tempdatabese[0].section.find((sec) => sec.sectionNumber === section);

    const NumberPeoplei = [];
    for (let i = 0; i < score.length; i++) {
      const NumberPeoplej = [];
      for (let j = 0; j < score[i].length; j++) {
        let NumberPeoplek = [0, 0, 0, 0, 0];
        for (let k = 0; k < score[i][j].length; k++) {
          if (score[i][j][k] <= standard[i][j][0]) {
            NumberPeoplek[0]++;
          }
          else if (score[i][j][k] <= standard[i][j][1]) {
            NumberPeoplek[1]++;
          }
          else if (score[i][j][k] <= standard[i][j][2]) {
            NumberPeoplek[2]++;
          }
          else if (score[i][j][k] <= standard[i][j][3]) {
            NumberPeoplek[3]++;
          }
          else {
            NumberPeoplek[4]++;
          }
        }
        NumberPeoplej.push(NumberPeoplek);
      }
      NumberPeoplei.push(NumberPeoplej);
    }
    
    const csoavgeach =[];
    const csoavg =[];
    for (let i = 0; i < NumberPeoplei.length; i++) {
      for (let j = 0; j < NumberPeoplei[i].length; j++) {
        for (let k = 0; k < NumberPeoplei[i].length; k++) {

        }
      }

    }




    // Fetch course data from the first API endpoint

    res.status(200).json(NumberPeoplei);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router




