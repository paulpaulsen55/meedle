<script lang="ts">
	import { goto } from '$app/navigation';
	import { locations } from '../store';
	import NavBar from '$lib/NavBar.svelte';
	import AddressInput from '$lib/AddressInput.svelte';
	import { ChevronDown, FastForward, Sparkles, Users } from 'lucide-svelte';

	export let data;

	let location1: string = 'tuxer steig 6',
		location2: string = 'Rheinbabenallee 47';

	function startClick() {
		locations.set({ location1, location2 });
		goto('/map');
	}
</script>

<div class="grid place-items-center">
	<NavBar />
	<section class="h-screen grid place-items-center">
		<div class="grid place-items-center">
			<img src="/logo.svg" alt="logo" class="w-full" />
			<p class="text-center text-neutral-400 mt-5">
				Meedle ist die App, die dir hilft, den perfekten Ort für ein <br>
				Treffen zu finden. Gib einfach zwei Orte ein und lass Meedle <br> den Rest erledigen. Probiere es direkt aus:
			</p>
		</div>
		<div class="self-start flex flex-col items-center relative bg-dotted radial px-56 py-20">
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
		<ChevronDown class="animate-bounce mb-5"/>
	</section>
	<section class="h-screen grid place-items-center">
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
		<div class="justify-self-center self-center h-4/5 w-3/5 grid grid-flow-col gap-10 place-items-center" id="functions">
			<div class="space-y-4">
				<FastForward class="w-14 h-14 text-magnum-900" />
				<h2 class="text-3xl font-bold text-neutral-100">Schnelligkeit</h2>
				<p class="text-neutral-400 text-justify">
					Meedle ist eine smarte Plattform, die dir dabei hilft, den idealen Ort für ein Treffen zu finden. Meedle schlägt mithilfe leistungsstarker Algorithmen und einer intuitiven Benutzeroberfläche schnell Treffpunkte vor, die genau in der Mitte zwischen Dir und anderen Personen liegen. So sparst Du Zeit und Mühe bei der Suche nach dem idealen Ort.
				</p>
			</div>
			<div class="bg-neutral-600 w-px h-4/5"></div>
			<div class="space-y-4">
				<Users class="w-14 h-14 text-magnum-500" />
				<h2 class="text-3xl font-bold text-neutral-100">Treffen</h2>
				<p class="text-neutral-400 text-justify">
					Ob Geschäftsbesprechung, Date oder informelles Treffen mit Freunden - Meedle hat das Richtige für Dich. Die intelligente Suche berücksichtigt die individuellen Vorlieben und schlägt passendes vor. Endlose Diskussionen über den Ort des Treffens sind damit Geschichte. Mit Meedle ist der perfekte Ort nur wenige Klicks entfernt.
				</p>
			</div>
			<div class="bg-neutral-600 w-px h-4/5"></div>
			<div class="space-y-4">
				<Sparkles class="w-14 h-14 text-magnum-300" />
				<h2 class="text-3xl font-bold text-neutral-100">Wunderschön</h2>
				<p class="text-neutral-400 text-justify">
					Meedle legt großen Wert auf gutes Design und Benutzerfreundlichkeit. Die Website ist übersichtlich, modern und leicht zu navigieren. Farben, Schriften und Layout wurden sorgfältig ausgewählt. Schau dir selbst die Website von Meedle und überzeugen Sie sich selbst von der Einfachheit und Eleganz.
				</p>
			</div>
		</div>
	</section>
</div>
