var lib = require('./lib/entry.js');

var rqSender = lib.fixedproxy.integral(lib.requestOptions.toTG);

var wsConnectionsCount = 0;

lib.wsserver({
	"/api":lib.wsserver.collectHandler((data,res,req)=>{
		res.writeHeaders = headers=>res.writeHead(200,headers);
		res.error = code=>{
			if(!res.socket.destroyed){
				console.log('remote error processing http ' + code);
				res.statusCode = code;
				res.end();
			}
		};
		rqSender(data).into(res).end();
	}),
},{
	"/wsapi":ws=>{
		console.log('ws connected, total ' + (++wsConnectionsCount));
		ws.on('message',lib.oneAtATime(m=>{
			rqSender(m).into({
				writeHeaders:$=>{},
				error:code=>{
					console.log('remote error processing ws ' + code);
					ws.send([]);
				},
				...lib.wsserver.collectStream(data=>ws.send(data))
			},true)
		}));
		ws.on('close',$=>console.log('ws disconnected, total ' + (--wsConnectionsCount)));
	}
},process.env.PORT || 8080).then(port=>console.log(`App up on http://localhost:${port}`));

process.on('uncaughtException', function (err) {
	console.log('uncaught', err);
});
process.on('uncaughtRejection', function (err) {
	console.log('uncaughtRejection', err);
});