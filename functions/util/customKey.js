/* eslint-disable */

// code from firebase documentation

// var {google} = require("googleapis");

// // Load the service account key JSON file.
// var serviceAccount = require('./xxthecalvinsxx-firebase-adminsdk-p9n5s-edf52daca8.json');

// // Define the required scopes.
// var scopes = [
//   "https://www.googleapis.com/auth/userinfo.email",
//   "https://www.googleapis.com/auth/firebase.database"
// ];

// // Authenticate a JWT client with the service account.
// var jwtClient = new google.auth.JWT(
//   serviceAccount.client_email,
//   null,
//   serviceAccount.private_key,
//   scopes
// );


// exports.getTestToken = (req, res) => {

//   // Use the JWT client to generate an access token.
//   jwtClient.authorize(function(error, tokens) {
//     if (error) {
//       console.log("Error making request to generate access token:", error);
//     } else if (tokens.access_token === null) {
//       console.log("Provided service account does not have permission to generate access tokens");
//     } else {
//       var accessToken = tokens.access_token;
//       return res.json(accessToken);
  
//       // See the "Using the access token" section below for information
//       // on how to use the access token to send authenticated requests to
//       // the Realtime Database REST API.
//     }
//   });      
// };




/*
NOT USING THIS CODE RIGHT NOW, CUSTOM TOKENS ARE NOT VERIFIABLE
ALSO, THE SDK JSON FILE SHOULD NOT BE PUBLIC AND SHOULD BE REMOVED BEFORE THE END PRODUCT
*/

const { admin } = require('./admin');

exports.getTestToken = (req, res) => {
  const uid = 'rv8dDkGoPUPCwjylxXgTaPqiorm1'

  admin
  .auth()
  .createCustomToken(uid)
  .then((customToken) => {
    return res.json(customToken);
  })
  .catch((error) => {
    console.log('Error creating custom token:', error);
  });
};

