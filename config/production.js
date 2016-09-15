var fs = require('fs'),
	appRoot = require('app-root-path'),
	dev = require('./dev.js'),
	util = require('util'),
	_GridStoreAdapter = require(appRoot + '/node_modules/parse-server/lib/Adapters/Files/GridStoreAdapter.js');

// serverUrl should not contain surfix like /parse
// Don't forget to change to https if needed
var serverUrl = process.env.SERVER_URL || 'http://localhost:1337'; 

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey
var javascriptKey = process.env.JAVASCRIPT_KEY || 'myJavascriptKey';
var databaseURI = process.env.DATABASE_URI || 'mongodb://chris:870807@localhost:27017/dev';
var emailDir = appRoot + '/views/emailTemplates';
var verificationBody = fs.readFileSync(emailDir + '/confirmEmail.ejs', 'utf8');
var passwordResetBody = fs.readFileSync(emailDir + '/resetPassword.ejs', 'utf8');

var domain_url = 'http://www.lvhunba.com';

//appId, masterKey, databaseURI, serverURI, cloud and logFolder are defined in parse-server-azure-config package reading from machine Environment or default value. 

module.exports = {
  server: {
	  javascriptKey: javascriptKey,
	  appName: '旅婚吧',
	  publicServerURL: serverUrl + '/parse',
	  allowClientClassCreation: false,
	  enableAnonymousUsers: false,
	  databaseURI: databaseURI,
	  filesAdapter: () => { return new _GridStoreAdapter.GridStoreAdapter(databaseURI)},
	  verifyUserEmails: true,
	  emailAdapter: {
	    module: 'parse-server-mandrill-adapter',
	    options: {
	      // API key from Mandrill account
	      apiKey: '3my2mDn3BN6Lhr_-aaH0jA',
	      // From email address
	      fromEmail: 'contactus@fotonic.co',
	      // Reply-to email address
	      replyTo: 'contactus@fotonic.co',
	      company: 'Nextstop Inc',
	      link_website: domain_url,
	      link_email: 'contactus@fotonic.co',
	      link_wechat: '',
	      link_weibo: 'http://weibo.com/6008920011',
	      icon_weibo: domain_url + '/img/icons/weibo/outline_color_weibo_48.png',
	      icon_wechat: domain_url + '/img/icons/wechat/outline_color_wechat_48.png',
	      // Verification email subject
	      verificationSubject: '*|appname|* - 请确认您的邮箱',
	      // Verification email body
	      // verificationBody: fs.readFileSync(emailDir + '/confirmEmail.ejs', 'utf8'),
	       //verificationBody: 'Hi,\n\nYou are being asked to confirm the e-mail address *|email|* with *|appname|*\n\nClick here to confirm it:\n*|link|*',
	       verificationBody: verificationBody,
	      // Password reset email subject
	      passwordResetSubject: '*|appname|* - 密码重置',
	      // Password reset email body
	      passwordResetBody: passwordResetBody
	    }
	  },
      customPages: {
		// invalidLink: 'http://yourpage/link_invalid.html',
		verifyEmailSuccess: domain_url + '/email-verified'
		// choosePassword: 'http://yourpage/new_password.html',
		// passwordResetSuccess: 'http://yourpage/sucess.html'
		},
	  liveQuery: {
	    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
	  }
  },
  dashboard: {},
  storage: {},
  push: {}
}

// Overwrite default inspect function of emailAdapter due to long output of verficationBody
// TODO: we can refine this method to output everything but verificationBody
module.exports.server.emailAdapter.options.inspect = function(depth) {

	var output = "{\r\n";

	for( var key in this)
	{
		if(key == 'verificationBody' || key == 'passwordResetBody')
		{
			output = output.concat(util.format("  %s: length - %s, \r\n",key, this[key].length ));
		}
		else if (key =='inspect') 
		{
			continue;
		}
		else
		{
			output = output.concat(util.format("  %s: %s, \r\n", key, this[key]));
		}
	}

	output = output.concat("}\r\n");

	return output;
};