<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';
	import Footer from '$lib/Footer.svelte';
	import AddressInput from '$lib/AddressInput.svelte';
	import {
		ChevronDown,
		FastForward,
		Sparkles,
		Users,
		Filter,
		ChevronRight,
		Share2,
		Map
	} from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export let data;

	const selectImages = ['filters.png', 'share.png', 'detail.png'];
	let imgIndex = 2;

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';

	function startClick() {
		locations.set({ location1, location2 });
		goto('/map');
	}
</script>

<div class="grid place-items-center scroll-smooth" id="top">
	<NavBar />
	<section class="h-screen grid place-items-center relative">
		<div class="grid place-items-center">
			<img src="/logo.svg" alt="logo" class="w-full" />
			<p class="text-center text-neutral-400 mt-5">
				Meedle ist die App, die dir hilft, den perfekten Ort für ein <br />
				Treffen zu finden. Gib einfach zwei Orte ein und lass Meedle <br /> den Rest erledigen. Probiere
				es direkt aus:
			</p>
		</div>
		<div
			class="self-start flex flex-col items-center relative bg-dotted radial bg-animate-pulse px-64 py-28"
		>
			<div class="space-x-3 flex">
				<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
				<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
			</div>
			<button
				on:click={() => startClick()}
				class="button-magnum w-64 mt-5 flex justify-center z-10"
				type="button"
			>
				start
			</button>
		</div>
		<a href="/#functions" class="absolute bottom-20 flex justify-center">
			<ChevronDown class="animate-bounce mb-5 cursor-pointer" />
		</a>
	</section>
	<section class="h-screen grid place-items-center" id="functions">
		<svg xmlns="http://www.w3.org/2000/svg" width="1438" height="68" fill="none"
			><path
				stroke="#F7B155"
				stroke-dasharray={'60 60'}
				stroke-linecap="round"
				stroke-width="11"
				d="M6 25.114c97.979 17.476 353.159 73.45 768.539 0 204.632-34.276 457.401-14.916 657.461 0"
			/>
			<animate
				attributeName="stroke-dashoffset"
				values="120;0"
				dur="3s"
				calcMode="linear"
				repeatCount="indefinite"
			/>
		</svg>
		<div class="justify-self-center self-center h-4/5 w-3/5 flex gap-2 place-items-start">
			<div
				class="w-1/3 space-y-4 hover:bg-neutral-800 p-2 rounded-md cursor-pointer transition hover:-translate-y-1"
			>
				<FastForward class="w-14 h-14 text-magnum-900" />
				<h2 class="text-3xl font-bold text-neutral-100">Schnelligkeit</h2>
				<p class="text-neutral-400">
					Meedle ist eine smarte Plattform, die dir dabei hilft, den idealen Ort für ein Treffen zu
					finden. Meedle schlägt mithilfe leistungsstarker Algorithmen und einer intuitiven
					Benutzeroberfläche schnell Treffpunkte vor, die genau in der Mitte zwischen Dir und
					anderen Personen liegen. So sparst Du Zeit und Mühe bei der Suche nach dem idealen Ort.
				</p>
			</div>
			<div class="bg-neutral-600 w-px h-4/5" />
			<div
				class="w-1/3 space-y-4 hover:bg-neutral-800 p-2 rounded-md cursor-pointer transition hover:-translate-y-1"
			>
				<Users class="w-14 h-14 text-magnum-500" />
				<h2 class="text-3xl font-bold text-neutral-100">Treffen</h2>
				<p class="text-neutral-400">
					Ob Geschäftsbesprechung, Date oder informelles Treffen mit Freunden - Meedle hat das
					Richtige für Dich. Die intelligente Suche berücksichtigt die individuellen Vorlieben und
					schlägt passendes vor. Endlose Diskussionen über den Ort des Treffens sind damit
					Geschichte. Mit Meedle ist der perfekte Ort nur wenige Klicks entfernt.
				</p>
			</div>
			<div class="bg-neutral-600 w-px h-4/5" />
			<div
				class="w-1/3 space-y-4 hover:bg-neutral-800 p-2 rounded-md cursor-pointer transition hover:-translate-y-1"
			>
				<Sparkles class="w-14 h-14 text-magnum-300" />
				<h2 class="text-3xl font-bold text-neutral-100">Wunderschön</h2>
				<p class="text-neutral-400">
					Meedle legt großen Wert auf gutes Design und Benutzerfreundlichkeit. Die Website ist
					übersichtlich, modern und leicht zu navigieren. Farben, Schriften und Layout wurden
					sorgfältig ausgewählt. Schau dir selbst die Website von Meedle und überzeugen Sie sich
					selbst von der Einfachheit und Eleganz.
				</p>
			</div>
		</div>
	</section>
	<section class="h-screen grid grid-cols-2 place-items-center w-3/5">
		<div class="space-y-5">
			<button
				class="w-full flex items-center gap-5 hover:bg-neutral-800 p-2 rounded-md transition cursor-pointer focus:scale-105 focus:bg-neutral-800"
				on:click={() => (imgIndex = 0)}
			>
				<div class="bg-magnum-400 p-4 rounded-md">
					<Filter class="w-10 h-10 text-neutral-900" />
				</div>
				<h3 class="flex items-center w-full text-xl font-semibold">
					Endlose Filtermöglichkeiten <ChevronRight class="mr-0 ml-auto" />
				</h3>
			</button>
			<button
				class="w-full flex items-center gap-5 hover:bg-neutral-800 p-2 rounded-md transition cursor-pointer focus:scale-105 focus:bg-neutral-800"
				on:click={() => (imgIndex = 1)}
			>
				<div class="bg-magnum-400 p-4 rounded-md">
					<Share2 class="w-10 h-10 text-neutral-900" />
				</div>
				<h3 class="flex items-center w-full text-xl font-semibold">
					Direkt teilen mit Freunden <ChevronRight class="mr-0 ml-auto" />
				</h3>
			</button>
			<button
				class="w-full flex items-center gap-5 hover:bg-neutral-800 p-2 rounded-md transition cursor-pointer focus:scale-105 focus:bg-neutral-800"
				on:click={() => (imgIndex = 2)}
			>
				<div class="bg-magnum-400 p-4 rounded-md">
					<Map class="w-10 h-10 text-neutral-900" />
				</div>
				<h3 class="flex items-center w-full text-xl font-semibold">
					Detailreiche Anzeige <ChevronRight class="mr-0 ml-auto" />
				</h3>
			</button>
		</div>
		<div class="bg-neutral-800 p-2 rounded-md w-full h-1/2 flex justify-center relative">
			{#each selectImages as img, i}
				{#if i == imgIndex}
					<img
						src={'/' + img}
						alt="map"
						class="h-full p-5 absolute"
						style="filter: drop-shadow(0 20px 13px rgb(247 177 85 / 0.03)) drop-shadow(0 8px 5px rgb(247 177 85 / 0.08));"
						in:fly={{ y: 50, duration: 500 }}
						out:fly={{ y: -50, duration: 500 }}
					/>
				{/if}
			{/each}
		</div>
	</section>
	<section class="grid grid-cols-2 grid-rows-2 gap-10 w-3/5 mb-5 place-items-center" id="about">
		<div>
			<h2 class="text-2xl font-semibold mb-5">Wer wir sind?</h2>
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
		</div>
		<img src="https://images.unsplash.com/photo-1518335935020-cfd6580c1ab4" alt="img" class="h-4/5">
		<img src="https://images.unsplash.com/photo-1518335935020-cfd6580c1ab4" alt="img" class="h-4/5">
		<div>
			<h2 class="text-2xl font-semibold mb-5">wer wir sind?</h2>
			<p>
				Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
				invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
				et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
				Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
				diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
				voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
				gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
			</p>
		</div>
			</section>
	<Footer />
</div>
