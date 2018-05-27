require('babel-polyfill')
require('babel-register')

const { network } = require('../config.json')

const scriptFilePath = process.argv[2]

const { spawn } = require('child_process')
const child = spawn('truffle', ['exec', scriptFilePath, '--network', network])

const outFn = chunk => process.stdout.write(chunk)

child.stdout.setEncoding('utf8').on('data', outFn)
child.stderr.setEncoding('utf8').on('data', outFn)
