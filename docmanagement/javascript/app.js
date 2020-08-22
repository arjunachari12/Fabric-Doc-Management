const express = require('express')
const app = express()
const port = 3000
var query = require('./query1.js');
var invoke = require('./invoke1.js');
var fileUploader = require('./fileUploader1.js');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/', (req, res) => {
  res.send('welcome');
})

app.get('/api/docs', async (req, res) => {
    let message = await query.queryChaincode('queryAllDocument','');
    console.log(message);
 	res.send(message);
  })

  app.get('/api/docs:docid', async (req, res) => {
    let docId = req.params.id;
    let message = await query.queryChaincode('queryDocument', docId);
    console.log(message);
 	res.send(message);
  })

  app.get('/api/docs/history:docid', async (req, res) => {
    let docId = req.params.id;
    let message = await query.queryChaincode('getDocHistory', docId);
    console.log(message);
 	res.send(message);
  })

  app.post('/api/docs',  async (req, res) => {
    var docnumber = req.body.docnumber;
    var docName = req.body.docName;
    var location = await fileUploader.upoload();
    var owner = req.body.owner;
    var path = req.body.path;

    let message = await invoke.invokeChaincode('createDoc', docnumber, docName, location, owner, path);
    console.log(message);
 	res.send(message);
})

app.post('/api/docs/changeOwner',  async (req, res) => {
    var docnumber = req.body.docnumber;
     var owner = req.body.owner;
   

    let message = await invoke.invokeChaincode('changeOwner', docnumber, '', '', owner, '');
    console.log(message);
 	res.send(message);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})