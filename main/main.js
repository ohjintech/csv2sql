const csvParse = require('csv-parse');
const fs = require('fs');
const path = require('path');
const { cpuUsage } = require('process');

const db = require('./dbModel');

const target = path.join(__dirname, '../assets/AlumniDirectory.csv')
console.log('target path: ', target)



console.log(fs.readFileSync(target))


const columnsObj = {};

fs.readFile((target), (err, data) => {
  csvParse(data, {columns: true, trim: true }, (err, rows) => {

    let firstObj = rows[0]

    const tableStr = createTableStr('sampleTable', firstObj)

    // clean up keys
    const colArr = [];
    Object.keys(firstObj).forEach( (key) => {
      colArr.push(key.replace(' ', '_'))
    })

    writeTable('../sampleDB.sql', tableStr)
    copyTable('../assets/AlumniDirectory.csv', '../sampleDB.sql', 'sampleTable', colArr)
    
  })
})



function createTableStr(tableName, columnsObj) {

    const initStr = `CREATE TABLE ${tableName} (\n`;

    let type
    let columns = initStr + '"id" serial NOT NULL,';
    for ( const [key, value] of Object.entries(columnsObj)) {

      const key_snake = key.replace(' ', '_')
     
      switch (value) {
        case 'string':
          type = 'VARCHAR'
          break;
        case 'number':
          type = 'integer'
          break;
        default:
          type = 'VARCHAR'
      }     
      
      columns = columns + `\n"${key_snake}" ${type},`
      // columns.concat(str)
    }

    return columns + '\n' + 'PRIMARY KEY (id)\n' + ');\n\n'
}


// write file to SQL file
function writeTable(fpath, tableStr) {
  try {
    fs.writeFileSync(fpath, tableStr, {flag: 'w+'})
   }
   catch (err) {
    console.log(err)
   }
}

// copy csv into table
function copyTable(csvPath, fpath, tableName, colArr) {
  let copyStr = 
  `COPY ${tableName}(${colArr.toString()})
  FROM ${csvPath}
  DELIMITER ','
  CSV HEADER;
  `


  try {
    fs.appendFileSync(fpath, copyStr)
   }
   catch (err) {
    console.log(err)
   }
}


// copyTable('./', 'fakeName', ['str1', 'str2'])
// console.log(['str1', 'str2'].toString())
// console.log(JSON.stringify(['str1', 'str2']))
// unused db query function
async function getAll(tableName) {
  const queryStr = `SELECT * from ${tableName};`;

  const { rows } = await db.query(queryStr)

  await console.log('rows', rows)
}



// const data = []
// fs.createReadStream(target)
// .pipe(csvParse({ delimiter: ',' , columns: true}))
// .on('data', row => {
//   data.push(row)
// })
// .on('end', () => {
//   console.log('CSV file successfully processed');
//   // console.log('data: ', data)
// });



// function to create table
// input: tableName, Object containing column name, data type, and required info
// output: SQL query

// createTable(tableName, columnsObj)

  /** columns object
   * {
   *  name: 
   *  datatype:
   *  required:
   * }
   */

  /** expected output from createTable */
  /**
   * 
   * CREATE_TABLE tableName (
   * "_id" serial NOT NULL,
   * "column1" varchar,
   * "numberCol2" integer,
   * 'column3" varchar,
   * "column4" bigint,
   * ) 
   */

  // const sampleObj = { 
//   'Company Name': 'Stem Disintermedia Inc.',
//   Name: 'Mia Huynh',
//   Email: 'mia@stem.is',
//   LinkedIn: 'www.linkedin.com/in/miamyhuynh',
//   Campus: 'LA',
//   Cohort: '22',
//   'Job Title': 'Software Engineer',
//   Industry: '',
//   City: ''
// }
// console.log(createTable('sampleTable', sampleObj))

// const tableStr = createTable('sampleTable', sampleObj)


