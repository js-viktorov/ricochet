module.exports = new Proxy({},{
	get:(o,p)=>o[p]?o[p]:o[p]=require('./'+p),
	set:$=>{}
});