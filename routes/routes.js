const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:" + process.env.DB_PORT + "/";
const httpRequest = require('http');
const request = require('request');
const moment = require('moment');

const database = process.env.DB_PROJECT_NAME;
const buildDispatcher = require('../email/dispatcher');

/**
 * path: api/notify
 * contact form handler
 * Doesn't work with current creds (2 step authentication)
 */
router.post('/notify', (req, res, next) => {
  const formData = req.body;

  console.log('-----------------------------------------');
  console.log('FORM DATA', formData);
  console.log('-----------------------------------------');

  const buildTemplate = {
    from: formData.email,
    to: 'maro.radovic12@gmail.com',
    subject: 'Alo alo Nova Folio Poruka',
    html: '<p><b>Od: </b>' + formData.name +'</p><p><b>Sto Kaze: </b>'+ formData.message +'</p>'
  };

  let responseMessage = {
    status: '',
    header: '',
    message: ''
  };

  if (!formData) {
    res.status(400);
    responseMessage.status = 'ERROR';
    responseMessage.header = 'ERROR - 400';
    responseMessage.message = 'Whoops, I might have lost your form data. Bummer';
    res.json(responseMessage);
  } else {
    console.log('-----------------------------------------');
    console.log('------------ HAVE FORM DATA -------------');
    buildDispatcher.sendEmail(buildTemplate);
    res.status(200);
    responseMessage.status = 'SUCCESS';
    responseMessage.header = '{AI-bot-name} says Thanks';
    responseMessage.message = '{AI-bot-name} has processed your message, he will make sure it is dispatched to Maro.';
    res.json(responseMessage);
  }

});

/**
 * path: api/projectdetails/:projectId
 * get project details depending on id provided
 */
router.get('/projectdetails/:projectId', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('project_details').find({id: parseInt(req.params.projectId)}).toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

module.exports = router;
