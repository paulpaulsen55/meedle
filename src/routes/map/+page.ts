import { tagsList } from '$lib/helpers/tagsList';
import type { Tag } from '@melt-ui/svelte';

// @ts-ignore
export async function load({ url }) {
    const radius = url.searchParams.get('r');
    const poi = url.searchParams.get('p');
    const location1 = url.searchParams.get('a1');
    const location2 = url.searchParams.get('a2');
    const tags = url.searchParams.get('t')?.split(',');

    

    if (radius != null && poi != null && location1 != null && location2 != null && tags != null){
        // get tag values
        let tempTags: Tag[] = [];
        if (tags.length > 0){
			for (let i = 0; i < tags.length; i++) {
				let title = '';
				Object.entries(tagsList).forEach(([k,m]) => {	
                    const t = m.get(tags[i]);
                    if (t){
                        title = t;
                    }
				});
				tempTags.push({id: tags[i], value: title});
			}
		}

        return {
            radius: Number(radius),
            poi: Number(poi),
            location1: location1,
            location2: location2,
            tags: tempTags
        } 
    }
    return;
}  