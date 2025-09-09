<script lang="ts">
	import NavBottom from '$lib/components/nav-bottom.svelte';
	import NavTop from '$lib/components/nav-top.svelte';

	let { children } = $props();
</script>

<NavTop />

<section class="pt-16 pb-16 sm:pb-20 px-3">
	{@render children?.()}
</section>

<NavBottom />
