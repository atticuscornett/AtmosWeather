const { app, BrowserWindow, Notification} = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
	icon: __dirname + "/img/icon.png",
	autoHideMenuBar: true
  })

  win.loadFile('index.html')
}
app.whenReady().then(() => {
	if (process.platform === 'win32'){
    	app.setAppUserModelId(app.name);
	}
  createWindow()
	new Notification({ title: "test title", body: "test body" }).show()
})

function sendNotif () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}