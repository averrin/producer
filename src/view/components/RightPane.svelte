<script>
   import { onDestroy } from "svelte";
   import SelectedActor from "./SelectedActor.svelte";
   import SelectedMultipleActors from "./SelectedMultipleActors.svelte";

   import { selected, currentCollection, isDragging } from "../../modules/stores.js";

   let selectedObjects;
   let selectedObject;
   const unsub = selected.subscribe((s) => {
      selectedObjects = s.map((id) => $currentCollection.get(id) || game.folders.get(id));
      selectedObject = selectedObjects[0];
   });
   onDestroy(unsub);
</script>

{#if !$isDragging}
   {#if !selectedObject}
      <div class="ui-text ui-flex ui-flex-col ui-gap-3 ui-text-center ui-p-2">
         <div>
            Hold <kbd class="ui-kbd">shift</kbd> to reorder items.
         </div>
         <div>Drop item preview on the canvas to add a token.</div>
         <div>
            <kbd class="ui-kbd">right-click</kbd> to select an item.
         </div>
         <div>
            <kbd class="ui-kbd">ctrl</kbd> + <kbd class="ui-kbd">right-click</kbd> to add an item to the selection.
         </div>
      </div>
   {:else if selectedObjects.length == 1}
      <SelectedActor item={selectedObject} />
   {:else}
      <SelectedMultipleActors items={selectedObjects} />
   {/if}
{:else}
   dragging in progress
{/if}
