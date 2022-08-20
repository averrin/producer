export const moduleId = "Producer";
export const infoColor = "#ff6400";

export const FLAGS = {
}

export const SETTINGS = {
  SHOW: "show",
  UI_SCALE: "ui-scale",
  RESOLUTION: "resolution",
  SHOW_PRODUCER: "show-producer",
  COLLAPSED: "collapsed",

  KEY_SHOW: "key-show",
  KEY_COLLAPSE: "key-collapsed",
  TAGS: "tags",
};

export const HOOKS = [
  'controlToken',
  'updateToken',
  'updateActor',
  'targetToken',

  'canvasReady',
  'createToken',
  'deleteToken',
  'deleteActor',
  // 'renderTokenActionHUD',
];
