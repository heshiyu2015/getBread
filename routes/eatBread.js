var express = require('express');
var cheerio = require('cheerio');
var router = express.Router();
var doEatBread = require('../lib/doEatBread');

router.get('/',function(req,res,next){
  var id = req.param('id');
  var url = 'http://breadtrip.com/trips/' + id + '/';
  var theseDays = [];//装载游记的内容发送给模板
  doEatBread(url,function(err,data){//获得这个url对应的游记的HTML
    if(err) return next(err);
    var $ = cheerio.load(data);
    var title = $('div#trip-info>div.trip-summary>h2').attr('title');//标题
    var author_img = $('div#trip-info>a.trip-user>img').attr('src');//作者的头像链接
    var author_name = $('div#trip-info>a.trip-user>img').attr('alt');//作者名称
    
    var days = $('div.trip-wps').find('div.trip-days');//找出这篇游记中所有天的内容

    num_of_days = days.length;//旅游的天数

    days.each(function(i,day){
      var oneDay = [];//装载这一天的内容

      var dateAndDay = $(day).find('h3>span');//找出这一天的日期和第几天
      dateAndDay.each(function(i,date){
        oneDay.push($(date).text());//装入这一天数组中
      });


      var picAndCont = $(day).find('div.waypoint');//找出这一天的文字图片分组
      picAndCont.each(function(i,pc){
        var pictureAndContent = [];//装载这一天的图片和文字
        var dataForpc = $(pc).find('div.photo-ctn>a');//找出分组中的文字和图片
        var time = $(pc).find('div.time').text();//图片文字的具体时间
        var address = $(pc).find('a.wp-poi-name>span').text();//图片文字的具体地点
        pictureAndContent.push(dataForpc.attr('data-caption'));//装入文字图片
        pictureAndContent.push(dataForpc.attr('href'));//装入文字图片
        pictureAndContent.push(time);//装入具体时间
        pictureAndContent.push(address);//装入具体地址
        oneDay.push(pictureAndContent);//装入这一天数组中
      });

      theseDays.push(oneDay);//最后装入游记数组中
    });
    res.render('view_for_bread',{
      title:title,
      author_img:author_img,
      author_name:author_name,
      num_of_days:num_of_days,
      theseDays:theseDays
    });
  }); 
});

module.exports = router;
