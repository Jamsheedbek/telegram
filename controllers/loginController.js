module.exports = {
    GET: (req, res) => {
        console.log(req.cookies);
        if (!req.cookies.username) {
            res.render('login');
        } else {
            res.redirect('/chat');
        }
    },
    POST: (req, res) => {
        const { username, phone } = req.body;
        res.cookie('username', username);
        res.cookie('phone', phone);
        res.redirect('/chat');
    },
};
