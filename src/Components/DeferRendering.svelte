<script>
    let { maxTime = 1200, children} = $props();
    let visible = $state(false);

    setTimeout(() => {
        visible = true;
    }, maxTime*Math.random());
</script>

{#if visible}
    {@render children()}
{/if}