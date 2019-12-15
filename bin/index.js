#!/usr/bin/env node

const chalk = require('chalk')
const download = require('download-git-repo')
const fs = require('fs')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const ora = require('ora')
const program = require('commander')
const symbols = require('log-symbols')

program
    .option('-i --init', 'init object')
    .version(require('../package').version, '-v, --version')
    .command('init <name>')
    .alias('i')
    .description('install mini program——WxCool')
    .action((name) => {
        require("../lib/init")(name)
    }).on('--help', () => {
        console.log()
        console.log('Examples:')
        console.log('  $ wxcool init <app-name>')
        console.log('  $ wxcool i <app-name>')
        console.log()
    })

program.parse(process.argv)