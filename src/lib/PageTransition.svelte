<script lang="ts">
	import { fly } from 'svelte/transition';
	let innerWidth = 0;
</script>

<svelte:window bind:innerWidth />

<div
	in:fly={{ x: innerWidth / 2, duration: 200, delay: 200 }}
	out:fly={{ x: (innerWidth / 2) * -1, duration: 200 }}
>
	<slot />
</div>
