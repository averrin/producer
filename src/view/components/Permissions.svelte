<script>
   export let item;
   const pnames = {};
   pnames[CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED] = "Limited";
   pnames[CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER] = "Observer";
   pnames[CONST.DOCUMENT_PERMISSION_LEVELS.OWNER] = "Owner";
</script>

{#if item.data.permission}
   <span class="ui-flex ui-row ui-items-center ui-gap-[0.2rem]">
      {#each Object.entries(item.data.permission) as [id, p]}
         {#if p > 0 && id != globalThis.game.user.id}
            <div
               class="ui-h-2 ui-w-2 ui-mask"
               style:background-color={globalThis.game.users.get(id)?.data.color}
               class:diamond={p == CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED}
               class:ui-rounded-full={p == CONST.DOCUMENT_PERMISSION_LEVELS.OWNER}
               class:ui-ring={id == "default"}
               class:ui-ring-width-1={id == "default"}
               title="{globalThis.game.users.get(id)?.name || 'default'}: {pnames[p]}"
            />
         {/if}
      {/each}
   </span>
{/if}

<style>
   .diamond {
      transform-origin: 50% 50%;
      transform: rotate(45deg) scale(0.8);
      margin-right: 1px;
   }
</style>
