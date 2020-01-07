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
      return leads.push(row)
    })
    .on('end', () => {
      resolve(leads)

    }));
}

// function to assign leads to agent
const myProgram = (agents, leads) => {

  let output;
  while(leads.length) {
    output = agents.map((agent) => {
      const currentAgentLeads = agent["leads"] || [];
      if(agent.status !== 'busy'){
        const agentLeads = leads.splice(0, agent.weight);
        agent["leads"] = currentAgentLeads.concat(agentLeads);
      }
      return agent
    });
  }
  output = output.map((agent) => ({
    ...agent,
    leads: JSON.stringify(agent.leads),
  }));

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

  
let data = output;
  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
}

Promise.all([getAgentsCsv(), getLeadsCsv()]).then((result) => myProgram(result[0], result[1]));