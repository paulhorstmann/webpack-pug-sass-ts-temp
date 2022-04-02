const fs = require('fs');
const path = require('path');

const getAllPugFiles = function (dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = getAllPugFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            if (file.match(/\.pug$/) && file[0] !== '_') {
                let res = path
                    .join(dirPath, '/', file)
                    .replaceAll('\\', '/')
                    .replaceAll('src/', '')
                    .replace('.pug', '');
                console.log(res);
                arrayOfFiles.push(res);
            }
        }
    });

    return arrayOfFiles;
};

console.log(getAllPugFiles('./src'));
