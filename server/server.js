// Imports.
const _           = require('lodash');
const express      = require('express');
const bodyParser   = require('body-parser');
const { ObjectID } = require ('mongodb');

// Egna imports.
var { mongoose }  = require('./db/mongoose');
var { Uthyrning } = require('./models/uthyrning');
var { Artikel }   = require('./models/artikel');

// Server ---
const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

// POST /uthyrningar
app.post('/uthyrningar', (req, res) => {
  var uthyrning = new Uthyrning({
    artiklar: [req.body.text]
  });

  uthyrning.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /uthyrningar
app.get('/uthyrningar', (req, res) => {
  Uthyrning.find().then((uthyrningar) => {
    res.send({uthyrningar});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /uthyrningar/##### <- ID nummer
app.get('/uthyrningar/:id', (req, res) => {
  var id = req.params.id;

  // Valid id using isValid.
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Uthyrning.findById(id).then((uthyrning) => {
    if (!uthyrning) {
      return res.status(404).send();
    }

    res.send({uthyrning});
  }).catch((e) => {
    res.status(400).send();
  });

});

// DELETE /uthyrningar/id
app.delete('/uthyrningar/:id', (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Uthyrning.findByIdAndRemove(id).then((uthyrning) => {
    if (!uthyrning) {
      return res.status(404).send();
    }

    res.send(uthyrning);
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/uthyrningar/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, [
    'artiklar',
    'hamtas',
    'lamnas',
    'anvandas',
    'slap',
    'kund',
    'handpenning',
    'ok'
  ]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Uthyrning.findByIdAndUpdate(id, {$set: body}, {new: true}).then((uthyrning) => {
    if (!uthyrning) {
      return res.status(404).send();
    }

    res.send({uthyrning});
  }).catch((e) => {
    res.status(400).send();
    console.log(e);
  });
});

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
