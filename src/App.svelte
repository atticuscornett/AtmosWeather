<script>
	import AtmosLogo from "./Components/AtmosLogo.svelte";

    document.body.classList.add(prompt("Dark Mode?") === "true" ? "dark" : "light");
</script>

<AtmosLogo />

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
