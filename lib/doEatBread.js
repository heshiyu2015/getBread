var http = require('http');
var cheerio = require('cheerio');
module.exports = function(url,cb){
  http.get(url,function(res){
    var data = '';
    var dataArray = [];
    res.on('data',function(chunk){
      data += chunk;
    });

    res.on('end',function(){
      var theseDays = [];//装载游记的内容发送给模板
      var comments = [];//装载游记中的收藏总数，评论总数，分享数
      var $ = cheerio.load(data);
      var title = $('div#trip-info>div.trip-summary>h2').attr('title');//标题
      var author_img = $('div#trip-info>a.trip-user>img').attr('src');//作者的头像链接
      var author_name = $('div#trip-info>a.trip-user>img').attr('alt');//作者名称
      var total_num = $('div#trip-info>div.trip-tools>a');//找出收藏总数，评论总数，分享数的合集

      total_num.each(function(i,ccs){//装载收藏总数，评论总数，分享总数
	comments.push($(ccs).find('b').text());
      });

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
	  var pictureAndContent = [];//装载这一天的一组图片和文字等信息
	  var dataForpc = $(pc).find('div.photo-ctn>a');//找出分组中的文字和图片
	  var time = $(pc).find('div.time').text();//图片文字的具体时间
	  var address = $(pc).find('a.wp-poi-name>span').text();//图片文字的具体地点
	  var lcs = $(pc).find('div.wp-btns>a');
	  pictureAndContent.push(dataForpc.attr('data-caption'));//装入文字
	  pictureAndContent.push(dataForpc.attr('href'));//装入图片
	  pictureAndContent.push(time);//装入具体时间
	  pictureAndContent.push(address);//装入具体地址
	  lcs.each(function(i,num){//装载每条评论的喜欢数目，评论数目，分享数目
	    pictureAndContent.push($(num).text());
	  });
	  oneDay.push(pictureAndContent);//装入这一天数组中
	});

	theseDays.push(oneDay);//最后装入游记数组中
      });
      dataArray.push(title);
      dataArray.push(author_img);
      dataArray.push(author_name);
      dataArray.push(num_of_days);
      dataArray.push(theseDays);
      dataArray.push(comments);
      cb(null,dataArray);
    });
  }).on('error',function(err){
    cb(err);
  });
};
