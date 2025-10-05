/*
	nominatim-api.js
	Handles functions related to contacting and caching nominatim objects and search results
*/

// Initialize Cache
if (!window.localStorage.getItem("nominatim-storage")){
	window.localStorage.setItem("nominatim-storage", "{}");
}

/**
 * Fetches JSON data from a given URL asynchronously.
 *
 * @param {string} urlGet - The URL to fetch data from.
 * @param {function} callback - The callback function to handle the response or error.
 */
function JSONGetAsync(urlGet, callback){
	fetch(urlGet, {
		method: 'GET', // Or 'POST', 'PUT', etc.
		headers: {
			'User-Agent': "Atmos Weather Search (https://github.com/atticuscornett/AtmosWeather/issues)",
		}
	})
		.then((response) => response.json())
		.then(callback)
		.catch((err) => callback(err));
}

/**
 * Fetches text data from a given URL asynchronously.
 *
 * @param {string} urlGet - The URL to fetch data from.
 * @param {function} callback - The callback function to handle the response.
 */
function httpGetAsync(urlGet, callback){
	fetch(urlGet)
		.then((response) => response.text())
		.then(callback);
}


/**
 * Searches for a location using the Nominatim API and caches the result.
 *
 * @param {string} query - The search query for the location.
 * @param {function} nomCallback - The callback function to handle the response.
 */
function nomSearch(query, nomCallback){
	// Format query to standard
	query = query.replace(/,/g, " ")
	query = query.replace(/ {2}/g, " ");
	query = query.replace(/ {2}/g, " ");
	query = query.toLowerCase();
	let theCache = JSON.parse(window.localStorage.getItem("nominatim-storage"));

	// Check if query is in cache
	if (theCache.hasOwnProperty(query)){
		nomCallback(theCache[query]);
	}
	else{
		addLoadingKey("nominatim" + query);
		JSONGetAsync('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + "&format=json",
		(res) => {
			removeLoadingKey("nominatim" + query);
			theCache[query] = res;
			window.localStorage.setItem("nominatim-storage", JSON.stringify(theCache));
			nomCallback(res);
		});
	}
}

/**
 * Converts a list of Nominatim items to a list of city names.
 *
 * @param {Array} items - The list of Nominatim items.
 * @returns {Array} - The list of city names.
 */
function nomItemsToNames(items){
	let a = 0;
	let nameList = [];
	let temp;
	while (a < items.length){
		temp = items[a]["display_name"];
		temp = temp.split(", ");
		temp = temp[0] + ", " + temp[1] + ", " + temp[2];
		temp = temp.replaceAll("undefined, ", "");
		temp = temp.replaceAll(", undefined", "");
		nameList.push(temp)
		a++;
	}
	return nameList;
}