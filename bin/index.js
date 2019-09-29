/*
 * @Description: create-wxcool-cli
 * @Author: chenxin
 * @Date: 2019-09-29 15:42:52
 * @LastEditors: chenxin
 * @LastEditTime: 2019-09-29 17:26:36
 */
const chalk = require('chalk')
const download = require('download-git-repo')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const program = require('commander')
const requirer = require('requirer')
const symbols = require('log-symbols')

program
    .version(require('./package').version, '-v, --version')
    .command('init <name>')
    .alias('i')
    .action(name => {
        if (!fs.existsSync(name)) {
            requirer.prompt([
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