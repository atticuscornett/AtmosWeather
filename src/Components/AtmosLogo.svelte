<script>
	window.hideLogo = () => {
		document.getElementById("atmos-logo").classList.add("fade");
	}
</script>

<div id="atmos-logo">
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
    .logo-container{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        white-space: nowrap;
        font-size: 30px;
    }

    #weatherLogo {
        text-align: center;
        animation: delayedFadeIn 2s;
        position: relative;
        bottom: 70px;
        font-family: Secular One, sans-serif;
    }

	.fade {
		animation: fadeOut 2s; animation-fill-mode: forwards;
	}

	@keyframes logoAnim{
		0%{
			font-size: 10000px;
			padding-left: 100px;
			padding-right: 100px;
			color: var(--startColor);
		}
		49%{
			font-size: 30px;
			padding-left: 100px;
			padding-right: 100px;
			color: var(--startColor);
		}
		50%{
			color: var(--startColor);
		}
		100%{
			padding-left: 10px;
			padding-right: 10px;
			color: dodgerblue;
		}
	}

	#atmos-logo{
		z-index: 999;
		position: absolute;
		overflow: hidden;
		background-color: hsla(0,0%,99%,1.00);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		animation: logoBackgroundAnim 2s;
	}

	.logoLetter{
		font-family: Secular One, sans-serif;
		display: inline;
		animation: logoAnim 2s;
		padding-left: 10px;
		padding-right: 10px;
		color: dodgerblue;
	}

	/* Dark Mode Background */
	:global(body.dark) #weatherLogo {
			color: white;
	}

	:global(body.dark) #atmos-logo{
			z-index: 999;
			position: absolute;
			overflow: hidden;
			background-color: black;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			animation: logoBackgroundAnim 2s;
	}

</style>