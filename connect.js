var http = require('http');
var parseUrl = require('url').parse;
var connect = require('connect');

var NEWS = {
     1:'这里是第一篇新闻的内容',
     2:'这里是第二篇新闻的内容',
     3:'这里是第三篇新闻的内容'
};

function getNews(id){
	return NEWS[id] || '文章不存在';
}

var app = connect();

app.use(function(req,res,next){  //在中间件的上下文中，有着三个变量。分别代表请求对象、响应对象、下一个中间件。
                                //如果当前中间件调用了res.end()结束了响应，执行下一个中间件就显得没有必要。
                                //此处通过use函数往函数栈中一层层加入函数，当发生get请求事件时会自动调用函数栈中的函数
	                             //直到函数中没有next（）函数为止
      res.send = function send (html) {
         res.writeHead(200,{
         	'content-type' : 'text/html;charset=utf-8'
         });
         res.end(html);


      }
      next();


});

app.use(function(req,res,next){
    var info = parseUrl(req.url,true);
    req.pathname = info.pathname;
    req.query = info.query;
    next();

});


app.use(function(req,res,next){
    if(req.pathname === '/'){
    	 res.send('<ul>'+
         	'<li><a href="/news?type=1&id=1">新闻一</a></li>'+
            '<li><a href="/news?type=1&id=2">新闻二</a></li>'+
            '<li><a href="/news?type=1&id=3">新闻三</a></li>'+
            '</ul>');
    }else{
    	next();
    }
});
app.use(function(req,res,next){
    if(req.url === '/news?type=1&id=1'){
        res.send(getNews(1));                      

    }else if(req.url === '/news?type=1&id=2'){
        res.send(getNews(2));
    }else if(req.url === '/news?type=1&id=3'){
        res.send(getNews(3));
    }else{
        res.send('<h1>文章不存在！</h1>');
    }
});

app.listen(3002);//相当于http模块的createServer函数，自动创建服务器并监听3002端口