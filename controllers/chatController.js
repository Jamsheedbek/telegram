const fs = require('../lib/fsDeal');

module.exports = (req, res) => {
    const users = JSON.parse(new fs('../models/user.json').read());
    const userInfo = req.cookies;
    res.render('index', { user: userInfo, users: users.length + 1 });
};
