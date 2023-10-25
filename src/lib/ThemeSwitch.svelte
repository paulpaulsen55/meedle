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

<div class="z-30">
    <input checked={darkMode} on:click={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
    <label for="theme-toggle" />
</div>

<style lang="postcss">
    #theme-toggle {
        @apply invisible;
    }

    #theme-toggle + label {
        @apply inline-block cursor-pointer h-8 w-8 rounded-full duration-300 content-[''];
    }

    #theme-toggle:checked + label {
        @apply bg-yellow-300;
    }

    #theme-toggle:not(:checked) + label {
        @apply bg-transparent;
        box-shadow: inset -9.5px -9.5px 1px 1px #ddd;
    }
</style>