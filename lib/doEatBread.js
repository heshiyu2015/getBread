var http = require('http');

module.exports = function(url,cb){
  http.get(url,function(res){
    var data = '';

    res.on('data',function(chunk){
      data += chunk;
    });

    res.on('end',function(){
      cb(null,data);
    });

  }).on('error',function(err){
    cb(err);
  });
};
