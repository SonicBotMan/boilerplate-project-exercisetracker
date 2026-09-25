// Exercise Tracker - FCC project 4
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const users = []; // { _id, username, log: [{description, duration, date}] }

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (!username) return res.json({ error: 'username required' });
  const user = { _id: String(users.length + 1), username, log: [] };
  users.push(user);
  res.json({ username: user.username, _id: user._id });
});

app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ _id: u._id, username: u.username })));
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'user not found' });
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  if (!description || isNaN(duration)) return res.json({ error: 'description and duration required' });
  const date = req.body.date ? new Date(req.body.date) : new Date();
  if (date.toString() === 'Invalid Date') return res.json({ error: 'invalid date' });
  const entry = { description, duration, date: date.toDateString() };
  user.log.push(entry);
  res.json({ username: user.username, description, duration, _id: user._id, date: entry.date });
});

app.get('/api/users/:_id/logs', (req, res) => {
  const user = users.find(u => u._id === req.params._id);
  if (!user) return res.json({ error: 'user not found' });
  let log = user.log;
  const { from, to, limit } = req.query;
  if (from) log = log.filter(e => new Date(e.date) >= new Date(from));
  if (to) log = log.filter(e => new Date(e.date) <= new Date(to));
  if (limit) log = log.slice(0, parseInt(limit));
  res.json({ _id: user._id, username: user.username, count: log.length, log });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + listener.address().port);
});
module.exports = app;
