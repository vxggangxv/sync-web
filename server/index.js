const path = require('path');
const express = require('express');
// const history = require('connect-history-api-fallback');
const app = express(); // create express app
const fs = require('fs');
const xlsx = require('xlsx');

function convertCsvToJson({ langKinds = [] }) {
  const workbook = xlsx.readFile('./static/translation_bridge.csv', { type: 'string' });
  // const workbook = xlsx.readFile('./static/normal.csv', { type: 'string' });
  const sheetNames = Object.keys(workbook.Sheets);

  const sheetName = sheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(sheetData);

  let langCollection = langKinds.reduce((acc, curr) => {
    const obj = { [curr]: null };
    return Object.assign(acc, obj);
  }, {});

  let i = 0;
  while (i < sheetData.length) {
    langKinds.forEach(item => {
      if (sheetData[i][item]) {
        langCollection[item] = {
          ...langCollection[item],
          [sheetData[i]['KEY']]: sheetData[i][item].replace('\\n', '\n'),
          // [sheetData[i]['KEY']]: sheetData[i][item],
        };
      }
    });

    i++;
  }
  console.log('langCollection', langCollection);
  langKinds.forEach(item => {
    fs.writeFileSync(
      `translation.${item.toLowerCase()}.json`,
      JSON.stringify(langCollection[item]),
    );
  });
}

// convertCsvToJson({ langKinds: ['EN', 'KO'] });

// console.log('langData', JSON.stringify(langData));
// fs.writeFileSync('langData.json', JSON.stringify(langData));

// if (!![sheetData[i]['KEY']] && sheetData[i]['EN']) {
//   langData = {
//     ...langData,
//     [sheetData[i]['KEY']]: sheetData[i]['EN'].replace('\\n', '\n'),
//   };
// }
// if (isConvertCsvToJson === false) {
//   fs.writeFileSync('langText.json', JSON.stringify(langData));
// }

// isConvertCsvToJson = true;

// let i = sheetNames.length;

// while (i--) {
//   const sheetName = sheetNames[i];
//   // console.log('sheetName', sheetName);
//   resData[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
//   console.log('resData[sheetName]', resData[sheetName]);
// }

// console.log('resData', resData);
// console.log('resData.sheetNames', resData[sheetNames[0]]);
// const langData = resData[sheetNames[0]];
// fs.writeFile('langText.json', langData, () => {});
// fs.writeFileSync('langText.json', resData.sheetNames);
// const fileName = 'langText.json';
// fs.writeFile('langText.json', resData.sheetNames, () => {});
// fs.writeFileSync('langText.json', resData.sheetNames);

// let student = {
//   name: 'Mike',
//   age: 23,
//   gender: 'Male',
//   department: 'English',
//   car: 'Honda',
// };

// let data = JSON.stringify(student);
// fs.writeFileSync('student-2.json', data);

// fs.open(fileName, 'w', (err, fileId) => {
//   console.log('file open');
//   if (err) throw err;
//   console.log('fileId', fileId);

//   fs.writeFileSync(fileName, resData.sheetNames, err => {
//     if (err) throw err;
//     console.log('The file has been saved!');
//     fs.close(fileName, () => {
//       console.log('file close');
//     });
//   });
// });
// fs.writeFileSync('test.json', 'resData.sheetNames');

// add middlewares
// app.use(history());
app.use(express.static(path.join(__dirname, '../build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });

// start express server on port 5000
app.listen(5000, () => {
  console.log('http://127.0.0.1:5000 server started on port 5000');
});
