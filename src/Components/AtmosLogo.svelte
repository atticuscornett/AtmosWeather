<script>
	let logoFade = $state(false);
	window.hideLogo = () => {
		logoFade = true;
	}

	setTimeout(() =>{
		try {
			let settings = JSON.parse(localStorage.getItem("atmos-settings"));
			if (settings["personalization"]["atmos-logo"] === false){
				showNotices()
			}
			else {
				setTimeout(() => {
					showNotices();
				}, 4000);
			}
		}
		catch (e){
			setTimeout(() => {
				showNotices();
			}, 4000);
			console.error(e);
		}
	}, 100)



</script>

<div id="atmos-logo" class={logoFade ? "fade" : ""}>
    <div class="logo-container">
        <h1 class="logoLetter">a</h1>
		<h1 class="logoLetter">t</h1>
		<h1 class="logoLetter">m</h1>
		<h1 class="logoLetter">o</h1>
		<h1 class="logoLetter">s</h1>
		<h3 id="weatherLogo">weather</h3>
	</div>
</div>

<style>
    .logo-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        font-size: 30px;
    }

    #weatherLogo {
        text-align: center;
        animation: delayed-fade-in 2s;
        position: relative;
        bottom: 70px;
        font-family: Secular One, sans-serif;
		color: var(--primary-text-color);
    }

	#atmos-logo.fade {
		animation: fade-out 2s !important;
		animation-fill-mode: forwards !important;
	}

	@keyframes logo-anim{
		0%{
			font-size: 10000px;
			padding-left: 100px;
			padding-right: 100px;
			color: var(--primary-text-color);
		}
		49%{
			font-size: 30px;
			padding-left: 100px;
			padding-right: 100px;
			color: var(--primary-text-color);
		}
		50%{
			color: var(--primary-text-color);
		}
		100%{
			padding-left: 10px;
			padding-right: 10px;
			color: var(--secondary-text-color);
		}
	}

	#atmos-logo {
		z-index: 999;
		position: absolute;
		overflow: hidden;
		background-color: var(--background-start);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		animation: logoBackgroundAnim 2s;
	}

	.logoLetter{
		font-family: Secular One, sans-serif;
		display: inline;
		animation: logo-anim 2s;
		padding-left: 10px;
		padding-right: 10px;
		color: var(--secondary-text-color);
	}
</style>