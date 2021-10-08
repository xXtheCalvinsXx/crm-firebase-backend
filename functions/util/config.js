var serviceAccount = require('./xxthecalvinsxx-firebase-adminsdk-p9n5s-edf52daca8.json');
const admin = require('firebase-admin');
module.exports = {
  apiKey: 'AIzaSyC8Tmde2ZCuFnTtZ8HcFLcBckl_fAHs2pQ',
  authDomain: 'xxthecalvinsxx.firebaseapp.com',
  projectId: 'xxthecalvinsxx',
  storageBucket: 'xxthecalvinsxx.appspot.com',
  messagingSenderId: '499087288068',
  appId: '1:499087288068:web:bff61ab7b5f29a81619251',
  measurementId: 'G-GPSZ6V9868',
  //serviceAccountId: 'firebase-adminsdk-p9n5s@xxthecalvinsxx.iam.gserviceaccount.com',
  credential: admin.credential.cert(serviceAccount)
};
