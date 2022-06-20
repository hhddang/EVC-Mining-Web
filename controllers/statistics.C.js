const statisticsModel= require('../models/statistics.M')

const express = require('express'),
      router = express.Router();

router.get('/', (req, res) => {
    console.log('statistics-get');
    res.render('statistics.handlebars', {
        nav: () => 'navbar',
        active: { statistics: true }
    });
});

router.post('/', (req, res) => {
    console.log('statistics-post');
    console.log(req.body);
    statisticsModel.statistics(req.body.lang, req.body.pos);
    res.render('statistics.handlebars', {
        nav: () => 'navbar',
        active: { statistics: true },
        data : statisticsModel.data
    });
});


module.exports = router;