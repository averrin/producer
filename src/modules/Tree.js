import { v4 as uuidv4 } from "uuid";

export class TreeItem {
  constructor() {
    this.id = uuidv4();
    this.name = "New Tree Item"
    this.color = "#232323";
    this.bgColor = "#eeeeee";
    this.children = [];
    this.icon = undefined;
    this.thumbnail = undefined;
    this.source = undefined;
    this.selected = false;
  }

  getName() {
    return this.source?.name || this.name;
  }

  toggleSelected(state) {
    if (!state) state = !this.selected;
    this.selected = state;
    this.children.forEach(i => i.toggleSelected(state));
  }

  static from(source) {
    const item = new TreeItem();
    item.id = source.id || uuidv4();
    item.name = source.title || source.name;
    item.source = source;
    item.thumbnail = source.thumbnail;
    item.icon = source.icon;
    return item;
  }
}
