const linkedIn = require('./app');

(async () => {
  await linkedIn.initialize();

  await linkedIn.login();

  await linkedIn.preparingToInvite();

  await linkedIn.startToInvite();
})();
