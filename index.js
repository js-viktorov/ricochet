var lib = require('./lib/entry.js');

var wsRqSender = lib.fixedproxy.integral(lib.requestOptions.toTG,true);

lib.wsserver({
	"/api":lib.wsserver.collectHandler((data,res,req,rqSender)=>{
		res.writeHeaders = headers=>res.writeHead(200,headers);
		res.error = code=>{
			if(!res.socket.destroyed){
				res.statusCode = code;
				res.end();
			}
		};
		rqSender(data).into(res).end();
	},lib.fixedproxy.integral(lib.requestOptions.toTG)),
},{
	"/wsapi":ws=>{
		console.log('ws connected');
		ws.on('message',lib.oneAtATime(m=>{
			wsRqSender(m).into({
				error:code=>{
					console.log('error in wsapi');
					ws.send([]);
				},
				...lib.wsserver.collectStream(data=>ws.send(data))
			},true)
		}));
	}
},process.env.PORT || 8080).then(port=>console.log(`App up on http://localhost:${port}`));

process.on('uncaughtException', function (err) {
	console.log('uncaught', err);
});
process.on('uncaughtRejection', function (err) {
	console.log('uncaughtRejection', err);
});