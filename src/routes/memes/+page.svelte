<!-- Gallery.svelte -->
<script lang="ts">
    let imageList: string[] = [
        "img.png",
        "img_1.png",
        "img_2.png",
        "img_3.png",
        "img_4.png",
        "img_5.png",
        "img_6.png",
        "img_7.png",
        "img_8.png",
        "img_9.png",
        "img_10.png",
        "img_11.png",
        "img_12.png",
        "img_13.png",
        "img_14.png",
        "img_15.png",
        "img_16.png",
        "img_17.png",
        "img_18.png",
        "84aib2.gif"
    ];

</script>

<h1 class="flex justify-center text-9xl">
    Impressum? Nein Memes!
</h1>
<div class="image-gallery flex flex-wrap m-8 justify-center items-center">
    {#each imageList as image (image)}
        <img src={`memes/${image}`} alt={"alt"} class="max-w-full h-[200px] m-2 transition-transform transform hover:scale-[2.25] hover:z-10"  />
    {/each}
</div>

<style>
    .image-gallery {
        display: flex;
        flex-direction: row;
    }
</style>
