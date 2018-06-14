log=console.log;
logj = o=>log(JSON.stringify(o));

var http = require('http');
var ws = require("ws")
var fs = require('fs');

function createServer(httpConfig={},wsConfig={},port){
	return new Promise((resolve,reject)=>{
		var defaultHttpHandler = httpConfig['']||((req,res)=>{res.statusCode=404;res.end();});
		var httpServer = http.createServer((req,res)=>{
			var handler = httpConfig[req.url];
			if(handler){
				handler(req,res);
			}else{
				defaultHttpHandler(req,res);
			}
		});
		server = new ws.Server({ 
			noServer:true
		});
		var defaultWsHandler = wsConfig['']||((request, socket, head)=>socket.destroy());
		httpServer.on('upgrade', (request, socket, head) => {
			var handler = wsConfig[request.url];
			if(handler){
				server.handleUpgrade(request, socket, head, ws=>handler(ws));
			}else{
				defaultWsHandler(request,socket,head);
			}
		});
		httpServer.listen(port,$=>resolve(port));
	});
}


module.exports = createServer;

module.exports.file = (fileName)=>(req,res)=>res.end(fs.readFileSync(fileName));

module.exports.collectStream = handler=>{
	var body = [];
	return {
		write : b=>body.push(b),
		end : $=>handler(Buffer.concat(body))
	};
}

module.exports.collect = (stream,handler,...rest)=>{
	var body = [];
	stream.on('data',b=>body.push(b));
	stream.on('end',$=>handler(Buffer.concat(body),...rest));
}

module.exports.collectHandler = (handler,...rest)=>(req,res)=>module.exports.collect(req,handler,res,req,...rest)