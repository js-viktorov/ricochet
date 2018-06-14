var PROXY_IP = '195.201.43.199';
var PROXY_PORT = 3128;

var OTHER_PROXY_IP = '47.52.153.167';
var PROXY_IP = 'ricochet-xy.herokuapp.com';
var PROXY_PORT = 80;

var TG_TARGET_IP = '149.154.167.51';
var TG_TARGET_PORT = 80;

var METHOD = 'POST';
var PATH = '/api';


var tgBasicHeaders = {
	"content-type": 'application/x-www-form-urlencoded',
	"connection": 'Close',
	"accept-encoding": 'gzip, deflate',
	"accept-language": 'ru-RU,en,*',
	"user-agent": 'Mozilla/5.0'
};

var tgProxyOptions = {
	host : PROXY_IP,
	port : PROXY_PORT,
	path : 'http://' + TG_TARGET_IP + ':' + TG_TARGET_PORT + PATH,
	method : METHOD,
	headers: {
		...tgBasicHeaders,
		host: TG_TARGET_IP + ':' + TG_TARGET_PORT
	}
};

var tgDirectOptions = {
	host : TG_TARGET_IP,
	port : TG_TARGET_PORT,
	method : METHOD,
	path : PATH,
	headers:{
		...tgBasicHeaders
	}
};

module.exports = {
	toProxy : tgProxyOptions,
	toTG : tgDirectOptions
};