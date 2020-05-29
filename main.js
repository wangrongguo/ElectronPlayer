// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const dialog = require('electron').dialog
const path = require('path')
let mainWindow;
function createWindow() {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.once('ready-to-show',function(){
    mainWindow.show();
    mainWindow.webContents.send('max','max');
  })
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  // if (process.platform === 'darwin'){
  //   //mac监听全屏
  //   mainWindow.on('enter-full-screen', function () {
  //     console.log("enter");
  //     mainWindow.webContents.send('max','max')
  //   });
    
  //   mainWindow.on('leave-full-screen', function () {
  //     console.log("leave");
  //     mainWindow.webContents.send('max','max')
  //   });
  // }else{
  //   //监听最大化最小化并发送消息win
  //   mainWindow.on('maximize', () => {
  //     console.log("-----maximize---------")
  //     mainWindow.webContents.send('max','max')
  //   })
  //   mainWindow.on('unmaximize', () => {
  //     console.log("-----unmaximize---------")
  //     mainWindow.webContents.send('max','max')
  //   })
  // }
  //监听当前屏幕大小
  mainWindow.on('resize',() => {
    console.log(mainWindow.getContentBounds())
    mainWindow.webContents.send('max',mainWindow.getContentBounds())
  })

  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu) // 设置菜单部分
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/**
 * 注册键盘快捷键
 * 其中：label: '切换开发者工具',这个可以在发布时注释掉
 */
let template = [
  {
    label: 'File（选择文件）',
    submenu: [{
      label: 'File（选择文件）',
      accelerator: 'CmdOrCtrl+Q',
      click: function (item, f) {
        var option = {};
        option.title = "打开";
        dialog.showOpenDialog(option).then(result => { 
          console.log(result.filePaths)
          mainWindow.webContents.send('data',{name:'filepath',path:result.filePaths})
        })
      }
    }, {
      label: 'Copy ( 复制 )',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste ( 粘贴 )',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }]
  },
  {
    label: 'Window ( 窗口 )',
    role: 'window',
    submenu: [{
      label: 'Minimize ( 最小化 )',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    }, {
      label: 'Close ( 关闭 )',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    }, {
      type: 'separator'
    }]
  },
  {
    label: 'Help ( 帮助 ) ',
    role: 'help',
    submenu: [{
      label: 'FeedBack ( 意见反馈 )',
      click: function () {
        electron.shell.openExternal('https://forum.iptchain.net')
      }
    }]
  }
]

