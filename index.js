const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

//function to read agent csv file
function getAgentsCsv() {
  const agents = []
  return new Promise(resolve =>
    fs.createReadStream('agents.csv')
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row);
      return agents.push(row)
    })
    .on('end', () => {
      resolve(agents)
    }));
}

//function to read leads csv file
function getLeadsCsv() {
  const leads = []
  return new Promise(resolve =>
    fs.createReadStream('leads.csv')
    .pipe(csv())
    .on('data', (row) => {
      // console.log(row);
      return leads.push(row)
    })
    .on('end', () => {
      resolve(leads)
      // console.log(leads)
      // console.log('CSV file successfully processed');
    }));
}

// function to assign leads to agent
const myProgram = (agents, leads) => {
  let output;
  output = agents.map((agent) => {
    if (agent.status !== 'busy') {
      agent.leads = leads.splice(0, agent.weight);
    }
    return agent
  });

  const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [{
        id: 'id',
        title: 'ID'
      },
      {
        id: 'name',
        title: 'Name'
      },
      {
        id: 'status',
        title: 'Status'
      },
      {
        id: 'weight',
        title: 'Weight'
      },
      {
        id: 'leads',
        title: 'Leads'
      },
    ]
  });

  const data = output;

  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
}

Promise.all([getAgentsCsv(), getLeadsCsv()]).then((result) => myProgram(result[0], result[1]));