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
	toTG : tgDirectOptions
};