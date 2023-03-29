import '@capacitor/core';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

export async function getDevice(){
    window.deviceInfo = await Device.getInfo();

}

export async function getLocation(){
    let currentLoc = await Geolocation.getCurrentPosition();
    window.currentLat = currentLoc.coords.latitude;
    window.currentLong = currentLoc.coords.longitude;
}

export async function syncPreferences(){
    NativeStorage.setItem("settings", JSON.parse(localStorage.getItem("atmos-settings")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("locations", JSON.parse(localStorage.getItem("weather-locations")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("location-names", JSON.parse(localStorage.getItem("weather-location-names")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("location-cache", JSON.parse(localStorage.getItem("nws-location-cache")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("old-alerts", JSON.parse(localStorage.getItem("nws-alerts-old")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nws-alerts-cache", JSON.parse(localStorage.getItem("nws-alerts-cache")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nominatim-storage", JSON.parse(localStorage.getItem("nominatim-storage")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nws-alerts-current", JSON.parse(localStorage.getItem("nws-alerts-current")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nws-hourly-forecast-cache", JSON.parse(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nws-forecast-cache", JSON.parse(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("nws-boundaries-cache", JSON.parse(localStorage.getItem("nws-hourly-forecast-cache")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});
	NativeStorage.setItem("notice-weatherAlerts", JSON.parse(localStorage.getItem("notice-weatherAlerts")), function(obj){}, function(obj){console.log(error.exception);console.log(error.code);});

	
}