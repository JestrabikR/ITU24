<script>
	import Navbar from "../components/Navbar.svelte";
	import Card from "../components/Card.svelte";
let cards = [
    {
      title: 'Card 1',
      description: 'This is the first card.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      title: 'Card 2',
      description: 'This is the second card.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      title: 'Card 3',
      description: 'This is the third card.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      title: 'Card 4',
      description: 'This is the fourth card.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      title: 'Card 5',
      description: 'This is the fifth card.',
      imageUrl: 'https://via.placeholder.com/150'
    },
    {
      title: 'Card 6',
      description: 'This is the sixth card.',
      imageUrl: 'https://via.placeholder.com/150'
    }
  ];
</script>

<main class="responsive">
	<Navbar />

	<div class="grid medium-space">
		{#each cards as card}
			<div class="s12 m6 l4">
				<Card title={card.title} description={card.description} imageUrl={card.imageUrl} />
			</div>
		{/each}
	</div>
</main>
