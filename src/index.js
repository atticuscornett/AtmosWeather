import '@capacitor/core';
//import { Device } from '@capacitor/device';
// import { Geolocation } from '@capacitor/geolocation';
//import { polygon, simplify, area} from '@turf/turf';
import {Capacitor, registerPlugin} from "@capacitor/core";

let lastBackup = 5;

export async function getDevice(){
	window.deviceInfo = {};
	window.deviceInfo.platform = Capacitor.getPlatform();
}

export function getPlugin(plugin){
	return registerPlugin(plugin);
}

// export async function getLocation(){
//     let currentLoc = await Geolocation.getCurrentPosition();
//     window.currentLat = currentLoc.coords.latitude;
//     window.currentLong = currentLoc.coords.longitude;
// }

export async function syncPreferences(){
    NativeStorage.setItem("settings", JSON.stringify(localStorage.getItem("atmos-settings")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("locations", JSON.stringify(localStorage.getItem("weather-locations")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("location-names", JSON.stringify(localStorage.getItem("weather-location-names")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("location-cache", JSON.stringify(localStorage.getItem("nws-location-cache")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("old-alerts", JSON.stringify(localStorage.getItem("nws-alerts-old")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nws-alerts-cache", JSON.stringify(localStorage.getItem("nws-alerts-cache")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nominatim-storage", JSON.stringify(localStorage.getItem("nominatim-storage")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nws-alerts-current", JSON.stringify(localStorage.getItem("nws-alerts-current")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nws-hourly-forecast-cache", JSON.stringify(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nws-forecast-cache", JSON.stringify(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("nws-boundaries-cache", JSON.stringify(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	//NativeStorage.setItem("notice-weatherAlerts", JSON.stringify(localStorage.getItem("notice-weatherAlerts")), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});

	// Only backup full localStorage every 5 syncs (for performance reasons)
	// This backup is in preparation for future Capacitor major version updates, which may clear localStorage
	if (lastBackup < 5){
		lastBackup++;
		return;
	}
	NativeStorage.setItem("localStorageBackup", JSON.stringify(localStorage), function(obj){}, function(error){console.log(error.exception);console.log(error.code);});
	lastBackup = 0;
}

// export function simplifyToFourPoints(originalPolygon){
// 	const simplifiedPolygon = simplify(originalPolygon, { tolerance: 0.01, highQuality: true });
// 	const simplifiedCoords = simplifiedPolygon.geometry.type === 'Polygon' ? simplifiedPolygon.geometry.coordinates[0] : simplifiedPolygon.coordinates[0];
// 	simplifiedCoords.push(simplifiedCoords[0]);
// 	// Find the four most extreme points of the simplified polygon
// 	let north, east, south, west;
// 	simplifiedCoords.forEach(coord => {
// 	if (!north || coord[1] > north[1]) north = coord;
// 	if (!east || coord[0] > east[0]) east = coord;
// 	if (!south || coord[1] < south[1]) south = coord;
// 	if (!west || coord[0] < west[0]) west = coord;
// 	});
// 	const simplifiedFourCoords = [north, east, south, west, north];
// 	const simplifiedFourPolygon = polygon([simplifiedFourCoords]);
// 	originalPolygon["geometry"] = simplifiedFourPolygon["geometry"];
// 	return originalPolygon;
// }
//
// export function simplifyToFourPointsMethodTwo(originalPolygon){
// 	if (originalPolygon["geometry"]["coordinates"][0].length <= 5){
// 		return originalPolygon;
// 	}
// 	else{
// 		let workingPolygon = originalPolygon;
// 		let polygonCoords = workingPolygon["geometry"]["coordinates"][0];
// 		let biggest = 0;
// 		let biggestIndex = 0;
// 		for (let i = 1;i < polygonCoords.length-1;i++){
// 			workingPolygon = JSON.parse(JSON.stringify(originalPolygon));
// 			workingPolygon["geometry"]["coordinates"][0].splice(i, 1);
// 			let polyArea = area(workingPolygon);
// 			if (polyArea > biggest){
// 				biggest = polyArea;
// 				biggestIndex = i;
// 			}
// 		}
// 		workingPolygon = JSON.parse(JSON.stringify(originalPolygon));
// 		workingPolygon["geometry"]["coordinates"][0].splice(biggestIndex, 1);
// 		return simplifyToFourPointsMethodTwo(workingPolygon);
// 	}
// }
//
// function dist(x1, y1, x2, y2){
// 	return ((x2-x1)**2 + (y2-y1)**2)**0.5;
// }
//
// export function decideCoordOrder(coordsInput){
// 	let coords = coordsInput;
// 	// for (var i=0;i < coords.length-1; i++){
// 	// 	coords[i].reverse();
// 	// }
// 	const sideDists = [dist(coords[0][0], coords[0][1], coords[1][0], coords[1][1]), dist(coords[2][0], coords[2][1], coords[3][0], coords[3][1]), dist(coords[1][0], coords[1][1], coords[2][0], coords[2][1]), dist(coords[3][0], coords[3][1], coords[0][0], coords[0][1])];
// 	var larger1 = 0;
//     var smaller1 = 0;
//     var larger2 = 0;
//     var smaller2 = 0;
//     if (sideDists[0] > sideDists[1]){
//         larger1 = sideDists[0];
//         smaller1 = sideDists[1];
//     }
//     else{
//         larger1 = sideDists[1];
//         smaller1 = sideDists[0];
//     }
//     if (sideDists[2] > sideDists[3]){
//         larger2 = sideDists[2];
//         smaller2 = sideDists[3];
//     }
//     else{
//         larger2 = sideDists[3];
//         smaller2 = sideDists[2];
//     }
//     let sides01_23 = larger1/smaller1;
//     let sides12_30 = larger2/smaller2;
//     if (sides01_23 > sides12_30){
//         if (Math.abs(sideDists[0]) < Math.abs(sideDists[1])){
//             return [[coords[1], coords[2]], [coords[0], coords[3]]];
//         }
//         else{
//             return [[coords[2], coords[1]], [coords[3], coords[0]]];
//         }
//     }
//     else{
//         if (Math.abs(sideDists[2]) > Math.abs(sideDists[3])){
//             return [[coords[0], coords[1]], [coords[3], coords[2]]];
//         }
//         else{
//             return [[coords[1], coords[0]], [coords[2], coords[3]]];
//         }
//     }
// }
//
// export function amplifyCoords(input){
//     // yayyyy spagett
//     let xDist1 = input[0][1][0] - input[0][0][0];
//     let yDist1 = input[0][1][1] - input[0][0][1];
//     let coords1 = [input[0][0][0]+(xDist1*2), input[0][0][1]+(yDist1*2)];
//     let xDist2 = input[1][1][0] - input[1][0][0];
//     let yDist2 = input[1][1][1] - input[1][0][1];
//     let coords2 = [input[1][0][0]+(xDist2*2), input[1][0][1]+(yDist2*2)];
//     return [[[input[0][0][0], input[0][0][1]], coords1], [[input[1][0][0], input[1][0][1]], coords2]];
// }
//
// export function putAmplifiedCoords(amplified, originalPolygon){
// 	let amp = [[amplified[0][0][0], amplified[0][0][1]], [amplified[0][1][0], amplified[0][1][1]], [amplified[1][1][0], amplified[1][1][1]], [amplified[1][0][0], amplified[1][0][1]], [amplified[0][0][0], amplified[0][0][1]]]
// 	// for (var i=0;i < amp.length; i++){
// 	// 	amp[i].reverse();
// 	// }
// 	originalPolygon["geometry"]["coordinates"][0] = amp;
// 	return originalPolygon;
//}