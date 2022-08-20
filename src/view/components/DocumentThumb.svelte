<script>
   export let item;
   import { currentCollection } from "../../modules/stores.js";

   function drag(e) {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: $currentCollection.documentName, id: item.id }));
   }
</script>

<div
   class="ui-w-full ui-h-full ui-border-none ui-rounded-md ui-bg-contain ui-bg-no-repeat"
   style:background-image="url({item.thumbnail})"
   alt=""
   draggable={true}
   on:pointerdown={() => null}
   on:click
   on:dragstart={drag}
   style:cursor="grab"
/>
