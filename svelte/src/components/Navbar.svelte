<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
	
	import Logo from "$lib/assets/logo.svg";

	export let view = false;

	export let currentlyEditing = false;
	export let editFunction = () => {};
	export let saveFunction = () => {};

	export let error = false;
	let current = $page.url.pathname;
</script>

<div class="space"></div>
<nav class="l m">
	<img class="circle" src={Logo} alt="Logo">
	<a href="/"><h3><b><span class:underline={current === '/' ? true : false}>Trips</span></b></h3></a>
	<a href="/visited"><h3><b><span class:underline={current === '/visited' ? true : false}>Visited</span></b></h3></a>
    <div class="max"></div>
	{#if !view && !error}
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
		{#if currentlyEditing }
		<nav class="no-space">
			<button class="border square round extra" on:click={saveFunction}>
				<i class="extra secondary-text">save</i>
			</button>
		</nav>
		{:else}
		<button class="border square round extra" on:click={editFunction}>
			<i class="extra secondary-text">edit</i>
		</button>
		{/if}
	{:else if error}
		<a href="mailto:xhrubo01@fit.vutbr.cz?subject=Trip app - bug report" taget="_blank">
			<button class="border square round extra error">
				<i class="extra">bug_report</i>
			</button>
		</a>
	{/if}

</nav>

<!-- small device version -->
<nav class="s right">
	<header>
		<img class="circle" src={Logo} alt="Logo">
	</header>
	<a href="/"><b><i>explore_nearby</i><span class:underline={current === '/' ? true : false}>Trips</span></b></a>
	<a href="/visited"><b><i>globe</i><span class:underline={current === '/visited' ? true : false}>Visited</span></b></a>
    <div class="max"></div>
	{#if !view && !error}
	<button class="square round extra">
		<i>add</i>
	</button>
	{:else if view}
		<button class="border square round extra">
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra" on:click={() => goto("/")}>
			<i class="extra">close</i>
		</button>
		{#if currentlyEditing }
		<button class="border square round extra" on:click={saveFunction}>
			<i class="extra secondary-text">save</i>
		</button>
		<button class="border square round extra" on:click={editFunction}>
			<i class="extra secondary-text">cancel</i>
		</button>
		{:else}
		<button class="border square round extra" on:click={editFunction}>
			<i class="extra secondary-text">edit</i>
		</button>
		{/if}
	{:else if error}
		<a href="mailto:xhrubo01@fit.vutbr.cz?subject=Trip app - bug report" taget="_blank">
			<button class="border square round extra error">
				<i class="extra">bug_report</i>
			</button>
		</a>
	{/if}
</nav>
<div class="space"></div>
