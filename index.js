#!/usr/bin/env node
const readline = require('readline');
const shell = require('shelljs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dirs = shell.find('.').filter(function(file) {
  const count = file
    .split('/')
    .reduce((acc, cur) => cur === 'node_modules' ? acc + 1 : acc + 0, 0);
  return file.match(/node_modules$/) && count === 1;
});

for (const dir of dirs) {
  rl.question(`remove ${dir} (y/n) ? `, (answer) => {
    if (answer === 'y') {
      shell.rm('-rf', dir);
    }
    rl.close();
  });
}
