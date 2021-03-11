
const replace = require('replace');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('utils/sweetDark/**/*')
files.forEach(f => {
  fs.copyFileSync(f, `node_modules/sweetalert2/dist/${  path.basename(f)}`)
})

replace({
  regex:
    'import { ReactNativeDriver } from "./react-native/ReactNativeDriver";',
  replacement: '',
  paths: ['node_modules/typeorm/browser/driver/DriverFactory.js'],
});
replace({
  regex: 'case "react-native":',
  replacement: '',
  paths: ['node_modules/typeorm/browser/driver/DriverFactory.js'],
});
replace({
  regex: 'return new ReactNativeDriver\\(connection\\);',
  replacement: '',
  paths: ['node_modules/typeorm/browser/driver/DriverFactory.js'],
});