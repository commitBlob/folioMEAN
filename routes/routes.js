const express = require('express');
const router = express.Router();
const mongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:" + process.env.DB_PORT + "/";
const httpRequest = require('http');
const request = require('request');
const moment = require('moment');

const database = process.env.DB_PROJECT_NAME;
const buildDispatcher = require('../email/dispatcher');
const buildProjects = require('../utils/projectList');

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

/**
 * path: api/projectslist
 * get array of project objects
 * each object's going to have projectId, projectName, and companyLink
 */
router.get('/projectslist', (req, res, next) => {
  let projectsList = [];
  mongoClient.connect(mongoURL, {useNewUrlParser: true}, (err, client) => {
    if (err) throw err;
    client.db(database).collection('projects').find({active: true}).toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      projectsList = result;
      res.json(buildProjects.buildProjectList(projectsList));
      client.close();
    });
  });
});

/**
 * path: api/allprojects
 * get all active projects
 */
router.get('/allprojects', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('projects').find({active: true}).toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/skills
 * get all skills
 */
router.get('/skills', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('skills_list').find().toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/skillscontent
 * get skills content
 */
router.get('/skillscontent', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('skills_content').find().toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/positions
 * get work experience
 */
router.get('/positions', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('positions').find().toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/profilepictures
 * get profile pictures
 */
router.get('/profilepictures', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('profile_pictures').find().toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/socials
 * get list of social icons
 */
router.get('/socials', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('social_icons').find().toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});

/**
 * path: api/faqs
 * get faqs
 */
router.get('/faqs', (req, res, next) => {
  mongoClient.connect(mongoURL,  { useNewUrlParser: true }, (err, client) => {
    if (err) throw err;
    client.db(database).collection('faqs_list').find({active: true}).sort({position: 1}).toArray( (searchErr, result) => {
      if (searchErr) throw searchErr;
      res.json(result);
      client.close();
    });
  });
});


module.exports = router;
