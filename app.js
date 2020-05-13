const puppeteer = require('puppeteer');
const {
  E_MAIL,
  PASS,
  EVENT_LINK,
  SCROLL_DISTANCE,
  SPEED,
  CONNECTION_LIMIT,
} = require('./settings');

const linkedin = {
  browser: null,
  page: null,

  initialize: async () => {
    // instagram.browser = await puppeteer.launch();
    linkedin.browser = await puppeteer.launch({
      headless: false,
    });
    linkedin.page = await linkedin.browser.newPage();
  },

  login: async () => {
    /* Go to login page */
    await linkedin.page.goto(
      'https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin'
    );

    await linkedin.page.waitFor(1000);

    /* Do login operation */
    await linkedin.page.type('#username', E_MAIL, {delay: 50});
    await linkedin.page.type('input[type="password"]', PASS, {delay: 50});
    await linkedin.page.click('button[type="submit"]');

    await linkedin.page.waitFor(1000);
  },

  preparingToInvite: async () => {
    /* Go to the event page */
    await linkedin.page.goto(EVENT_LINK);

    await linkedin.page.waitFor(2500);

    /* Click to button for invite attendees */
    await linkedin.page.click('button[data-control-name="invite_attendees"]');

    await linkedin.page.waitFor(500);
  },

  startToInvite: async () => {
    await linkedin.page.evaluate(
      async (SCROLL_DISTANCE, SPEED, CONNECTION_LIMIT) => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const timer = setInterval(() => {
            document.elementFromPoint(444, 471).click();
            let attendeeCounter = document.querySelector(
              '.invitee-picker-selected-members-pane__header > span'
            ).innerText;
            attendeeCounter = attendeeCounter.replace(/ .*/, ' ');
            const inviteConnectionsModal = document.querySelector(
              '.invitee-picker__results-container'
            );
            inviteConnectionsModal.scrollBy(0, SCROLL_DISTANCE);
            totalHeight += SCROLL_DISTANCE; // should be variable

            if (attendeeCounter >= CONNECTION_LIMIT) {
              clearInterval(timer);
              resolve();
            }

            /*if (totalHeight >= scrollHeight) {
              console.log('if');
              clearInterval(timer);
              resolve();
            } */
          }, SPEED);
        });
      },
      SCROLL_DISTANCE,
      SPEED,
      CONNECTION_LIMIT
    );
  },
};

module.exports = linkedin;
