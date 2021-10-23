/* eslint-disable */

const { db } = require('../util/admin');

// gets all events for a user 
exports.getAllEvents = (req, res) => {
    db.collection('events')
      .orderBy('Date')
      .get()
      .then((data) => {
        let events = [];
        data.forEach((doc) => {

          doc_data = {
            eventId: doc.id,
            RelevantContact: doc.data().RelevantContact,
            RelevantUser: req.user.email
          }

          if (doc.data().Date){
            doc_data.Date = doc.data().Date;
          }
          if (doc.data().Description){
            doc_data.Description = doc.data().Description;
          }
          if (doc.data().Occasion){
            doc_data.Occasion = doc.data().Occasion;
          }

          if (doc.data().RelevantUser == req.user.email){
            events.push(doc_data);
          }
        });     
        return res.json(events);
      })
      .catch((err) => console.error(err));
};

// gets all events for a user with respect to a certain contact
exports.getEventsByContact = (req, res) => {
  db.collection('events')
    .orderBy('Date')
    .get()
    .then((data) => {
      let events = [];
      data.forEach((doc) => {

        doc_data = {
          eventId: doc.id,
          RelevantContact: doc.data().RelevantContact,
          RelevantUser: req.user.email
        }

        if (doc.data().Date){
          doc_data.Date = doc.data().Date;
        }
        if (doc.data().Description){
          doc_data.Description = doc.data().Description;
        }
        if (doc.data().Occasion){
          doc_data.Occasion = doc.data().Occasion;
        }

        // get all our current user's events that are with a certain relevant contact
        if ((doc.data().RelevantContact == req.params.contactId) & (doc.data().RelevantUser == req.user.email)){
          events.push(doc_data);
        }
      });     
      return res.json(events);
    })
    .catch((err) => console.error(err));
};

// gets an event
exports.getEvent = (req, res) => {
  db.collection('events')
    .orderBy('Date')
    .get()
    .then((data) => {
      let events = [];
      data.forEach((doc) => {

        doc_data = {
          eventId: doc.id,
          RelevantContact: doc.data().RelevantContact,
          RelevantUser: req.user.email
        }

        if (doc.data().Date){
          doc_data.Date = doc.data().Date;
        }
        if (doc.data().Description){
          doc_data.Description = doc.data().Description;
        }
        if (doc.data().Occasion){
          doc_data.Occasion = doc.data().Occasion;
        }

        if ((doc.id == req.params.eventId) & (doc.data().RelevantUser == req.user.email)){
          events.push(doc_data);
        }
      });     
      return res.json(events);
    })
    .catch((err) => console.error(err));
};

// adds a new event for a user
exports.addNewEvent = (req, res) => {
  
    const newEvent = {
      RelevantContact: req.body.RelevantContact,
      RelevantUser: req.user.email
    };

    if (req.body.Date){
      newEvent.Date = req.body.Date;
    }
    if (req.body.Description){
      newEvent.Description = req.body.Description;
    }
    if (req.body.Occasion){
      newEvent.Occasion = req.body.Occasion;
    }

  
    db.collection('events')
      .add(newEvent)
      .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` });
      })
      .catch((err) => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
      });
};

// Delete an event for a user
exports.deleteEvent= (req, res) => {
  const document = db.doc(`/events/${req.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (doc.data().RelevantUser !== req.user.email){ // req.user.email is from the middleware in auth.js
        return res.status(403).json({ error: 'Unauthorized' });
      }
      else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Event deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// Update an event for a user, does not need all fields to be filled
exports.updateEvent= (req, res) => {
  const document = db.doc(`/events/${req.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Event not found' });
      }
      if (doc.data().RelevantUser !== req.user.email){ // req.user.email is from the middleware in auth.js
        return res.status(403).json({ error: 'Unauthorized' });
      }
      else {        
        if(req.body.Occasion){
          document.update({Occasion: req.body.Occasion});
        }
        if(req.body.Description){
          document.update({Description: req.body.Description});
        }
        if(req.body.Date){
          document.update({Date: req.body.Date});
        }
        if(req.body.RelevantContact){
          document.update({RelevantContact: req.body.RelevantContact});
        }
      }
    })
    .then(() => {
      res.json({ message: 'Event updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};