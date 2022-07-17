const electron = require('electron')
const { app, BrowserWindow, Menu } = electron;
const path = require('path');
const { checkServerIdentity } = require('tls');
const url = require('url')

console.log()

let win = null;
app.on('ready', () => {
    win = new BrowserWindow({
        width: 800, height: 600
    });
    win.loadURL(url.format({
        pathname: path.resolve(__dirname, './html/main.html'),
        protocol: 'file:',
        slashes: true
    }))

    //定义菜单
    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

// 顶部菜单模板
const menuTemplate = [
    {
        label: '文件',
        submenu: [
            { label: '新增信息' },
            { label: '清空信息' },
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