<script>
	import Navbar from "@components/Navbar.svelte";
	import Card from "@components/Card.svelte";

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<main class="responsive">
	<Navbar/>

	<div class="grid medium-space">
		{#each data.trips as card}
			<div class="s12 m6 l4">
				<Card title={card.name} description={card.description} imageUrl={card.imageUrl} />
			</div>
		{/each}
	</div>
</main>
