const fs = require('fs');
const detective = require('../');

const code = fs.readFileSync('./test.example.js', 'utf-8');
const deps = detective(code);
console.log(deps);
