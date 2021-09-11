/* eslint-disable */
const functions = require('firebase-functions');

const app = require('express')();

const { db, admin } = require('./util/admin');

const { 
  getAllEvents,
  addNewEvent,
  deleteEvent,
  updateEvent
} = require('./handlers/events');

// Event routes
app.get('/events', getAllEvents);
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


app.get('/users', (req, res) => {
  db.collection('users')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let users = [];
      data.forEach((doc) => {
        users.push({
          userId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });

      return res.json(users);
    })
    .catch((err) => console.error(err));
});

// @route   POST api/signup
// @desc    Add user
// @access  Public

// password must be at least 6 characters apparently
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPass: req.body.confirmPass,
    handle: req.body.handle,
  };

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: 'this handle is aldreay taken' });
      } else {
        return admin
          .auth()
          .createUser({
            email: newUser.email,
            password: newUser.password,
          })
          .then((userRecord) => {
            return res.status(201).json({
              message: `user ${userRecord.uid} signed up succesfully!`,
            });
          })
          .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-exists') {
              return res.status(400).json({ email: 'Email is already in use' });
            } else {
              return res.status(500).json({ error: err.code });
            }
          });
      }
    });
});

// Signup route
exports.api = functions.region('australia-southeast1').https.onRequest(app);
