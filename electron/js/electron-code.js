var allAudio = [];

function stopAllAudio(){
	var a = 0;
	while (a < allAudio.length){
		allAudio[a].pause();
		a++;
	}
	allAudio = [];
}