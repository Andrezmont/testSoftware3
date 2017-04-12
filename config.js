(function() {
  'use strict';
  exports.port = process.env.PORT || 3000;
  exports.mongodb = {
    //uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://godie007:lagrimon@ds131119.mlab.com:31119/godie007'
    uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/ventas'
  };
  exports.companyName = 'Indicadores de Madurez';
  exports.projectName = 'Indicadores de Madurez';
  exports.systemEmail = 'contacto@dti-software.com';
  exports.cryptoKey = 'mimamamemima1234';
  exports.loginAttempts = {
    forIp: 50,
    forIpAndUser: 7,
    logExpiration: '20m'
  };
  exports.requireAccountVerification = false;
  exports.smtp = {
    from: {
      name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
      address: process.env.SMTP_FROM_ADDRESS || 'contacto@dti-software.com'
    },
    credentials: {
      user: process.env.SMTP_USERNAME || 'contacto@dti-software.com',
      password: process.env.SMTP_PASSWORD || 'mimamamemima1234',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      ssl: true
    }
  };
  exports.oauth = {
    twitter: {
      key: process.env.TWITTER_OAUTH_KEY || '',
      secret: process.env.TWITTER_OAUTH_SECRET || ''
    },
    facebook: {
      key: process.env.FACEBOOK_OAUTH_KEY || '',
      secret: process.env.FACEBOOK_OAUTH_SECRET || ''
    },
    github: {
      key: process.env.GITHUB_OAUTH_KEY || '',
      secret: process.env.GITHUB_OAUTH_SECRET || ''
    },
    google: {
      key: process.env.GOOGLE_OAUTH_KEY || '',
      secret: process.env.GOOGLE_OAUTH_SECRET || ''
    },
    tumblr: {
      key: process.env.TUMBLR_OAUTH_KEY || '',
      secret: process.env.TUMBLR_OAUTH_SECRET || ''
    }
  };
}());
