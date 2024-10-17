<script>
import Navbar from "@components/Navbar.svelte";
import EditButton from "@components/EditButton.svelte";
import { page } from "$app/stores";

const tripId = $page.params.tripId;

/** @type {import('./$types').PageData} */
export let data;

function completedCheckboxToggle(){
	document.getElementById("completed").innerHTML = document.getElementById("completed").innerHTML == "check" ? "close" : "check";
}

</script>

<main class="responsive">
	<Navbar view=true/>

	<row class="center-align">
		<h2><b>{data.trip.name}</b></h2>
	</row>

	<row class="center-align">
		<h6>{
			new Date(data.trip.from_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
			}
			-
			{
			new Date(data.trip.until_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
			}
			<EditButton/>
		</h6>
	</row>

	<row class="center-align">
		<h6>
			<b>$</b>{data.trip.budget}
			<EditButton/>
			<button class="circle small primary" on:click={() => completedCheckboxToggle()}>
				<i class="small" id="completed">check</i>
			</button>
			Completed
		</h6>
	</row>

</main>
