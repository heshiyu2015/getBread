var express = require('express');
var router = express.Router();
var url = 'http://breadtrip.com/trips/2387754590/';
var doEatBread = require('../lib/doEatBread');

router.get('/',function(req,res,next){
  doEatBread(url,function(err,data){
    if(err) return next(err);
    console.log(data);
  });
});

module.exports = router;
