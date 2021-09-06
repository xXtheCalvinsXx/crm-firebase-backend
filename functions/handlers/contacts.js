const { db } = require('../util/admin');

exports.getAllContacts = (req, res) => {
    db.collection('contacts')
      .orderBy('Date')
      .get()
      .then((data) => {
        let contacts = [];
        data.forEach((doc) => {
          contacts.push({
            contactId: doc.id,
            Date: doc.data().Date,
            Name: doc.data().Description,
            Location: doc.data().Location,
            Position: doc.data().Position,
            Company: doc.data().Company,
            //Last: 
            //Next: 
            Birthday: doc.data().Birthday,
            Industry: doc.data().Industry,
            Email: doc.data().Email,
            Education: doc.data().Education,
            Phone_Number: doc.data().Phone_Number
          });
        });
        
        return res.json(contacts);
      })
      .catch((err) => console.error(err));
};

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

// Delete a contact
exports.deleteContact= (req, res) => {
  const document = db.doc(`/contacts/${req.params.contactId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact not found' });
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


// Update a contact
exports.updateContact= (req, res) => {
  const document = db.doc(`/contacts/${req.params.contactId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      else {document.update({    
          Name: req.body.Name,
          Location: req.body.Location,
          Company: req.body.Company,
          Position: req.body.Position,
          //Last_EVENT to fill after merge
          //Next_EVENT 
          Birthday: req.body.Birthday,
          Education: req.body.Education,
          Industry: req.body.Industry,
          Email: req.body.Email,
          Phone_Number: req.body.Phone_Number,})
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


