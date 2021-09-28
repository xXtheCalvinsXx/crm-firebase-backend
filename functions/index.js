/* eslint-disable */
const functions = require('firebase-functions');

const app = require('express')();

// const { db, admin } = require('./util/admin');

const { 
  getAllEvents,
  getEventsByContact,
  addNewEvent,
  deleteEvent,
  updateEvent
} = require('./handlers/events');

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
} = require('./handlers/contacts');

// Contact routes
app.get('/contacts', getAllContacts);
app.post('/addcontact', addNewContact);
app.delete('/contacts/:contactId', deleteContact);
app.put('/contacts/:contactId', updateContact);
app.get('/contacts/sort/name',orderByName);
app.get('/contacts/sort/location',orderByLocation);
app.get('/contacts/sort/company',orderByCompany);
app.post('/contacts/:contactId/image',uploadImage);
// app.get('/contacts/search/name',searchForName);

// Signup route
exports.api = functions.region('australia-southeast1').https.onRequest(app);
