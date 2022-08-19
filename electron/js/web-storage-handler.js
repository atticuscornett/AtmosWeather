// Mostly unneeded, will most likely be removed soon



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