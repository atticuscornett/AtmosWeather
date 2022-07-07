const { app, BrowserWindow, Notification, Tray, Menu} = require('electron')
var win2 = null;
const createWindow = () => {
const win = new BrowserWindow({
    width: 800,
    height: 600,
	icon: __dirname + "/img/icon.png",
	autoHideMenuBar: true
})
win2 = win;
  win.loadFile('index.html')
}
app.whenReady().then(() => {
	if (process.platform === 'win32'){
    	app.setAppUserModelId(app.name);
	}
 	createWindow()
	let trayIcon = new Tray(__dirname + "/img/icon.png")
	trayIcon.setToolTip('Atmos Weather')
    const trayMenuTemplate = [{
               label: 'Atmos Weather',
               enabled: false
            },
			{
               label: 'About Atmos Weather',
               enabled: true
            },
			{
                label: 'Quit',
                enabled: true,
				click: () => {
        			app.quit()
      			}
            }
         ]
         
         let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
         trayIcon.setContextMenu(trayMenu)
		 trayIcon.on('click', function(e){
			if (win2 == null){
				win2 = new BrowserWindow({
    				width: 800,
					height: 600,
					icon: __dirname + "/img/icon.png",
					autoHideMenuBar: true
				});
				win2.loadFile('index.html')
				win2.hide()
			}
    		if (win2.isVisible()) {
      			win2.hide()
    		} else {
				win2.reload();
				win2.show()
    		}
  		});
		
})

app.on("window-all-closed", () => {
	win2 = null;
})

function sendNotif (theTitle, theBody) {
  new Notification({ title: theTitle, body: theBody }).show()
}