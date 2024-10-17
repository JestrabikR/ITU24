<script>
  import { page } from "$app/stores";
  import Navbar from "@components/Navbar.svelte";
</script>

<main class="responsive">
	<Navbar error=true/>
	<row class="center-align">
		<h1>{$page.status}: {$page.error.message}</h1>
	</row>
</main>
