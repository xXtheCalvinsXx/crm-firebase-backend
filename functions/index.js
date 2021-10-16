/* eslint-disable */
const functions = require('firebase-functions');

const app = require('express')();

const Auth = require('./util/auth');

const cors = require('cors');
app.use(cors());

// const { db, admin } = require('./util/admin');

// const {getTestToken} = require('./util/customKey');
// app.get('/customKey', getTestToken);

const { 
  getAllEvents,
  getEventsByContact,
  getEvent,
  addNewEvent,
  deleteEvent,
  updateEvent
} = require('./handlers/events');

// Event routes
app.get('/events', Auth, getAllEvents);
app.get('/events/:contactId', Auth, getEventsByContact);
app.get('/event/:eventId', Auth, getEvent);
app.post('/event', Auth, addNewEvent);
app.delete('/event/:eventId', Auth, deleteEvent);
app.put('/event/:eventId', Auth, updateEvent);

const { 
  getAllContacts,
  getContact,
  addNewContact,
  deleteContact,
  updateContact,
  // orderByName,
  // searchForName,
  // orderByLocation,
  // orderByCompany,
  uploadImage
} = require('./handlers/contacts');

// Contact routes
app.get('/contacts', Auth, getAllContacts);
app.get('/contact/:contactId', Auth, getContact);
app.post('/contact', Auth, addNewContact);
app.delete('/contact/:contactId', Auth, deleteContact);
app.put('/contact/:contactId', Auth, updateContact);
// app.get('/contacts/sort/name',orderByName);
// app.get('/contacts/sort/location',orderByLocation);
// app.get('/contacts/sort/company',orderByCompany);
app.post('/contacts/:contactId/image', Auth, uploadImage);
// app.get('/contacts/search/name',searchForName);

// Signup route
exports.api = functions.region('australia-southeast1').https.onRequest(app);
