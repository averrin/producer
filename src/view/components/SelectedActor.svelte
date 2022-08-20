<script>
   import SelectedDocument from "./SelectedDocument.svelte";
   export let item;
</script>

<div class="ui-p-2" id={item.id}>
   <SelectedDocument bind:item />
   <p>Actor details</p>
</div>
