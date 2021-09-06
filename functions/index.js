/* eslint-disable */
const functions = require('firebase-functions');

const app = require('express')();

const { db } = require('./util/admin');

const { 
  getAllEvents,
  addNewEvent
} = require('./handlers/events');

// Event routes
app.get('/events', getAllEvents);
app.post('/addevent', addNewEvent);

const { 
  getAllContacts,
  addNewContact,
  deleteContact,
  updateContact
} = require('./handlers/contacts');

// Contact routes
app.get('/contacts', getAllContacts);
app.post('/addcontact', addNewContact);
app.delete('/contact/:contactId', deleteContact);
app.put('/contact/:contactId', updateContact);

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
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2,
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
