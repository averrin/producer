import { writable, get } from 'svelte/store';
import { getFlag } from "crew-components/helpers"
import { TreeItem } from "./Tree.js";
import Tag from "crew-components/tags";
import { SETTINGS } from "./constants.js";

export const selected = writable([]);
export const selectedBrowser = writable([]);
export const expanded = writable([]);
export const treeItems = writable({});
export const compendiumTree = writable({});
export const filter = writable({});
export const currentCollection = writable(null);
export const isDragging = writable(false);

export const tagsStore = writable([]);

function getTree() {
  let collection = get(currentCollection);
  return collection.directory.tree;
}

async function initCompendiumTreeCF() {
  game.packs.contents.forEach(p => p.type = `${p.metadata.type} (${p.metadata.package})`);
  const children = game.customFolders.compendium.folders.contents.filter(f => f.id.startsWith("cfolder"));
  const content = game.customFolders.compendium.folders.get("default")?.content || [];

  // const p = [];
  // for (const c of content) {
  //   p.push(game.CF.FICFolderAPI.loadFolders(c.packCode))
  // }
  // await Promise.all(p);
  children.forEach(p => p.icon = "fa-solid:folder");

  compendiumTree.set(buildTree({ content: content, children }, undefined, (item, source) => {
    source = game.packs.get(source.id);
    item.source = source;
    item.count = source.index?.size;
    item.extraIcons = [];
    item.icon = "fa-solid:atlas";
    if (source.private) {
      item.extraIcons.push("fa-solid:eye-slash");
    }
    if (source.locked) {
      item.extraIcons.push("fa-solid:lock");
    }
    return item;
  }));
}

async function initCompendiumTree() {
  if (game.modules.get("compendium-folders")?.active) {
    return initCompendiumTreeCF();
  }
  let children = [...new Set(game.packs.contents.map(p => p.metadata.type))];
  children = children.map(type => {
    const packs = game.packs.contents.filter(p => p.metadata.type == type);
    packs.forEach(p => p.icon = "fa-solid:atlas");
    packs.forEach(p => p.type = `${type} (${p.metadata.package})`);
    return {
      icon: "fa-solid:folder",
      id: type,
      name: type,
      children: [],
      content: packs
    };
  });
  compendiumTree.set(buildTree({ content: [], children }, undefined, (item, source) => {
    item.count = source.index?.size;
    item.extraIcons = [];
    if (source.private) {
      item.extraIcons.push("fa-solid:eye-slash");
    }
    if (source.locked) {
      item.extraIcons.push("fa-solid:lock");
    }
    return item;
  }));
}

function initActorsTree() {
  treeItems.set(buildTree(getTree()));

  Hooks.on("renderSidebarDirectory", () => {
    treeItems.set(buildTree(getTree(), get(filter)));
  });
  Hooks.on("updateActor", () => {
    treeItems.set(buildTree(getTree(), get(filter)));
  });
  filter.subscribe((f) => {
    treeItems.set(buildTree(getTree(), f));
  });
  currentCollection.subscribe(_ => treeItems.set(buildTree(getTree())));
}

function filterItems(items, filter) {
  if (filter?.tags?.length > 0) {
    let filtered = Object.entries(items).map(([_, v]) => { return { ...v } }).filter(
      item =>
        item.root
        || item?.source?.content
        || filter.tags?.every((tag) => item.name?.toLowerCase().includes(tag.toLowerCase()) || getFlag(item?.source, "tagger")?.tags?.includes(tag))
    );
    for (let n = 0; n < 5; n++) {
      filtered.forEach(v => {
        v.children = v.children.filter((ch) => filtered.find(item => item.id == ch.id));
      });
      filtered = filtered.filter(
        v => v.root || !(v?.source instanceof Folder) || v.children.length > 0
      );
    }
    if (filtered) {
      items = {};
      filtered.forEach(i => items[i.id] = i);
      setTimeout(() => {
        const folders = filtered.filter(v => v.root || v?.source instanceof Folder);
        expanded.set(Array.from(folders.map(v => v.id)));
      }, 0);
    }
  }
  return items
}

export function buildTree(tree, filter, transform) {
  let items = {};
  addTree(tree, undefined, transform).forEach(i => items[i.id] = i);
  items = filterItems(items, filter);
  return items;
}

export function initStores() {
  currentCollection.set(game.actors);
  tagsStore.set(game.settings.get("director", SETTINGS.TAGS).map(Tag.fromPlain).filter(a => a));
  tagsStore.subscribe(tags => {
    game.settings.set("director", SETTINGS.TAGS, tags);
  })
  initActorsTree();
  initCompendiumTree();

  Hooks.on("renderCompendiumFolderDirectory", () => {
    initCompendiumTree();
  });
}

export function addTree(tree, parent, transform) {
  let items = [];
  const item = TreeItem.from(tree);
  item.color = tree.color || tree.data?.color;
  let content = tree.content || tree.contents;
  item.count = tree.children?.length + content?.length;
  if (parent) {
    parent.children.push({ id: item.id });
  } else {
    item.root = true;
    item.id = "root";
  }
  items.push(item);

  for (let c of tree.children) {
    if (typeof c === "string" || c instanceof String) {
      c = game.customFolders.fic.folders.find(f => f.id == c);
    }
    if (c) {
      items.push(...addTree(c, item, transform));
    }
  }

  for (const i of content) {
    let ci = TreeItem.from(i);
    if (transform) {
      ci = transform(ci, i);
    }
    item.children.push({ id: ci.id });
    items.push(ci);
  }
  return items;
}
