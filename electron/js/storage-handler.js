/*
	storage-handler.js
	Handles the creation of files on native devices and the saving of settings for native code to access
	Code is mostly from the cordova-plugin-file documentation on the Cordova website
*/


function writeFile(fileEntry, dataObj) {
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Write success.");
        };

        fileWriter.onerror = function (e) {
			alert("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
			var tempDict = {}
			tempDict["settings"] = localStorage.getItem("atmos-settings");
			tempDict["nws-cache"] = localStorage.getItem("nws-location-cache");
			tempDict["locations"] = localStorage.getItem("weather-locations");
            dataObj = new Blob(["WARNING - DO NOT DELETE, AS IT MAY CAUSE ATMOS WEATHER TO STOP WORKING.\n" + JSON.stringify(tempDict)], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
}

function createFile(dirEntry, fileName, isAppend) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

        writeFile(fileEntry, null, isAppend);
		

    }, function(err){alert("error create file")});

}

function saveDataToFile(){
	if (cordova.file.externalApplicationStorageDirectory == null){
		alert("it null")
	}
	window.resolveLocalFileSystemURL(cordova.file.externalApplicationStorageDirectory, function (dirEntry) {
    	console.log('file system open: ' + dirEntry.name);
    	var isAppend = false;
    	createFile(dirEntry, "atmosweather.txt", isAppend);
	}, function(err){alert("error other method")});

}