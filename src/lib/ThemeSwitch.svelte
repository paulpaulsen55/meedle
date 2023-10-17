<script lang="ts">
	import { onMount } from "svelte";

    let darkMode = true;

    function handleSwitchDarkMode() {
        darkMode = !darkMode;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        darkMode
            ? document.documentElement.classList.remove('dark')
            : document.documentElement.classList.add('dark');
    }
</script>

<div>
    <input checked={darkMode} on:click={handleSwitchDarkMode} type="checkbox" id="theme-toggle" />
    <label for="theme-toggle" />
</div>

<style lang="postcss">
    #theme-toggle {
        @apply invisible;
    }

    #theme-toggle + label {
        @apply inline-block cursor-pointer h-12 w-12 absolute top-6 right-24 rounded-full duration-300 content-[''];
    }

    #theme-toggle:not(:checked) + label {
        @apply bg-yellow-300;
    }

    #theme-toggle:checked + label {
        @apply bg-transparent;
        box-shadow: inset -18px -16px 1px 1px #ddd;
    }
</style>