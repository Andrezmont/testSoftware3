module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/proyecto_ingSoftware3_git',
      deployTo: '/home/godie007/deploys',
      repositoryUrl: 'git@gitlab.com:godie007/proyecto_ingSoftware3.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 2,
      shallowClone: true
    },
    staging: {
      servers: 'godie007@dti-software.com'
    }
  });

  shipit.on('deployed', function() {
    shipit.start('yarn');
  });

  shipit.task('yarn', function() {
    shipit.remote('cd ' + shipit.releasePath + ' && yarn').then(function() {
      shipit.emit('yarned');
    });
  });

  shipit.on('yarned', function() {
    shipit.start('pm2');
  });

  shipit.task('pm2', function() {
    shipit.remote('cd ' + shipit.releasePath + ' && pm2 kill && PORT=80 authbind --deep pm2 start app.js --watch -i max').then(function() {
      shipit.emit('pm2-ready');
    });
  });
};
