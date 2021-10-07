/* eslint-disable */
const functions = require('firebase-functions');

const app = require('express')();

// const { db, admin } = require('./util/admin');

var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})



const { 
  getAllEvents,
  getEventsByContact,
  addNewEvent,
  deleteEvent,
  updateEvent
} = require('../functions/handlers/events');

// Event routes
app.get('/events', getAllEvents);
app.get('/events/:contactId', getEventsByContact);
app.post('/event', addNewEvent);
app.delete('/event/:eventId', deleteEvent);
app.put('/event/:eventId', updateEvent);

const { 
  getAllContacts,
  addNewContact,
  deleteContact,
  updateContact,
  orderByName,
  // searchForName,
  orderByLocation,
  orderByCompany,
  uploadImage
} = require('../functions/handlers/contacts');

// Contact routes
app.get('/contacts', getAllContacts);
app.post('/contact', addNewContact);
app.delete('/contact/:contactId', deleteContact);
app.put('/contact/:contactId', updateContact);
app.get('/contacts/sort/name',orderByName);
app.get('/contacts/sort/location',orderByLocation);
app.get('/contacts/sort/company',orderByCompany);
app.post('/contacts/:contactId/image',uploadImage);
// app.get('/contacts/search/name',searchForName);

// Signup route
exports.api = functions.region('australia-southeast1').https.onRequest(app);
