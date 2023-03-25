import '@capacitor/core';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';

export async function getDevice(){
    window.deviceInfo = await Device.getInfo();

}

export async function getLocation(){
    let currentLoc = await Geolocation.getCurrentPosition();
    window.currentLat = currentLoc.coords.latitude;
    window.currentLong = currentLoc.coords.longitude;
}