<script>
   import { selectedBrowser, addTree, expanded } from "../../modules/stores.js";
   import TreeItemComponent from "./TreeItem.svelte";
   import { writable, get } from "svelte/store";
   import { onDestroy } from "svelte";

   let compendium;
   let children = [];
   let content = [];
   let packCode;

   let tree = writable([]);
   let items = {};
   let root;
   let index;
   let currentPage = 1;
   let pageSize = 30;
   let total = 0;

   async function updateIndex() {
      await compendium.getIndex({ fields: ["name", "img"] }).then((i) => {
         index = i;
         compendium.index = index;
      });
   }

   onDestroy(
      selectedBrowser.subscribe((s) => {
         let currentPage = 1;
         compendium = game.packs.get($selectedBrowser[0]);
         packCode = `${compendium.metadata.package}.${compendium.metadata.name}`;

         Promise.all([game.CF.FICFolderAPI.loadFolders(packCode), updateIndex()]).then(() => {
            game.customFolders.fic.folders.contents.forEach((f) => (f.icon = "fa-solid:folder"));
            children = game.customFolders.fic.folders.contents.filter((f) => f.packCode == packCode && !f.parent);
            if (children && children.length > 0) {
               content = [];
            }
            init();
         });

         setContent();
      })
   );

   function setContent() {
      index = index || compendium.index;
      content = index.contents;
      logger.info(content);
      total = content.length;
      content = content.slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize);
      logger.info(content);
      init();
      logger.info($tree);
   }

   function init() {
      items = addTree({ content, children }, undefined, (item, source) => {
         if (typeof source === "string" || source instanceof String) {
            const new_source = index.get(source);
            // logger.info(source, new_source);
            item.source = new_source;
            item.name = new_source?.name;
            item.thumbnail = new_source?.img;
            if (new_source) {
               item.source.thumbnail = new_source?.img || new_source?.thumbnail;
            }
         } else {
            item.source.thumbnail = source?.img || source?.thumbnail;
            item.thumbnail = source?.img || source?.thumbnail;
         }
         return item;
      });
      root = items.find((i) => i.root);
      tree.update((t) => {
         for (const i of items) {
            t[i.id] = i;
         }
         return t;
      });
   }

   function toggleExpanded(node) {
      expanded.update((ex) => {
         const isExpanded = ex.some((i) => i == node.id);
         if (isExpanded) {
            return ex.filter((i) => i != node.id);
         } else {
            ex.push(node.id);
            return ex;
         }
      });
   }

   async function itemClick(e) {
      const { node, event } = e.detail;
      const isFolder = node.source.contents;
      if (!isFolder) {
         logger.info(node);
         const item = await compendium.getDocument(node.source._id);
         item.sheet.render(true);
      } else {
         if (!event.ctrlKey) {
            toggleExpanded(node);
         } else {
            node.source?.apps[0].render(true);
         }
      }
   }

   function setPage(d) {
      currentPage = currentPage + d;
      if (currentPage <= 0) {
         currentPage = 1;
         return;
      }
      const max = Math.ceil(total / pageSize);
      if (currentPage >= max) {
         currentPage = max;
         return;
      }
      setContent();
   }
</script>

{#if root}
   <div class="ui-flex ui-flex-row ui-p-1 ui-justify-center">
      <div class="ui-font-bold ui-text-lg">
         {compendium.title}: {total}
      </div>
   </div>
   <div id={compendium.id} class="ui-p-2 ui-flex ui-flex-1 ui-flex-col ui-overflow-y-auto">
      <div>
         <TreeItemComponent
            node={root}
            bind:nodes={$tree}
            isRoot={true}
            showTags={false}
            disableReorder={true}
            selected={selectedBrowser}
            on:click={itemClick}
         />
      </div>
   </div>

   <div class="ui-flex ui-flex-row ui-p-1 ui-justify-center">
      {#if total != 0 && total > pageSize}
         <div class="ui-btn-group">
            <button class="ui-btn ui-btn-square" on:click={(_) => setPage(-1)} class:ui-btn-disabled={currentPage == 1}
               >«</button
            >

            <button class="ui-btn ui-btn-square ui-btn-ghost">{currentPage}/{Math.ceil(total / pageSize)}</button>

            <button class="ui-btn ui-btn-square" on:click={(_) => setPage(+1)}>»</button>
         </div>
      {/if}
   </div>
{/if}
