<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation'; 
	
	export let currentlyEditing = false;
	export let editFunction = () => {};
	export let saveFunction = () => {};

	export let error = false;
	let current = $page.url.pathname;
</script>

<nav class="l m fixed right top-padding">
	<div class="center middle left-margin">
	<div class="space"></div>
	{#if !error}
		<button class="border square round extra bottom-margin">
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra bottom-margin" on:click={() => goto("/")}>
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
	</div>
</nav>
