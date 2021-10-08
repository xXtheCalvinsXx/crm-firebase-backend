/* eslint-disable */

const { admin, db } = require('../util/admin');
const config = require("../util/config");
const noImg = "no-img.jpg";

// gets all contacts for a user
exports.getAllContacts = (req, res) => {
    db.collection('contacts')
      .orderBy('Date')
      .get()
      .then((data) => {
        let contacts = [];
        data.forEach((doc) => {
          if (doc.data().RelevantUser == req.user.email){
          contacts.push({
            contactId: doc.id,
            Date: doc.data().Date,
            Name: doc.data().Name,
            Location: doc.data().Location,
            Position: doc.data().Position,
            Company: doc.data().Company,
            //Last: 
            //Next: 
            Birthday: doc.data().Birthday,
            Industry: doc.data().Industry,
            Email: doc.data().Email,
            Education: doc.data().Education,
            Phone_Number: doc.data().Phone_Number,
            imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            RelevantUser: req.user.email
          });
        }
      });
      return res.json(contacts);
      })
      .catch((err) => console.error(err));
};

// add a contact for a user
exports.addNewContact = (req, res) => {
  
    const newContact = {
      Name: req.body.Name,
      Location: req.body.Location,
      Date: new Date().toISOString(),
      Company: req.body.Company,
      Position: req.body.Position,
      //Last_EVENT to fill after merge
      //Next_EVENT 
      Birthday: req.body.Birthday,
      Education: req.body.Education,
      Industry: req.body.Industry,
      Email: req.body.Email,
      Phone_Number: req.body.Phone_Number,
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
      RelevantUser: req.user.email
    };
  
    db.collection('contacts')
      .add(newContact)
      .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` });
      })
      .catch((err) => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
      });
};

// Delete a contact for a user
exports.deleteContact= (req, res) => {
  const document = db.doc(`/contacts/${req.params.contactId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      if (doc.data().RelevantUser !== req.user.email){ // req.user.email is from the middleware in auth.js
        return res.status(403).json({ error: 'Unauthorized' });
      }
      else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Contact deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};


// Update a contact for a user
exports.updateContact= (req, res) => {
  const document = db.doc(`/contacts/${req.params.contactId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      if (doc.data().RelevantUser !== req.user.email){ // req.user.email is from the middleware in auth.js
        return res.status(403).json({ error: 'Unauthorized' });
      }
      else {
        
        if(req.body.Name){
          document.update({Name: req.body.Name});
        }
        if(req.body.Location){
          document.update({Location: req.body.Location});
        }
        if(req.body.Company){
          document.update({Company: req.body.Company});
        }
        if(req.body.Position){
          document.update({Position: req.body.Position});
        }
        if(req.body.Birthday){
          document.update({Birthday: req.body.Birthday});
        }
        if(req.body.Education){
          document.update({Education: req.body.Education});
        }
        if(req.body.Industry){
          document.update({Industry: req.body.Industry});
        }
        if(req.body.Email){
          document.update({Email: req.body.Email});
        }
        if(req.body.Phone_Number){
          document.update({Phone_Number: req.body.Phone_Number});
        }
      }
    })
    .then(() => {
      res.json({ message: 'Contact updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};


// add image for contact

// Upload a profile image for contact
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token


  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
            //Generate token to be appended to imageUrl
          },
        },
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        const document = db.doc(`/contacts/${req.params.contactId}`);

        if (!document.exists) {
          return res.status(404).json({ error: 'Contact not found' });
        }
        if (document.data().RelevantUser !== req.user.email){ // req.user.email is from the middleware in auth.js
          return res.status(403).json({ error: 'Unauthorized' });
        }
        else {
          return document.update({ imageUrl });
          // return db.doc(`/users/${req.user.email}`).update({ imageUrl });
        }
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

// search, filter and sort not needed any more

// // sort alphabetically by name
// exports.orderByName = (req, res) => {
//   db.collection('contacts')
//     .orderBy('Name')
//     .get()
//     .then((data) => {
//       let contacts = [];
//       data.forEach((doc) => {
//         contacts.push({
//           contactId: doc.id,
//           Date: doc.data().Date,
//           Name: doc.data().Name,
//           Location: doc.data().Location,
//           Position: doc.data().Position,
//           Company: doc.data().Company,
//           //Last: 
//           //Next: 
//           Birthday: doc.data().Birthday,
//           Industry: doc.data().Industry,
//           Email: doc.data().Email,
//           Education: doc.data().Education,
//           Phone_Number: doc.data().Phone_Number,
//           imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
//         });
//       });
      
//       return res.json(contacts);
//     })
//     .catch((err) => console.error(err));
// };


// // sort by location
// exports.orderByLocation = (req, res) => {
//   db.collection('contacts')
//     .orderBy('Location')
//     .get()
//     .then((data) => {
//       let contacts = [];
//       data.forEach((doc) => {
//         contacts.push({
//           contactId: doc.id,
//           Date: doc.data().Date,
//           Name: doc.data().Name,
//           Location: doc.data().Location,
//           Position: doc.data().Position,
//           Company: doc.data().Company,
//           //Last: 
//           //Next: 
//           Birthday: doc.data().Birthday,
//           Industry: doc.data().Industry,
//           Email: doc.data().Email,
//           Education: doc.data().Education,
//           Phone_Number: doc.data().Phone_Number,
//           imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
//         });
//       });
      
//       return res.json(contacts);
//     })
//     .catch((err) => console.error(err));
// };


// // sort by company
// exports.orderByCompany= (req, res) => {
//   db.collection('contacts')
//     .orderBy('Company')
//     .get()
//     .then((data) => {
//       let contacts = [];
//       data.forEach((doc) => {
//         contacts.push({
//           contactId: doc.id,
//           Date: doc.data().Date,
//           Name: doc.data().Name,
//           Location: doc.data().Location,
//           Position: doc.data().Position,
//           Company: doc.data().Company,
//           //Last: 
//           //Next: 
//           Birthday: doc.data().Birthday,
//           Industry: doc.data().Industry,
//           Email: doc.data().Email,
//           Education: doc.data().Education,
//           Phone_Number: doc.data().Phone_Number,
//           imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
//         });
//       });
      
//       return res.json(contacts);
//     })
//     .catch((err) => console.error(err));
// };


// const q = query(collection(db, "cities"), where("capital", "==", true));

// const querySnapshot = await getDocs(q);
// querySnapshot.forEach((doc) => {
//   // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
// });


// filter by name
// exports.searchForName = (req, res) => {
//   db.collection('contacts')
//     .where('Name','==','joe')
//     .orderBy('Name')
//     .get()
//     .then((data) => {
//       let contacts = [];
//       data.forEach((doc) => {
//         contacts.push({
//           contactId: doc.id,
//           Date: doc.data().Date,
//           Name: doc.data().Name,
//           Location: doc.data().Location,
//           Position: doc.data().Position,
//           Company: doc.data().Company,
//           //Last: 
//           //Next: 
//           Birthday: doc.data().Birthday,
//           Industry: doc.data().Industry,
//           Email: doc.data().Email,
//           Education: doc.data().Education,
//           Phone_Number: doc.data().Phone_Number
//         });
//       });
      
//       return res.json(contacts);
//     })
//     .catch((err) => console.error(err));
// };