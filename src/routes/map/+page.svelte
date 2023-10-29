<script lang="ts">
    import AddressInput from '$lib/AddressInput.svelte';
    import Accordion from '$lib/Accordion.svelte';
    import {onMount} from 'svelte';
    import {pointToCoordinates, pointToFeatures} from '$lib/helpers/mapbox';
    import {FileEdit} from 'lucide-svelte';
    import {locations, poi as p, radius as r} from '../../store';
    import Map from '$lib/Map.svelte';
    import AdressSettings from '$lib/AdressSettings.svelte';
    import TagsSettings from '$lib/TagsSettings.svelte';
    import AsideWrapper from '$lib/AsideWrapper.svelte';
    import type {Tag} from '@melt-ui/svelte';
    import type {Coordinate, Feature, Address} from '../../app';
    import type {Unsubscriber} from 'svelte/store';
    import LocationSwitch from "$lib/LocationSwitch.svelte";
    import Share from '$lib/Share.svelte';

    export let data;
    let hoverdPointId: string | null,
        radius = 0,
        poi = 0;

    const unsubscribeRad: Unsubscriber = r.subscribe((value) => (radius = value));
    const unsubscribePoi: Unsubscriber = p.subscribe((value) => (poi = value));

    let userLocationInput1 : Address = {title: '', address: ''},
        userLocationInput2 : Address = {title: '', address: ''},
        locationCoordinates: Coordinate[] | undefined = undefined,
        middleCoordinate: Coordinate | undefined = undefined,
        category = ['food_and_drink'],
        response: Feature[] | undefined = undefined,
        edit = true,
        asideWrapper: AsideWrapper;

    async function handleNewMiddle(event: CustomEvent<Coordinate>) {
        middleCoordinate = event.detail;

        response = await pointToFeatures(category, event.detail);
    }


    async function handleSubmit() {
        if (!userLocationInput1 || !userLocationInput2) return;

        const point1 = await pointToCoordinates(userLocationInput1);
        const point2 = await pointToCoordinates(userLocationInput2);
        locations.set({
            location1: {title: userLocationInput1.title, address: userLocationInput1.address, coordinate: point1},
            location2: {title: userLocationInput2.title, address: userLocationInput2.address, coordinate: point2}
        });
        locationCoordinates = [point1, point2];
        middleCoordinate = {
            lng: (point1.lng + point2.lng) / 2,
            lat: (point1.lat + point2.lat) / 2
        };

        r.set(radius);
        p.set(poi);

        response = await pointToFeatures(category, middleCoordinate);
    }

    function handleTagsSetting(event: CustomEvent<Tag[]>) {
        const filterTags = event.detail;
        category = [];
        category = filterTags.map((tag) => tag.id);

        handleSubmit();
    }

    // loads data only when both locations are set through the store - prevents unnecessary api calls
    onMount(() => {
        if (data.location1 != undefined){
            p.set(data.poi);
            r.set(data.radius);
            userLocationInput1 = {title: data.location1.split(',')[0], address: data.location1};
            userLocationInput2 = {title: data.location2.split(',')[0], address: data.location2};
            for (let i = 0; i < data.tags.length; i++) {
                category.push(data.tags[i].id);
            }
        } else {
            userLocationInput1 = $locations.location1.title != '' ? $locations.location1 : { title: '', address: '' };
            userLocationInput2 = $locations.location2.title != '' ? $locations.location2 : { title: '', address: '' };
        }

        if (userLocationInput1.title != '' && userLocationInput2.title != '') {
            handleSubmit();
            edit = false;
        }
    });

    $ : if (hoverdPointId != null) {
        asideWrapper.setOpen(true);
    }

</script>

<div class="flex relative overflow-hidden touch-none">
    <AsideWrapper bind:this={asideWrapper}>
        {#if edit}
            <div class="mt-10">
                <AddressInput bind:location={userLocationInput1} sessionToken={data.sessionToken}/>
                <div class="mt-3"></div>
                <AddressInput bind:location={userLocationInput2} sessionToken={data.sessionToken}/>
                <div class="space-x-3 flex mt-5">
                    <AdressSettings bind:radius bind:poi/>
                    <button
                            on:click={() => {
							handleSubmit();
							edit = false;
						}}
                            class="button-magnum w-80 justify-center">meet me in the middle
                    </button
                    >
                </div>
            </div>
        {:else}
            <div class="flex gap-5 mt-5 items-end justify-between select-none">
                <LocationSwitch locations={$locations}/>
                <button type="button" on:click={() => (edit = true)} class="">
                    <FileEdit class="h-6 mb-1 dark:text-black text-white"/>
                </button>
            </div>
        {/if}

        {#if response}
            <Accordion response={response} bind:hoverdPointId/>
        {/if}
        <div class="w-96 h-32 bg-dotted -ml-6 -mb-4 p-2 absolute bottom-2"/>
    </AsideWrapper>
    <div class="absolute md:ml-96 z-10 p-1">
        <TagsSettings on:updateTags={handleTagsSetting}/>
    </div>
    <Map locations={locationCoordinates} middle={middleCoordinate} response={response} bind:hoverdPointId
         on:newMiddle={handleNewMiddle}/>
    {#if userLocationInput1.address !== '' && userLocationInput2.address !== '' &&  !edit}
        <div class="absolute top-2 right-12">
            <Share bind:category/>
        </div>
    {/if}
</div>

