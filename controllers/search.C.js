const searchModel= require('../models/search.M')

const express = require('express'),
      router = express.Router();

router.get('/', (req, res) => {
    console.log('search-get');
    res.render('search.handlebars', {
        nav: () => 'navbar',
        active: { search: true }
    });
});

router.post('/word', (req, res) => {
    console.log('search/word-post');
    console.log(req.body);
    searchModel.search(req.body.lang, req.body.word, req.body.type, req.body.pos);
    res.render('search.handlebars', {
        nav: () => 'navbar',
        active: { search: true },
        data : searchModel.getPage(1)
    });
});

router.get('/pre-page', (req, res) => {
    console.log('search/pre-page-get');
    res.render('search.handlebars', {
        nav: () => 'navbar',
        active: { search: true },
        data : searchModel.getPage(searchModel.recent_page - 1)
    });
});

router.get('/nxt-page', (req, res) => {
    console.log('search/nxt-page-get');
    res.render('search.handlebars', {
        nav: () => 'navbar',
        active: { search: true },
        data : searchModel.getPage(searchModel.recent_page + 1)
    });
});

module.exports = router;