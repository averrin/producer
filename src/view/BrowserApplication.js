import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import { logger, setting } from "crew-components/helpers";
import { moduleId, SETTINGS } from "../modules/constants.js";

import BrowserUI from "./BrowserUI.svelte";

export default class BrowserApplication extends SvelteApplication {

  constructor() {
    super({ widgetId: "producer" });
    globalThis.Hooks.on("closeBrowserApplication", () => {
      globalThis.game.settings.set(moduleId, SETTINGS.SHOW, false);
    });

    Hooks.on("canvasInit", () => {
      Hooks.once("renderCombatTracker", this.onUpdate.bind(this));
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "producer-browser",
      resizable: true,
      minimizable: true,
      zIndex: 95,
      title: "Alpha Browser",

      svelte: {
        class: BrowserUI,
        target: document.body,
        props: function() {
          return {};
        },
      },
    });
  }

  start() {
    // initAPI();
  }

  toggleCollapsed() {
    Hooks.call("ProducerToggleCollapse");
  }

  toggle() {
    if (setting(SETTINGS.SHOW)) {
      this.hide();
    } else {
      this.show();
    }
  }

  async show() {
    await this.render(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW, true);
  }
  async hide() {
    await this.close(true);
    globalThis.game.settings.set(moduleId, SETTINGS.SHOW, false);
  }

  onUpdate() {
  }
}
