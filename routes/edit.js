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

    const tempdatabese = await Coursess.find({ courseNo: courseNo, year: year, semester: semester }).exec();


    // const coursesFilteredBycourseNo = response1.data.courses.filter((course) => {
    //   return course.courseNo === courseNo;
    // });

    // const coursesFilteredBycurriculum = coursesFilteredBycourseNo.filter((course) => {
    //   return course.curriculum == curriculum;
    // });
    const csoList = tempdatabese[0].csoList;
    for (let i = 0; i < section.length; i++) {
      if (!tempdatabese[0].section[i]) {
        // If csoList[i] does not exist, initialize it as an object
        tempdatabese[0].section[i] = {};
      }
      tempdatabese[0].section[i].status = "In Progress";
    }
    const save1 = new Coursess(tempdatabese[0]);
    save1.save();


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
    // const save = new Coursess(tempdatabese[0]);
    // save.save();
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

    const csoavgeach = [];
    const csoavg = [];
    for (let i = 0; i < NumberPeoplei.length; i++) {
      const csoavgeachi = [];
      for (let j = 0; j < NumberPeoplei[i].length; j++) {
        let sum = 0.0;
        let count = 0;
        for (let k = 0; k < NumberPeoplei[i][j].length; k++) {
          sum = sum + NumberPeoplei[i][j][k] * k;
          count = count + NumberPeoplei[i][j][k];
        }
        sum = sum / count;
        csoavgeachi.push(sum);
      }
      csoavgeach.push(csoavgeachi);
    }
    // tempsec.csoScoreEachSec.push(csoavgeach);
    // tempsec.status = "Success";
    // const save1 = new Coursess({courseNo:tempdatabese[0].courseNo,year:tempdatabese[0].year,semester:tempdatabese[0].semester,csoList:tempdatabese[0].csoList,status:tempdatabese[0].status,section:tempsec});
    // save1.save();

    if (tempdatabese && tempdatabese.length > 0) {
      for (let i = 0; i < tempdatabese[0].section.length; i++) {
        if (!tempdatabese[0].section[i]) {
          // Initialize csoScoreEachSec and other properties as needed
          tempdatabese[0].section[i] = {
            csoScoreEachSec: [],
            status: "Waiting"
          };
        }
        if (tempdatabese[0].section[i].sectionNumber[0] === section) {

          if (tempdatabese[0].section[i].csoScoreEachSec.length === 0) {
            tempdatabese[0].section[i].csoScoreEachSec.push(csoavgeach);
            tempdatabese[0].section[i].status = "Success";
          }
        }
      }
    }


    // for (let i = 0; i < tempdatabese[0].section.length; i++) {
    //   if (!tempdatabese[0].section[i]) {
    //     // If csoList[i] does not exist, initialize it as an object
    //     tempdatabese[0].section[i] = {};
    //   }
    //   if (!tempdatabese[0].section[i].csoScoreEachSec) {
    //     // If scoreUsesList does not exist, initialize it as an empty array
    //     tempdatabese[0].section[i].csoScoreEachSec = [];
    //   } if (tempdatabese.section[i].sectionNumber == section) {
    //     if (tempdatabese[0].section[i].csoScoreEachSec.length == 0) {
    //       tempdatabese[0].section[i].csoScoreEachSec.push(csoavgeach);
    //       tempdatabese[0].section[i].status = "Success";

    //     }
    //   }
    // }
      let a = 0;

      for (let i = 0; i < tempdatabese[0].section.length; i++) {
        if (tempdatabese[0].section[i].status == "Success") {
          a++;

        }
      }
      if (a == (tempdatabese[0].section.length - 1)) {
        tempdatabese[0].status = "Success";
      }
      else {
        tempdatabese[0].status = "Waiting";
      }
      // let b =[]

      // if (tempdatabese[0].status == "Waiting") {
      //   for (let i = 0; i < tempdatabese[0].section.length; i++) {
      //     for (let j = 0; j < tempdatabese[0].section[i].csoScoreEachSec.length; j++) {
      //       for (let k = 0; k < tempdatabese[0].section[i].csoScoreEachSec[j].length; k++) {
      //         console.log(tempdatabese[0].section[i].csoScoreEachSec[j].length)
      //         for (let l = 0; l < tempdatabese[0].section[i].csoScoreEachSec[j][k].length; l++) {
      //           if(l<tempdatabese[0].section[i].csoScoreEachSec[j][k].length){
      //             b.push(tempdatabese[0].section[i].csoScoreEachSec[j][k][l])
      //           }

               

      //         }
      //       }
      //     }
      //   }
      // }
      // console.log(b)


      const save1 = new Coursess(tempdatabese[0]);
      save1.save();





      res.status(200).json(tempdatabese[0]);

      // Fetch course data from the first API endpoint

      // res.status(200).json({
      //   scoreUsesList: scoreUsesList,
      //   NumberPeople: NumberPeoplei,
      //   csoavg: csoavgeach
      // });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  })

module.exports = router




