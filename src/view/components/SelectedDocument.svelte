<script>
   import { logger, getFlag, setFlag, hasFlag } from "crew-components/helpers";
   import Tags from "crew-components/Tags";
   import ArgInput from "crew-components/ArgInput";
   import DocumentThumb from "./DocumentThumb.svelte";

   export let item;
   import { selected } from "../../modules/stores.js";

   function update(e, path) {
      const updates = { _id: item.id };
      updates[path] = e.target.value;
      item.update(updates);
   }

   function clone() {
      item.clone({ name: `${item.name} (Copy)` }, { save: true });
   }
   function remove() {
      item.deleteDialog().then((r) => {
         if (r) {
            selected.set([]);
         }
      });
   }

   if (!hasFlag(item, "tagger")) setFlag(item, "tagger", { tags: [] });
   let tags = getFlag(item, "tagger")?.tags || [];

   function setTags(e) {
      setFlag(item, "tagger", e.detail);
      tags = getFlag(item, "tagger")?.tags;
      logger.info(item);
   }
   $: tags = getFlag(item, "tagger")?.tags || [];

   function changeColor(e) {
      item.update({ color: e.detail });
   }

   function changePermissions() {
      new PermissionControl(item, {
         top: Math.min(0, window.innerHeight - 350),
         left: window.innerWidth - 720,
      }).render(true);
   }
</script>

<div class="ui-flex ui-flex-col ui-gap-3" id={item.id}>
   <div class="ui-flex ui-flex-row ui-gap-3 ui-items-center">
      {#if item.thumbnail}
         <div class="ui-h-12 ui-w-12">
            <DocumentThumb {item} on:click={() => item.sheet.render(true)} />
         </div>
      {:else}
         <iconify-icon icon="fa-solid:folder" class="ui-ml-2 ui-text-lg" />
      {/if}

      <div class="ui-flex ui-flex-row ui-flex-1">
         <div class="ui-input-group">
            <span>Name</span>
            <input type="text" class="ui-input" value={item.name} on:change={(e) => update(e, "name")} />
         </div>
      </div>

      <div class="ui-flex ui-flex-row ui-flex-none">
         <div class="ui-btn-group">
            <button class="ui-btn ui-btn-square" on:click={clone}>
               <iconify-icon icon="fa-solid:clone" class="ui-text-lg" />
            </button>

            {#if !item.thumbnail}
               <ArgInput type="color" value={item.data.color} compact={true} inline={true} on:change={changeColor} />
            {/if}

            <button class="ui-btn ui-btn-square ui-btn-error" on:click={remove}>
               <iconify-icon icon="gridicons:cross" class="ui-text-xl" />
            </button>
         </div>
      </div>
   </div>
   <div class="ui-flex ui-flex-row ui-gap-1/2">
      <button class="ui-btn ui-btn-square ui-btn-xs">
         <iconify-icon icon="fa:share-alt" class="ui-text-lg" on:click={changePermissions} />
      </button>
      <button class="ui-btn ui-btn-square ui-btn-xs">
         <iconify-icon icon="icon-park-solid:edit-name" class="ui-text-lg" />
      </button>
      <button class="ui-btn ui-btn-square ui-btn-xs">
         <iconify-icon icon="fluent-emoji-high-contrast:id-button" class="ui-text-lg" />
      </button>
      {#if item.thumbnail}
         <button class="ui-btn ui-btn-square ui-btn-xs">
            <iconify-icon icon="fa:user-circle" class="ui-text-lg" />
         </button>
         <button class="ui-btn ui-btn-square ui-btn-xs">
            <iconify-icon icon="fa:image" class="ui-text-lg" />
         </button>
      {/if}
   </div>
   <div class="ui-flex ui-flex-row ui-gap-3">
      <div class="ui-input-group">
         <span>Tags</span>
         <Tags {tags} on:tags={setTags} allowPaste={true} allowDrop={true} onlyUnique={true} />
      </div>
   </div>
</div>
