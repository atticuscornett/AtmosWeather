import '@capacitor/core';
//import { Device } from '@capacitor/device';
// import { Geolocation } from '@capacitor/geolocation';
//import { polygon, simplify, area} from '@turf/turf';
import {Capacitor, registerPlugin} from "@capacitor/core";
import { App } from '@capacitor/app';

let lastBackup = 5;

export async function getDevice(){
	window.deviceInfo = {};
	window.deviceInfo.platform = Capacitor.getPlatform();
}

export function getPlugin(plugin){
	return registerPlugin(plugin);
}

let storePlugin = registerPlugin("NativeStores")

export async function syncPreferences(){
	storePlugin.setItem({"key": "settings", "value": localStorage.getItem("atmos-settings")});
	storePlugin.setItem({"key": "locations", "value": localStorage.getItem("weather-locations")});
	storePlugin.setItem({"key": "location-names", "value": localStorage.getItem("weather-location-names")});
	storePlugin.setItem({"key": "location-cache", "value": localStorage.getItem("nws-location-cache")});

	// Only backup full localStorage every 5 syncs (for performance reasons)
	// This backup is in preparation for future Capacitor major version updates, which may clear localStorage
	if (lastBackup < 5){
		lastBackup++;
		return;
	}

	storePlugin.setItem({"key": "localStorageBackup", "value": JSON.stringify(localStorage)});
	lastBackup = 0;

}

export async function addBackButtonListener(callback){
	App.addListener('backButton', (data) => {
		callback(data);
	});
}