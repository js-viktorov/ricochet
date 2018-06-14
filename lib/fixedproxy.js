var http = require('http');

var resultExample = {
	writeHeaders:$=>{},
	data:$=>{},
	end:$=>{},
	error:$=>{}
};

function pipe(from,to){
	from.on('data',data=>to.write(data));
	from.on('end',(...args)=>to.end(...args))
}

Object.bindAll = o=>{
	Object.entries(o).forEach(([k,v])=>{
		if(typeof v === 'function'){
			o[k]=(...args)=>(v(...args),o);
		}
	});
	return o;
}

function chunked(options,omitHeaders=false,timeout=10000){
	return contentLength=>{
		var result;
		var timedOut = false;
		var opts = {
			...options,
			headers:{
				"Content-Length":contentLength,
				...options.headers
			}
		};
		var req = http.request(opts,res=>{
			if(res.statusCode===200){
				if(!omitHeaders){
					result.writeHeaders(res.headers);
				}
				pipe(res,result);
			}else{
				console.log(res.statusCode);
				result.error(res.statusCode);
			}
		}).on('error',e=>{
			if(result){
				result.error(e);
			}
		});
		req.setTimeout(timeout,$=>req.abort());
		return Object.bindAll({
			into:res=>result=res,
			write:data=>req.write(data),
			end:(...args)=>req.end(...args)
		});
	};
}

function integral(options,omitHeaders,timeout){
	var delegate = chunked(options,omitHeaders,timeout);
	return (data)=>delegate(data.length).write(data);
}

module.exports = {
	chunked,
	integral
};

