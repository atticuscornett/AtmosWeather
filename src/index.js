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

export async function configPreferences(){
    await Preferences.configure({
        group: "NativeStorage"
    })
}

export async function syncPreferences(){
    await Preferences.set({key:"Cheese", value: "burger"})
    await Preferences.set({key:"settings", value:JSON.parse(localStorage.getItem("atmos-settings"))});
    await Preferences.set({key:"location-names", value:JSON.parse(localStorage.getItem("weather-location-names"))});
    await Preferences.set({key:"location-cache", value:JSON.parse(localStorage.getItem("nws-location-cache"))});
    await Preferences.set({key:"old-alerts", value:JSON.parse(localStorage.getItem("nws-alerts-old"))});
    await Preferences.set({key:"nws-alerts-cache", value:JSON.parse(localStorage.getItem("nws-alerts-cache"))});
    await Preferences.set({key:"nominatim-storage", value:JSON.parse(localStorage.getItem("nominatim-storage"))});
    await Preferences.set({key:"nws-alerts-current", value:JSON.parse(localStorage.getItem("nws-alerts-current"))});
    await Preferences.set({key:"nws-hourly-forecast-cache", value:JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"))});
    await Preferences.set({key:"nws-forecast-cache", value:JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"))});
    await Preferences.set({key:"nws-boundaries-cache", value:JSON.parse(localStorage.getItem("nws-hourly-forecast-cache"))});
    await Preferences.set({key:"notice-weatherAlerts", value:JSON.parse(localStorage.getItem("notice-weatherAlerts"))});
    await Preferences.set({key:"locations", value:JSON.parse(localStorage.getItem("weather-locations"))});
	
}