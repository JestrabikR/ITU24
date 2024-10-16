<script>
	import { truncate } from "$lib/helper.js";

	export let title;
	export let description;
	export let imageUrl;
	export let id;
</script>

<article class="no-padding round">
	<img class="responsive top-round" src={imageUrl} alt={title}>
	<div class="padding">
		<a href="/trip/{id}">
			<h5><b>{title}</b></h5>
		</a>
		<p>{truncate(description)}</p>
	</div>
</article>

