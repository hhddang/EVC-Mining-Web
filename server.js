// REQUIRE NECESSARY MODULES
const express = require('express');
const hdbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');

var indexRouter = require('./controllers/index');
var index1Router = require('./controllers/index1');
var searchRouter = require('./controllers/search.C');
var statisticRouter = require('./controllers/statistics.C');
// END REQUIRE

// INIT WEB AND PORT
const web = express();
const port = 3000;


web.use(express.urlencoded({ extends: true }));
web.use(methodOverride('_method'));
web.set('view engine', 'handlebars');
web.set('view engine','ejs');
web.set('views', "./views");
web.set()
const hbs = hdbs.create({ defaultLayout: false });
web.engine('handlebars', hbs.engine);
web.use(express.static(path.join(__dirname, 'public')));
web.use('/assets',express.static('assets'));
web.use('/search/',express.static('assets'));

web.use('/', indexRouter);

for (let i = 2 ; i<100 ; i++){
    var url = '/page/' + i.toString();
    web.use(url,index1Router);
  }
/*
web.use('/', require('./controllers/home.C'));

*/
web.use('/search', searchRouter);
web.use('/statistics',statisticRouter);
// END OF INITIALIZING


// ACTIVE WEB
web.listen(port, ()=> console.log(`server is listening on port: ${port}`));
// END