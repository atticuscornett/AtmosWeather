<script>

    let showPopup = $state(false);
    let permissions = $state(
        {
            "hasBackgroundLocationPermission": false,
            "hasNotificationPermission": false,
            "hasBatteryExemptPermission": false,
            "hasExactAlarmsPermission": false
        }
    )

    let refreshPermissions = async () => {
        if (!showPopup || window.platform !== "android"){
            return;
        }
        permissions = await PermissionManagement.checkPermissions();
        setTimeout(refreshPermissions, 200);
    }

    window.showPermissionDialog = () => {
        showPopup = true;
        refreshPermissions();
    }

    let hidePopup = () => {
        showPopup = false;
        showNotices();
    }

    let requestBackgroundLocation = () => {
        PermissionManagement.requestPermission({"permission":"background-location"});
    }

    let requestNotificationPermission = () => {
        PermissionManagement.requestPermission({"permission":"notifications"});
    }

    let requestBatteryExemption = () => {
        PermissionManagement.requestPermission({"permission":"battery-exempt"});
    }

    let requestExactAlarms = () => {
        PermissionManagement.requestPermission({"permission":"exact-alarms"});
    }
</script>

{#if showPopup}
    <div id="android-permission-setup">
        <div id="android-permission-container">
        <h1>Android Permission Setup</h1>
            <h3>Atmos Weather requires Android permissions to provide certain app functionality.</h3>
            <h3>Review the permissions below and grant permissions to enable certain features.</h3>
            <h3>This dialog can be opened any time from the settings page.</h3>
            <details>
            <summary id="android-background-permissions">Background Location {permissions["hasBackgroundLocationPermission"] ? "✅" : "⚠️"}</summary>
                <h4>Atmos Weather uses background location permission to provide weather alert notifications for your current location.</h4>
                <h4>Without this permission, Atmos Weather will be unable to give alerts for the current location or alerts if moving.</h4>
                <button class="permission-button" disabled={permissions["hasBackgroundLocationPermission"]} onclick={requestBackgroundLocation}>
                    {permissions["hasBackgroundLocationPermission"] ? "Background Location Granted" : "Request Background Location"}
                </button>
            </details>
            <details>
                <summary id="android-notification-permissions">Notifications {permissions["hasNotificationPermission"] ? "✅" : "⚠️"}</summary>
                <h4>Atmos Weather uses the notification permission to deliver weather alerts.</h4>
                <h4>Without this permission, Atmos Weather cannot give weather alerts.</h4>
                <button class="permission-button" disabled={permissions["hasNotificationPermission"]} onclick={requestNotificationPermission}>
                    {permissions["hasNotificationPermission"] ? "Notifications Granted" : "Request Notifications"}
                </button>
            </details>
            <details>
                <summary id="android-battery-exempt-permissions">Battery Exemption {permissions["hasBatteryOptimizationExemption"] ? "✅" : "⚠️"}</summary>
                <h4>Atmos Weather uses a battery optimization exemption to run in the background even when the device is asleep.</h4>
                <h4>Without this permission, Atmos Weather may stop running when your device falls asleep.</h4>
                <button class="permission-button" disabled={permissions["hasBatteryOptimizationExemption"]} onclick={requestBatteryExemption}>
                    {permissions["hasBatteryOptimizationExemption"] ? "Battery Exemptions Granted" : "Request Battery Exemptions"}
                </button>
            </details>
            <details>
                <summary id="android-exact-alarms-permissions">Schedule Exact Alarms {permissions["canScheduleExactAlarms"] ? "✅" : "⚠️"}</summary>
                <h4>Atmos Weather uses the schedule exact alarm permission to run periodic weather checks in the background in a timely manner.</h4>
                <h4>Without this permission, Atmos Weather cannot reliably give timely alerts.</h4>
                <button class="permission-button" disabled={permissions["canScheduleExactAlarms"]} onclick={requestExactAlarms}>
                    {permissions["canScheduleExactAlarms"] ? "Exact Alarms Granted": "Request Exact Alarms"}
                </button>
            </details>
            <button class="permission-button" onclick={hidePopup}>Done</button>
        </div>
    </div>
{/if}

<style>
    #android-permission-setup{
        z-index: 99;
        position: absolute;
        background-color: hsla(0,0%,99%,1.00);
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        padding: 0;
    }

    #android-permission-container {
        padding: 15px;
        background-color: hsla(0,0%,99%,1.00);
        text-align: center;
    }

    .permission-button {
        padding-left: 15px;
        padding-right: 15px;
        border: none;
        background-color: rgba(34,55,91,0.88);
        color: white;
        font-family: Secular One, sans-serif;
        font-size: 25px;
        border-radius: 7px;
        cursor: pointer;
    }

    .permission-button:disabled {
        background-color: grey;
    }

    :global(body.dark) #android-permission-setup {
        background-color: #222222;
    }

    :global(body.dark) #android-permission-container {
        background-color: #222222;
    }
</style>