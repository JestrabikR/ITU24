<script>
  export let title;
  export let description;
  export let imageUrl;
</script>

<article class="no-padding round">
	<img class="responsive top-round" src="https://placehold.co/600x400" alt={title}>
	<div class="padding">
		<h5>{title}</h5>
		<p>{description}</p>
	</div>
</article>
