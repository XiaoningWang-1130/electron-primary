const electron = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = electron;
const path = require('path');
const { checkServerIdentity } = require('tls');
const url = require('url')

console.log()

let win = null;
let addWin = null
app.on('ready', () => {
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadURL(url.format({
        pathname: path.resolve(__dirname, './html/main.html'),
        protocol: 'file:',
        slashes: true
    }))

    //定义菜单
    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)

    // 点击主窗口的关闭
    win.on('closed', () => {
        app.quit()
    })
})

// 顶部菜单模板
const menuTemplate = [
    {
        label: '文件',
        submenu: [
            {
                label: '新增信息',
                click: () => {
                    createAddWindow()
                }
            },
            {
                label: '清空信息',
                click: () => {
                    win.webContents.send('info:clear')
                }
            },
            {
                label: '退出',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
]

const checkEnv = () => {
    let env = process.env.NODE_ENV
    let devConfig = {
        label: '开发中工具',
        submenu: [
            {
                label: '打开/关闭',
                click: (item, focuseWindow) => {
                    focuseWindow.toggleDevTools()
                },
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I'
            },
            {
                label: '刷新一下',
                role: 'reload',
                accelerator: process.platform == 'darwin' ? 'Command+F5' : 'Ctrl+F5'
            }
        ]
    }
    if (env !== 'production') {
        menuTemplate.push(
            devConfig
        )

    }
}
checkEnv()


const createAddWindow = () => {
    addWin = new BrowserWindow({
        width: 600, height: 300, webPreferences: {
            nodeIntegration: true
        }
    });
    addWin.loadURL(url.format({
        pathname: path.resolve(__dirname, './html/add.html'),
        protocol: 'file:',
        slashes: true
    }))
}

const eventListener = () => {
    ipcMain.on('info:add', (e, val) => {
        win.webContents.send('info:add', val)
        addWin.close()
    })
}
eventListener()