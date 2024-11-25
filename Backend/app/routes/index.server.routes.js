const index = require('../controllers/index.server.controller');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', {
            info: 'Click to train and predict.',
        });
    });

    // Define POST /run route
    app.post('/run', index.trainAndPredict);
};
