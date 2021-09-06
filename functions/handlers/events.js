const { db } = require('../util/admin');

exports.getAllEvents = (req, res) => {
    db.collection('events')
      .orderBy('Date')
      .get()
      .then((data) => {
        let events = [];
        data.forEach((doc) => {
          events.push({
            eventId: doc.id,
            Date: doc.data().Date,
            Description: doc.data().Description,
            Occasion: doc.data().Ocassion,
          });
        });
        
        return res.json(events);
      })
      .catch((err) => console.error(err));
};

exports.addNewEvent = (req, res) => {
  
    const newEvent = {
      Occasion: req.body.Occasion,
      Description: req.body.Description,
      Date: new Date().toISOString(),
    };
  
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

// Delete an event
exports.deleteEvent= (req, res) => {
  const document = db.doc(`/events/${req.params.eventId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Event not found' });
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