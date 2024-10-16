<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
	
	import Logo from "$lib/assets/logo.svg";

	export let view = false;
	export let edit = false;
	let current = $page.url.pathname;
</script>

<div class="space"></div>
<nav>
	<img class="circle" src={Logo} alt="Logo">
	<a href="/"><h3><b><span class:underline={current === '/' ? true : false}>Trips</span></b></h3></a>
	<a href="/visited"><h3><b><span class:underline={current === '/visited' ? true : false}>Visited</span></b></h3></a>
    <div class="max"></div>
	{#if !view && !edit}
	<button class="extend square round">
		<i>add</i>
		<span>Add trip</span>
	</button>
	{:else if view}
		<button class="border square round extra">
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra" on:click={() => goto("/")}>
			<i class="extra">close</i>
		</button>
	{:else if edit}
		<button class="border square round extra">
			<i class="extra">delete</i>
		</button>
		<button class="border square round extra">
			<i class="extra">close</i>
		</button>
	{/if}

</nav>
<div class="space"></div>
