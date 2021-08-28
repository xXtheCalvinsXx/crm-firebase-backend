/* eslint-disable */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
// import firebase from '@firebase/app';

const config = {
  apiKey: 'AIzaSyC8Tmde2ZCuFnTtZ8HcFLcBckl_fAHs2pQ',
  authDomain: 'xxthecalvinsxx.firebaseapp.com',
  projectId: 'xxthecalvinsxx',
  storageBucket: 'xxthecalvinsxx.appspot.com',
  messagingSenderId: '499087288068',
  appId: '1:499087288068:web:bff61ab7b5f29a81619251',
  measurementId: 'G-GPSZ6V9868',
};
admin.initializeApp(config);

const db = admin.firestore();
// firebase.initializeApp(config);

// @route   GET api/users
// @desc    Gets list of users
// @access  Public
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
