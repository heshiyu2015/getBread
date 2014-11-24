var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var doEatBread = require('../lib/doEatBread');

router.get('/',function(req,res,next){
  var id = req.param('id');
  var url = 'http://breadtrip.com/trips/' + id + '/';
  doEatBread(url,function(err,data){
    if(err) return next(err);
    var $ = cheerio.load(data);
    var title = $('div.trip-summary>h2')[0].attribs.title;
    
    res.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
    res.end(title);
  }); 
});

module.exports = router;
