function oneAtATime(executor){
	function done(result){
		currentCB(result);
		if(queue.length>0){
			var [payload,nextCB] = queue.shift();
			currentCB = nextCB;
			executor(payload, done);
		}else{
			currentCB = null;
		}
	}
	var currentCB;
	var queue = [];
	return function(payload,cb){
		if(currentCB){
			queue.push([payload,cb]);
		}else{
			currentCB = cb;
			executor(payload,done);
		}
	};
}


module.exports = oneAtATime;