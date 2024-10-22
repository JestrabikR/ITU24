<script>
	import Navbar from "@components/Navbar.svelte";
	import Card from "@components/Card.svelte";

	/** @type {import('./$types').PageData} */
	export let data = [];

	const today = new Date();
	var pastTrips = data.trips.filter(trip => new Date(trip.until_date) < today);
	var ongoingTrips = data.trips.filter(trip => new Date(trip.from_date) <= today && new Date(trip.until_date) >= today);
	var futureTrips = data.trips.filter(trip => new Date(trip.from_date) > today);
</script>

<main class="responsive">
	<Navbar/>

	<div class="row">
		<h3><b>Ongoing trips</b></h3>
	</div>
	{#if ongoingTrips.length < 1}
		<p class="italic">You have no ongoing trips</p>
	{:else}
	<div class="grid medium-space">
		{#each ongoingTrips as card}
			<div class="s12 m6 l3">
				<Card title={card.name} description={card.description} imageUrl={card.photos[0]} id={card.id} />
			</div>
		{/each}
	</div>
	{/if}

	<div class="row">
		<h3><b>Future trips</b></h3>
	</div>
	{#if futureTrips.length < 1}
		<p class="italic">You have no future trips</p>
	{:else}
	<div class="grid medium-space">
		{#each futureTrips as card}
			<div class="s12 m6 l3">
				<Card title={card.name} description={card.description} imageUrl={card.photos[0]} id={card.id} />
			</div>
		{/each}
	</div>
	{/if}

	<div class="row">
		<h3><b>Past trips</b></h3>
	</div>
	{#if pastTrips.length < 1}
		<p class="italic">You have no past trips</p>
	{:else}
	<div class="grid medium-space">
		{#each pastTrips as card}
			<div class="s12 m6 l3">
				<Card title={card.name} description={card.description} imageUrl={card.photos[0]} id={card.id} />
			</div>
		{/each}
	</div>
	{/if}
</main>
