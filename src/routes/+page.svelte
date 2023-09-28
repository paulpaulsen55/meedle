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
  	import type { Address } from '../app';
	import AdressSettings from '$lib/AdressSettings.svelte';
	import { radius as r } from '../store';
	import { poi as p } from '../store';
	import { createSeparator, melt, type CreateSeparatorProps, } from '@melt-ui/svelte';

	export let orientation: CreateSeparatorProps['orientation'] = 'vertical';
 
	const {
		elements: { root: vertical },
	} = createSeparator({
		orientation,
	});

	export let data;

	const selectImages = ['filters.png', 'share.png', 'detail.png'];
	let imgIndex = 2;

	let location1: Address = { title: '', address: '' },
		location2: Address = { title: '', address: '' };
	let radius = 5;
	let poi = 5;

	function startClick() {
		locations.set({ location1, location2 });
		r.set(radius);
		p.set(poi);
		goto('/map');
	}
</script>

<div class="grid place-items-center scroll-smooth" id="top">
	<NavBar />
	<section class="h-screen flex flex-col relative">
		<div class="grid place-items-center mt-5">
			<img src="/logo.svg" alt="logo" class="w-[60%] spx-2 sm:px-0" />
			<p class="text-center text-neutral-400 mt-5 sm:w-[30rem] leading-relaxed">
				Meedle ist die App, die dir hilft, den perfekten Ort für ein
				Treffen zu finden. Gib einfach zwei Orte ein und lass Meedle 
				den Rest erledigen. Probiere es direkt aus:
			</p>
		</div>
		<div
			class="self-start flex flex-col items-center relative bg-dotted radial bg-animate-pulse sm:px-64 py-28"
		>
			<div class="space-y-3 flex flex-col w-96">
				<AddressInput bind:location={location1} sessionToken={data.sessionToken} />
				<AddressInput bind:location={location2} sessionToken={data.sessionToken} />
			</div>
			<div class="z-10 flex w-full mt-5 gap-2">
				<AdressSettings bind:radius bind:poi/>
				<button
					on:click={() => startClick()}
					class="button-magnum flex justify-center w-full"
					type="button"
				>
					meet me in the middle
				</button>
			</div>
		</div>
		<a href="/#functions" class="absolute bottom-20 flex justify-center w-full">
			<ChevronDown class="animate-bounce mb-5 cursor-pointer" />
		</a>
	</section>
	 <section class="h-screen grid place-items-center" id="functions">
		<div class="w-full grid place-items-center">
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
		</div>
		<div class="w-full lg:w-4/5 xl:w-[70%] grid place-items-center md:place-items-start grid-cols-1 lg:grid-cols-3 relative">
			<div class="h-full space-y-4 hover:bg-neutral-800 p-5 rounded-md cursor-pointer transition hover:-translate-y-1 mx-5">
				<FastForward class="w-14 h-14 text-magnum-900" />
				<h2 class="text-3xl font-bold text-neutral-100">Schnelligkeit</h2>
				<p class="text-neutral-400">
					Meedle ist eine smarte Plattform, die dir dabei hilft, den idealen Ort für ein Treffen zu
					finden. Meedle schlägt mithilfe leistungsstarker Algorithmen und einer intuitiven
					Benutzeroberfläche schnell Treffpunkte vor, die genau in der Mitte zwischen Dir und
					anderen Personen liegen. So sparst Du Zeit und Mühe bei der Suche nach dem idealen Ort.
				</p>
			</div>
			<div class="absolute left-1/3 grid place-items-center top-0  h-full ">
				<div use:melt={$vertical} class="h-4/5 w-[2px] bg-neutral-700"/>
			</div>
			<div class="h-full space-y-4 hover:bg-neutral-800 p-5 rounded-md cursor-pointer transition hover:-translate-y-1 mx-5">
				<Users class="w-14 h-14 text-magnum-500" />
				<h2 class="text-3xl font-bold text-neutral-100">Treffen</h2>
				<p class="text-neutral-400">
					Ob Geschäftsbesprechung, Date oder informelles Treffen mit Freunden - Meedle hat das
					Richtige für Dich. Die intelligente Suche berücksichtigt die individuellen Vorlieben und
					schlägt passendes vor. Endlose Diskussionen über den Ort des Treffens sind damit
					Geschichte. Mit Meedle ist der perfekte Ort nur wenige Klicks entfernt.
				</p>
			</div>
			<div class="absolute left-2/3 grid place-items-center top-0 h-full">
				<div use:melt={$vertical} class="h-4/5 w-[2px] bg-neutral-700"/>
			</div>
			<div class="h-full space-y-4 hover:bg-neutral-800 p-5 rounded-md cursor-pointer transition hover:-translate-y-1 mx-5">
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
	<section class="h-screen grid sm:grid-cols-2 place-items-center w-full lg:w-4/5 xl:w-[70%]">
		<div class="space-y-5 self-end sm:self-auto sm:block mb-5 sm:mb-0">
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
		<div class="bg-neutral-800 p-2 rounded-md w-full h-full sm:h-1/2 flex justify-center relative">
			{#each selectImages as img, i}
				{#if i == imgIndex}
					<img
						src={'/' + img}
						alt="map"
						class="h-full p-5 absolute object-scale-down"
						style="filter: drop-shadow(0 20px 13px rgb(247 177 85 / 0.03)) drop-shadow(0 8px 5px rgb(247 177 85 / 0.08));"
						in:fly={{ y: 50, duration: 500 }}
						out:fly={{ y: -50, duration: 500 }}
					/>
				{/if}
			{/each}
		</div>
	</section>
	<section class="grid sm:grid-cols-2 sm:grid-rows-2 gap-10 w-3/5 mb-5 place-items-center" id="about">
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
