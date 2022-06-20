var express = require('express');
var router = express.Router();
var home = require('../models/home.M')

/* GET home page. */
router.get('/', function(req, res, next) {
  var sent_vn = home.getEntire()['vn_sents']
  var keys = Object.keys(sent_vn)
  var values = Object.values(sent_vn)
  var a = []
  for (let i = 0;i<keys.length;i++){
    temp = {}
    temp['id'] = keys[i];
    temp['sent'] = values[i];
    a.push(temp)
  }


  var sent_en = home.getEntire()['en_sents']
  var keys_en = Object.keys(sent_en)
  var values_en = Object.values(sent_en)
  var b = []
  for (let i = 0;i<keys_en.length;i++){
    temp = {}
    temp['id'] = keys_en[i];
    temp['sent'] = values_en[i];
    b.push(temp)
  }

  var vn_sent_data = home.getVnSentData()
  var en_sent_data = home.getEnSentData()
  var vn_word_data = home.getVnWordData()
  var en_word_data = home.getEnWordData()
  var page = 1

  res.render('index.ejs', { a : a,
                        b : b,
                        page : page,vn_sent_data: vn_sent_data,
                        en_sent_data: en_sent_data,
                        vn_word_data:vn_word_data,
                        en_word_data:en_word_data});
});

module.exports = router;
