import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { initSettings } from "./modules/settings.js";

import { moduleId, SETTINGS, infoColor } from "./modules/constants.js";
import initHelpers from "crew-components/helpers";
import { logger, setting } from "crew-components/helpers";
import MainApplication from './view/MainApplication.js';
import BrowserApplication from './view/BrowserApplication.js';
import { initStores } from './modules/stores.js';

initHelpers(moduleId, infoColor, SETTINGS);
const app = new MainApplication();
const browser = new BrowserApplication();

Hooks.once('init', async () => {
  initSettings(app);
});

Hooks.on('getSceneControlButtons', (buttons) => {
  if (game.user.isGM) {
    const tokenButton = buttons.find(b => b.name == "tiles");
    if (tokenButton) {
      tokenButton.tools.push({
        name: "producer",
        title: "Toggle Producer",
        icon: "fas producer-icon",
        visible: game.user.isGM,
        onClick: () => {
          app.toggle();
        },
        button: true
      });
    }
  }
});

Hooks.once('ready', async () => {
  if (game.user.isGM) {
    initStores();
    await app.start();
    if (setting(SETTINGS.SHOW)) app.show();
    await browser.start();
    if (setting(SETTINGS.SHOW)) browser.show();
    logger.info("Started!")
  }
}
);
