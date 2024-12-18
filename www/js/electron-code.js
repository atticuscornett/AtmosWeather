let allAudio = [];

function stopAllAudio(){
	let a = 0;
	while (a < allAudio.length){
		allAudio[a].pause();
		a++;
	}
	allAudio = [];
}