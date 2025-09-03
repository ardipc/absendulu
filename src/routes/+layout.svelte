<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={'/assets/favicon.ico'} />
	<title>Absensi Mudah, Cepat, dan Akurat</title>
</svelte:head>

{@render children?.()}
