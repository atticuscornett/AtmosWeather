// Mostly unneeded, will most likely be removed soon


// Initialize Locations
if (!localStorage.getItem("weather-locations")){
	localStorage.setItem("weather-locations", "[]");
	localStorage.setItem("weather-location-names", "[]")
}

function storeKey(key, data){
		localStorage.setItem(key, data);
}
	
function retrieveKey(key){
	return localStorage.getItem(key);
}
	
function deleteKey(key){
	localStorage.getItem(key);
}

function clearAllKeys(){
	localStorage.clear();
}