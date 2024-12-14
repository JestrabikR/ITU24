<script>
	import { truncate } from "$lib/helper.js";

	export let title;
	export let dateFrom;
	export let dateTo;
	export let country;
	export let imageUrl;
	export let id;

	if(!imageUrl){
		imageUrl = "https://placehold.co/300x145/80a3ff/white?text=Trip+image";
	}
</script>

<article class="no-padding round">
	<img class="responsive small top-round" src={imageUrl} alt={title}>
	<div class="padding">
		<a href="/trip/{id}">
			<h5><b>{title}</b></h5>
		</a>
		<div>
			<em>{new Date(dateFrom).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})}
			</em>
			- 
			<em>
			{new Date(dateTo).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			})}
			</em>
		</div>
		<div>
		</div>
	</div>
</article>

