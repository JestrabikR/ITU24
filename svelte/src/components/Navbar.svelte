<script>
	import { page } from '$app/stores'; // $page
	let current = $page.url.pathname;

	import Logo from "$lib/assets/logo.svg";
</script>

<div class="space"></div>
<nav>
	<img class="circle" src={Logo} alt="Logo">
	<a href="/"><h3><b><span class:underline={current === '/' ? true : false}>Trips</span></b></h3></a>
	<a href="/visited"><h3><b><span class:underline={current === '/visited' ? true : false}>Visited</span></b></h3></a>
    <div class="max"></div>
    <button class="square round extra">
      <i>add</i>
    </button>
</nav>
<div class="space"></div>
