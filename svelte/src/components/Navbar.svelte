<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
	
	import Logo from "$lib/assets/logo.svg";

	export let view = false;

	export let currentlyEditing = false;
	export let editFunction = () => {};
	export let saveFunction = () => {};
	export let deleteFunction = () => {};
	export let tripName = "";

	export let error = false;
	let current = $page.url.pathname;
</script>

<div class="space"></div>
<nav class="l m">
	<img class="circle" src={Logo} alt="Logo">
	<a href="/"><h3><b><span class:underline={current === '/' ? true : false}>Trips</span></b></h3></a>
	<a href="/visited"><h3><b><span class:underline={current === '/visited' ? true : false}>Visited</span></b></h3></a>
	<div class="absolute right">
	<button class="extend square round">
		<i>add</i>
		<span>New trip</span>
	</button>
	</div>
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
		<button class="border square round extra" on:click={() => {ui("#delete-trip-confirm-sm")}}>
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra" on:click={() => goto("/")}>
			<i class="extra">apps</i>
		</button>
		{#if currentlyEditing }
		<button class="border square round extra" on:click={saveFunction}>
			<i class="extra secondary-text">save</i>
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

<div class="overlay blur" style="z-index: 1000000;"></div>
<dialog id="delete-trip-confirm-sm" style="z-index: 1000001;">
	<h3>Delete trip {tripName}?</h3>
	<p class="italic">Are you sure you want to delete trip <b>{tripName}</b>? This action cannot be taken back! All data belonging to this trip will be <b>permanently deleted</b>!</p>
	<div class="space"></div>
	<nav class="right-align no-space">
		<button class="transparent link" data-ui="#delete-trip-confirm-sm">Cancel</button>
		<button class="round error" data-ui="#delete-trip-confirm-sm" on:click={deleteFunction}>Delete permanently</button>
	</nav>
</dialog>
