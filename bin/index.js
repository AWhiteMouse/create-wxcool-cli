#!/usr/bin/env node

const chalk = require('chalk')
const download = require('download-git-repo')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const program = require('commander')
const inquirer = require('inquirer')
const symbols = require('log-symbols')

program
    .version(require('../package').version, '-v, --version')
    .command('init <name>')
    .action(name => {
        if (!fs.existsSync(name)) {
            inquirer.prompt([
                {
                    name: "description",
                    message: 'Please enter description '
                },
                {
                    name: 'author',
                    message: 'Please enter author'
                }
            ]).then(answers => {
                console.log(answers)
                const spinner = ora('Init project...')
                spinner.start()
                const downloadPath = 'direct:https://github.com/AWhiteMouse/WxCool.git'
                download(
                    downloadPath,
                    name,
                    { clone: true },
                    function (err) {
                        if (err) {
                            spinner.fail()
                            console.error(
                                symbols.error,
                                chalk.red(`${err}download template fail,please check your network connection and try again`)
                            )
                            process.exit(1)
                        }
                        spinner.succeed()
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        const fileName = `${name}/package.json`
                        const content = fs.readFileSync(fileName).toString()
                        const result = handlebars.compile(content)(meta)
                        fs.writeFileSync(fileName, result)
                    })
            })
        } else {
            console.error(symbols.error, chalk.red('project had exist'))
        }
    })
    .on('--help', function(){
        console.log('')
        console.log('Examples:');
        console.log('  $ create-wxcool-program i demo');
        console.log('');
    })
    .parse(process.argv)