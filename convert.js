const fs = require('fs');
const glob = require('glob');
const path = require('path');
const babel = require('@babel/core');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  const isTsx = file.endsWith('.tsx');
  const ext = isTsx ? '.jsx' : '.js';
  const newFile = file.replace(/\.tsx?$/, ext);
  
  console.log(`Converting ${file} -> ${newFile}`);
  
  const code = fs.readFileSync(file, 'utf-8');
  
  const result = babel.transformSync(code, {
    filename: file,
    presets: [
      ['@babel/preset-typescript', { isTSX: isTsx, allExtensions: true }]
    ],
    retainLines: true,
  });
  
  fs.writeFileSync(newFile, result.code);
  fs.unlinkSync(file);
});

console.log('Conversion complete.');
