var lib = require('./lib/entry.js');

lib.wsserver({
	"http://149.154.167.51:80/api":lib.wsserver.collectHandler((data,res,req,rqSender)=>{
		res.writeHeaders = headers=>res.writeHead(200,headers);
		res.error = code=>{
			res.statusCode = code;
			res.end();
		};
		rqSender(data).into(res).end();
	},lib.fixedproxy.integral(lib.requestOptions.tgDirectOptions)),
},{},process.env.PORT || 8080).then(port=>log(`App up on http://localhost:${port}`));