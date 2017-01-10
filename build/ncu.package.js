//https://github.com/tjunnone/npm-check-updates
const ncu = require('npm-check-updates')
const fs = require('fs')

ncu.run({
    packageFile: 'package.json',
    silent: true,
    jsonUpgraded: true
        // upgrade: true,
        // upgradeAll: true
}).then((upgraded) => {
    const data = JSON.stringify(upgraded).replace(/,/g, ",\n").replace(/{/, '{\n').replace(/}/, '\n}')
    fs.writeFileSync('upgrade.js', `"UPDATE DATA: ${new Date()}" \n` + data)
});
