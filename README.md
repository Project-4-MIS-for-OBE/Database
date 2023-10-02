# Database by MongoDB
- mongoose
- express
- nodemon
## JSON POST BODY
```
{
  "courseNo": "261336",
  "year": "2566",
  "semester": "1",
  "section": [
    {
      "sectionNumber": "801",
      "csoList": [
        {
          "objEN": "Able to describe how web application technology works",
          "objTH": "อธิบายหลักการทำงานของเว็บแอพพลิเคชันและการสื่อสารที่เกี่ยวข้อง",
          "selectedSO": [7],
          "csoScore": 1
        },
        {
          "objEN": "Able to develop a web application using software framework",
          "objTH": "พัฒนาเว็บแอพพลิเคชันด้วยเฟรมเวิร์คด้านซอฟต์แวร์ได้",
          "selectedSO": [5, 1],
          "csoScore": 2
        },
        {
          "objEN": "Able to develop data service using software framework",
          "objTH": "พัฒนาบริการข้อมูลเบื้องหลังด้วยเฟรมเวิร์คด้านซอฟต์แวร์ได้",
          "selectedSO": [1, 5],
          "csoScore": 3
        }
      ]
    },
    {
      "sectionNumber": "802",
      "csoList": [
        {
          "objEN": "Example CSO for section 802",
          "objTH": "ตัวอย่าง CSO สำหรับหัวข้อ 802",
          "selectedSO": [3],
          "csoScore": 2
        }
      ]
    }
  ]
}
```
### RUN
- npm install
- nodemon DEBUG=myapp:* & npm start
