import { moduleId, SETTINGS } from './constants.js';

export let setting = key => {
  return game.settings.get(moduleId, key);
};

export async function migrateFromString(key) {
  try {
    let current = game.settings.get(moduleId, key);
    if (typeof current === "string" || current instanceof String) {
      current = JSON.parse(current);
      await game.settings.set(moduleId, key, current);
    }
    if (typeof current[0] === "string" || current[0] instanceof String) {
      current = JSON.parse(current[0]);
      if (Array.isArray(current)) {
        await game.settings.set(moduleId, key, current);
      }
    }
  } catch (error) {

  }
}

const debouncedReload = debounce(() => window.location.reload(), 100);
export function initSettings(app) {
  game.settings.register(moduleId, SETTINGS.SHOW, {
    scope: "client",
    config: false,
    type: Boolean,
    default: false,
  });

  game.settings.register(moduleId, SETTINGS.COLLAPSED, {
    scope: "client",
    config: false,
    type: Boolean,
    default: false,
  });


  game.settings.register(moduleId, SETTINGS.UI_SCALE, {
    name: 'UI scale',
    hint: 'If ui are too big or too small for your display. Requires refresh.',
    config: true,
    type: Number,
    default: 1,
    onChange: value => {
      debouncedReload();
    },
    range: {
      min: 0.1,
      max: 2,
      step: 0.01
    }
  });
  game.settings.register(moduleId, SETTINGS.RESOLUTION, {
    name: "Selected image resolution",
    hint: "Higher is better quality but slower",
    scope: "world",
    config: true,
    range: {
      min: 30,
      max: 600,
      step: 5,
    },
    default: 200,
    type: Number,
    onChange: debouncedReload
  });

}
