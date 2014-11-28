var express = require('express');
var router = express.Router();
var doEatBread = require('../lib/doEatBread');

router.get('/',function(req,res,next){
  var id = req.param('id');
  var url = 'http://breadtrip.com/trips/' + id + '/';
  doEatBread(url,function(err,data){//获得这个url对应的游记的HTML
    if(err) return next(err);
    res.render('view_for_bread',{
      title:data[0],
      author_img:data[1],
      author_name:data[2],
      whichday_for_head:data[3],
      theseDays:data[4],
      comments:data[5] 
    });
  });
});

module.exports = router;
