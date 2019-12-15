const chalk = require('chalk')
const download = require('download-git-repo')
const fs = require('fs')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const ora = require('ora')
const symbols = require('log-symbols')

const spinner = ora('Create Program...')

async function init(name) {
    if (!fs.existsSync(name)) {
        inquirer.prompt([
            {
                name: 'description',
                message: 'please enter program description:',
            },
            {
                name: 'author',
                message: 'please enter program author:',
            },
            {
                name: 'appid',
                message: 'please enter program appid:'
            }
        ]).then((answers) => {
            console.log(answers)
            spinner.start()
            const downloadPath = 'AWhiteMouse/WxCool'
            download(
                downloadPath,
                name,
                { clone: true },
                (err) => {
                    if (err) {
                        spinner.fail()
                        console.error(
                            symbols.error,
                            chalk.red(`${err}create project fail,please check your network connection and try again`)
                        )
                        process.exit(1)
                    }
                    const packageJson = {
                        name,
                        description: answers.description,
                        author: answers.author,
                    }
                    const packageFile = `${name}/package.json`
                    const packageContent = fs.readFileSync(packageFile).toString()
                    const packageResult = handlebars.compile(packageContent)(packageJson)
                    fs.writeFileSync(packageFile, packageResult)
                    const projectJson = {
                        projectname: name,
                        description: answers.description,
                        appid: answers.appid,
                    }
                    const projectFile = `${name}/src/project.config.json`
                    const projectContent = fs.readFileSync(projectFile).toString()
                    const projectResult = handlebars.compile(projectContent)(projectJson)
                    fs.writeFileSync(projectFile, projectResult)
                    const appJson = {
                        "window.navigationBarTitleText": name,
                    }
                    const appFile = `${name}/src/app.json`
                    const appContent = fs.readFileSync(appFile).toString()
                    const appResult = handlebars.compile(appContent)(appJson)
                    fs.writeFileSync(appFile, appResult)
                    spinner.succeed()
                    console.log(
                        symbols.success,
                        chalk.green('Success!')
                    )
                    console.log()
                    console.log('========================')
                    console.log()
                    console.log(`      $ cd ${name}      `)
                    console.log('      $ npm i           ')
                    console.log('      $ npm run dev     ')
                    console.log()
                    console.log('========================')
                    console.log()
                })
        })
    } else {
        // 错误提示项目已存在，避免覆盖原有项目
        console.error(symbols.error, chalk.red('Project Had Exist!'))
    }
}

module.exports = (...args) => {
    return init(...args).catch(err => {
        spinner.stop()
        if (err instanceof Error) {
            console.error(msg.stack)
        }
    })
}