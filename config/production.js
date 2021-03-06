var appRoot = require('app-root-path'),
	dev = require('./dev.js'),
	util = require('util'),
	utils = require(appRoot + '/controllers/utilities/utils.js' );

var serverUrl = process.env.SERVER_URL || 'https://lvhunba-parse-eastasia.azurewebsites.net/parse';
var databaseUri = process.env.DATABASE_URI || 'mongodb://chris:870807@lvhunba-db.japanwest.cloudapp.azure.com:27017/prod';

var production = {
	server: {
		serverURL: serverUrl,
		publicServerURL: serverUrl,
		databaseURI: databaseUri
	},
	dashboard:{
	    apps: [
	      {
	        serverURL: serverUrl,
	        appId: 'myAppId',
          	masterKey: 'myMasterKey',
          	appName: 'Lvhunba Parse Server'
	      }
	    ]
	},
	storage:
	{
		name: 'lvhunba',
		container: 'pic-public',
		accessKey: 'vT1ENNWXv8hKXwcWlSlKG45620k5a/J1MjGJr5JtWq8bAsfZyI4S09dhHjzzYZen8co/duAc/3ndvHrSUzyyqw==',
		directAccess: true
	}
};

// Remove fileAdapter overwritting from dev and use default settings in parse-server-azure-config
delete dev.server['filesAdapter'];

// Deep extend dev with dogfood config.
utils.extendDeep(dev, production);

module.exports = dev;