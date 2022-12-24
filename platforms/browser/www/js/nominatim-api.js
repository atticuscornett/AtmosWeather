/*
	nominatim-api.js
	Handles functions related to contacting and caching nominatim objects and search results
*/

// Initialize Cache
if (!window.localStorage.getItem("nominatim-storage")){
	window.localStorage.setItem("nominatim-storage", "{}");
}

// Get String HTTP Get
function httpGet(urlGet){
    var httpObj = new XMLHttpRequest();
    httpObj.open("GET", urlGet, false); 
    httpObj.send(null);
    return httpObj.responseText;
}

// Get String and convert to JSON http GET
function JSONGet(urlGet){
    var httpObj = new XMLHttpRequest();
    httpObj.open("GET", urlGet, false); 
    httpObj.send(null);
    return JSON.parse(httpObj.responseText);
}

// Get String and convert to JSON asynchronously
function JSONGetAsync(urlGet, callback){
	fetch(urlGet)
		.then((response) => response.json())
		.then(callback);
}

function httpGetAsync(urlGet, callback){
	fetch(urlGet)
		.then((response) => response.text())
		.then(callback);
}
// Check if location in cache and if not, check nominatim
function nomSearch(query, nomCallback){
	// Format query to standard
	query = query.replace(/,/g, " ")
	query = query.replace(/ {2}/g, " ");
	query = query.replace(/ {2}/g, " ");
	query = query.toLowerCase();
	var theCache = JSON.parse(window.localStorage.getItem("nominatim-storage"));
	
	if (theCache.hasOwnProperty(query)){
		nomCallback(theCache[query]);
	}
	else{
		JSONGetAsync('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + "&format=json",
		(res) => {
			theCache[query] = res;
			window.localStorage.setItem("nominatim-storage", JSON.stringify(theCache));
			nomCallback(res);
		});
	}
}

// Get City Names From Object List
function nomItemsToNames(items){
	var a = 0;
	var theList = [];
	var temp;
	while (a < items.length){
		temp = items[a]["display_name"];
		temp = temp.split(", ");
		temp = temp[0] + ", " + temp[1] + ", " + temp[2];
		temp = temp.replaceAll("undefined, ", "");
		temp = temp.replaceAll(", undefined", "");
		theList.push(temp)
		a++;
	}
	return theList;
}