#!/usr/bin/env node
const readline = require('readline');
const shell = require('shelljs');
const ora = require('ora');

let outputText = '';
let dirs = [];
let i = 0;

const spinner = ora('searching node_modules...').start();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// TODO: how to find node_modules for Windows users?
// const node_modules = shell.find('.').filter(function (file) {
//   return file.match(/node_modules$/);
// });

const child = shell.exec('find . -name node_modules -type d', { async: true, silent: true });

child.stdout.on('data', function (data) {
  outputText += data;
});

child.stdout.on('end', function () {
  spinner.stop();
  const node_modules = outputText.split('\n');
  dirs = node_modules.filter(file => {
    const count = file
      .split('/')
      .reduce((acc, cur) => cur === 'node_modules' ? acc + 1 : acc + 0, 0);
    return file.match(/node_modules$/) && count === 1;
  });
  rl.emit('line');
});

rl.on('line', function (line) {
  if (i === dirs.length) {
    process.exit();
  }

  if (line === 'y') {
    shell.rm('-rf', dirs[i-1]);
  }

  rl.setPrompt(`remove ${dirs[i]} (y/n) ? `);
  rl.prompt();
  i += 1;
});
