const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.static('public'));

let tasks = [
  { id: 1, text: 'ติดตั้ง Node.js', done: false },
  { id: 2, text: 'ติดตั้ง VS Code', done: true }
];
let nextId = 3;

app.get('/', (req, res) => {
  res.send('Welcome to Home Page');
});

// GET /api/tasks?done=true - กรองด้วย query string
app.get('/api/tasks', (req, res) => {
  const { done } = req.query;
  if (done === undefined) {
    return res.json(tasks);
  }
  res.json(tasks.filter(t => String(t.done) === done));
});

// GET /api/tasks/:id - ดึงรายการเดียวด้วย route parameter
app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }
  res.json(task);
});

// POST /api/tasks - เพิ่มรายการใหม่
app.post('/api/tasks', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'ต้องระบุ text' });
  }
  const newTask = { id: nextId++, text: text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id สลับสถานะ done
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'ไม่พบรายการนี้' });
  }
  task.done = !task.done;
  res.json(task);
});

// DELETE /api/tasks/:id ลบรายการตาม id
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
