<!--

Author: Ondřej Hruboš (xhrubo01)
File: EditBar.svelte

-->

<script>
	import { page } from "$app/stores";
	import { goto } from "$app/navigation"; 
	import { setFlashMessage } from "../stores/flashStore";

	export let currentlyEditing = false;
	export let editFunction = () => {};
	export let saveFunction = () => {};
	export let deleteFunction = () => {};
	export let tripName = "";

	export let error = false;
	let current = $page.url.pathname;

	async function saveAndGoBack(){
		setFlashMessage("Trip saved", "success");
		saveFunction();

		await goto("/");
	}
</script>

<nav class="l m fixed right top-padding">
	<div class="center middle left-margin">
	<div class="space"></div>
	{#if !error}
		<button class="border square round extra bottom-margin" on:click={() => {ui("#delete-trip-confirm")}}>
			<i class="extra error-text">delete</i>
		</button>
		<button class="border square round extra bottom-margin" on:click={saveAndGoBack}>
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

<div class="overlay blur" style="z-index: 1000000;"></div>
<dialog id="delete-trip-confirm" style="z-index: 1000001;">
	<h3>Delete trip {tripName}?</h3>
	<p class="italic">Are you sure you want to delete trip <b>{tripName}</b>? This action cannot be taken back! All data belonging to this trip will be <b>permanently deleted</b>!</p>
	<div class="space"></div>
	<nav class="right-align no-space">
		<button class="transparent link" data-ui="#delete-trip-confirm">Cancel</button>
		<button class="round error" data-ui="#delete-trip-confirm" on:click={deleteFunction}>Delete permanently</button>
	</nav>
</dialog>


