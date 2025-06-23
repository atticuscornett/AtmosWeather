let releaseVersions = {};
let getLatestRelease = async () => {
    let latestRelease = await fetch("https://api.github.com/repos/atticuscornett/AtmosWeather/releases/latest");
    latestRelease = await latestRelease.json();
    let releaseAssets = latestRelease.assets;
    // Sort assets by type and architecture
    for (let i = 0; i < releaseAssets.length; i++){
        let thisAsset = releaseAssets[i];
        if (thisAsset.name.endsWith(".exe")){
            releaseVersions["win_x64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith(".apk")){
            releaseVersions["android"] = thisAsset;
        }
        else if (thisAsset.name.endsWith("arm64.dmg") || thisAsset.name.endsWith("silicon.dmg")){
            releaseVersions["mac_arm64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith(".dmg")){
            releaseVersions["mac_x64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith(".tar.gz")){
            releaseVersions["tar"] = thisAsset;
        }
        else if (thisAsset.name.endsWith("amd64.deb")){
            releaseVersions["deb_x64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith("armv7l.deb")){
            releaseVersions["deb_armv7l"] = thisAsset;
        }
        else if (thisAsset.name.endsWith("arm64.deb")){
            releaseVersions["deb_arm64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith("arm64.AppImage")){
            releaseVersions["appimage_arm64"] = thisAsset;
        }
        else if (thisAsset.name.endsWith(".AppImage")){
            releaseVersions["appimage_x64"] = thisAsset;
        }
    }

    for (let key in releaseVersions){
        let thisAsset = releaseVersions[key];
        let downloadButton = document.getElementById("download-" + key);
        downloadButton.setAttribute("href", thisAsset.browser_download_url);
    }

    document.getElementById("download-now").setAttribute("href", releaseVersions[getBestDownload()].browser_download_url);
    document.getElementById("download-automatic").setAttribute("href", releaseVersions[getBestDownload()].browser_download_url);
}
let getBestDownload = () =>{
    let nav = window.navigator.userAgent.toLocaleLowerCase();
    if (nav.includes("win")){
        return "win_x64";
    }
    else if (nav.includes("android") || navigator.platform.includes("Android")){
        return "android";
    }
    else if (nav.includes("mac") || navigator.platform.includes("Mac")){
        if (nav.includes("arm")){
            return "mac_arm64";
        }
        else{
            return "mac_x64";
        }
    }
    else{
        if (nav.includes("arm")){
            if (nav.includes("armv7l")){
                return "deb_armv7l";
            }
            else{
                return "deb_arm64";
            }
        }
        else{
            return "deb_x64";
        }
    }
}

getLatestRelease().then(r => {});