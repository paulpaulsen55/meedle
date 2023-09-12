<script lang="ts">
    import { tweened, type Tweened } from 'svelte/motion';
    export let size = {x: 50, y: 10};
    export let animation = false;
    export let opacity = 0.25;

    const radius = 2;
    const spacing = 24;
    let opacityValues: Array<Tweened<number>> = [];
    let values: Array<number> = [];
    

    if (animation) {
        function opacity(): number {
            return Math.random();
        }

        opacityValues = Array(size.x * size.y).fill(0).map(() => tweened(0.25 * opacity()));
        setInterval(() => {
            opacityValues.forEach((value) => value.set(0.25 * opacity()));
        }, 500);

    }

    $ : if (animation){
            opacityValues.forEach((value, index) => {
                value.subscribe((newValue) => {
                    values[index] = newValue;
                });
            });
        }
</script>
  
<svg width="100%" height="100%">
    {#each Array(size.x) as _, i}
        {#each Array(size.y) as _, j}
            <circle
                cx={spacing*i + radius}
                cy={spacing*j + radius}
                r={radius}
                fill="#FCE0AC"
                opacity={opacity * (animation ? values[i*size.y + j] : 1)}
            />
        {/each}
    {/each}
</svg>
  