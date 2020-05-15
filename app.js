var express = require('express');
var app = express();
var cors = require('cors');
var got = require('got');
const config = require('config');
const baseUrl = 'https://jira.nau.dev/rest/api/latest/';
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get("/projects",function(req,res){
    const options = {username:config.get('credentials.username'),password:config.get('credentials.password')}
    const url = baseUrl+'project?expand=description,lead,url,projectKeys';
    
    got(url,options)
    .then(response => {
        console.log(response.body);
        res.send(response.body);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    })
});

app.get("/users",function(req,res){
  const options = {username:config.get('credentials.username'),password:config.get('credentials.password')}
  const url = baseUrl+'user/search?username=\'\'';
  
  got(url,options)
  .then(response => {
      console.log(response.body);
      res.send(response.body);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

app.get("/statuses",function(req,res){
  const options = {username:config.get('credentials.username'),password:config.get('credentials.password')}
  const url = baseUrl+'status';
  
  got(url,options)
  .then(response => {
      console.log(response.body);
      res.send(response.body);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  })
});

app.get("/issues/:project?",function(req,res){
  const project = req.params.project;
  const url = baseUrl+`search`;

  const name = req.query.name && req.query.name!=='' ? ` AND assignee=\"${req.query.name}\" ` : '';
  const status = req.query.status && req.query.status!=='' ? ` AND status=\"${req.query.status}\" ` : '';

  const postData = JSON.stringify({
    jql:`project=${project}${name}${status}`,
    maxResults: req.query.size ? req.query.size : 20,
    startAt: req.query.index ? req.query.index : 0,
    ...(req.query.fields && {fields: String(req.query.fields).split(",")})
  });

  const options = {
    username:config.get('credentials.username'),
    password:config.get('credentials.password'),
    headers:{
      'Content-Type': 'application/json'
    },
    body:postData
    };

  got.post(url, options)
  .then(response => {
    console.log(response.body);
    res.send(response.body);
  })
  .catch( error => {console.log(error);res.send(error)});
  
});

app.listen(config.get('app.port'), function () {
  if(!verifyConfig) {
    throw("No config file in config folder! Check code comments for instructions.");
    process.exit(1);
    /*
    Create folder "config" in root folder and add a "default.yaml" file."
    In default.yaml, add:

    app:
      port: 3001
    credentials:
      username: Ask Thibaut for username
      password: ask Thibauet for password
    */
  }

  console.log(`Example app listening on port ${config.get('app.port')}!`);
});

function verifyConfig(){
  return config !== undefined;
}

