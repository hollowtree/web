const fs = require('fs')
const path = require('path')

const List = []
const parent = path.join(__dirname, '..')


async function readDir(dir, aim) {
    const fullAim = path.join(dir, aim)
    if (fs.statSync(fullAim).isDirectory()) {
        const fileList = await fs.readdirSync(fullAim).sort()
        if (fileList.includes('index.html')) {
            List.push(fullAim.replace(parent, '').replace(/\\/g, '/'))
        }
        for (let i = 0, l = fileList.length; i < l; i++) {
            await readDir(fullAim, fileList[i])
        }
    }
}

!(async function () {
    await readDir(__dirname, 'javascript')
    fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(List, null, 2), 'utf-8')
})()


