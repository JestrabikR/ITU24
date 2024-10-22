<script>
	import { truncate } from "$lib/helper.js";

	export let title;
	export let description;
	export let imageUrl;
	export let id;

	if(!imageUrl){
		imageUrl = "https://placehold.co/300x145?text=Trip+image";
	}
</script>

<article class="no-padding round">
	<img class="responsive small top-round" src={imageUrl} alt={title}>
	<div class="padding">
		<a href="/trip/{id}">
			<h5><b>{title}</b></h5>
		</a>
		<p>{truncate(description)}</p>
	</div>
</article>

