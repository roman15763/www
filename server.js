const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Підключення до бази даних
mongoose.connect('mongodb://localhost/college_points', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    group: String,
    email: String,
    points: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

// Маршрут для входу користувача
app.post('/login', async (req, res) => {
    const { name, group, email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
        user = new User({ name, group, email });
        await user.save();
    }

    res.json(user);
});

// Отримати всіх користувачів
app.get('/users', async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
});

// Маршрут для входу адміністратора
app.post('/admin-login', (req, res) => {
    const { adminName, adminPassword } = req.body;

    if (adminName === 'admin' && adminPassword === 'admin123') {
        res.json({ message: 'Admin login successful' });
    } else {
        res.status(403).json({ message: 'Invalid admin credentials' });
    }
});

// Адмін додає поінти користувачу
app.post('/update-points', async (req, res) => {
    const { userId, points } = req.body;
    const user = await User.findById(userId);

    if (user) {
        user.points += points;
        await user.save();
        res.json({ message: 'Points updated', user });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
