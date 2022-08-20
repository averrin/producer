<script>
   import Tags from "crew-components/Tags";
   import { filter } from "../../modules/stores.js";

   function clearFilter() {
      filter.update((f) => {
         f.tags = [];
         return f;
      });
   }
</script>

<div class="ui-input-group">
   <Tags bind:tags={$filter.tags} allowPaste={true} allowDrop={true} onlyUnique={true} />
   <button class="ui-btn ui-btn-square ui-h-8 ui-min-h-8 ui-ml-0" on:click={clearFilter}>
      <iconify-icon icon="gridicons:cross" />
   </button>
</div>
