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