<script lang="ts">
	import { onMount } from "svelte";

    let darkMode = false;

    function handleSwitchDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        darkMode
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    }
    onMount(()=> {
        darkMode = localStorage.theme == 'dark' ? true : false;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        darkMode
            ? document.documentElement.classList.add('dark')
            : document.documentElement.classList.remove('dark');
    })
</script>

<div class="absolute mt-20 md:mt-0">
    <input checked={darkMode} on:click={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
    <label for="theme-toggle" />
</div>

<style lang="postcss">
    #theme-toggle {
        @apply invisible;
    }

    #theme-toggle + label {
        @apply inline-block cursor-pointer h-12 w-12 absolute top-6 right-6 md:right-24 rounded-full duration-300 content-[''];
    }

    #theme-toggle:checked + label {
        @apply bg-yellow-300;
    }

    #theme-toggle:not(:checked) + label {
        @apply bg-transparent;
        box-shadow: inset -18px -16px 1px 1px #ddd;
    }
</style>