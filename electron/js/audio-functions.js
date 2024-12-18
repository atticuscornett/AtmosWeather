function playAlarmSoundMain(){
    var audio = new Audio('audio/' + document.getElementById("setting-default-sound-alert").value + 'alarm.mp3');
    audio.play();
}
function playNotificationSoundMain(){
    var audio = new Audio('audio/' + document.getElementById("setting-default-sound-notification").value + 'notification.mp3');
    audio.play();
}
function playAlarmSoundLocation(){
    var audio = new Audio('audio/' + document.getElementById("setting-default-sound-alert-location").value + 'alarm.mp3');
    audio.play();
}
function playNotificationSoundLocation(){
    var audio = new Audio('audio/' + document.getElementById("setting-default-sound-notification-location").value + 'notification.mp3');
    audio.play();
}
function sayTTS(text){
    let msg = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(msg);
}