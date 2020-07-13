import fs = require('fs');
import path = require('path');
import _ = require('lodash');

import FileInfo from './FileInfo';

export function getUniqueFiles(files: FileInfo[]) {
    let uniqueFiles: FileInfo[] = [];
    _.each(files, (f) => {
        if (!_.some(uniqueFiles, (x) => x.filesAreSame(f))) {
            uniqueFiles.push(f);
        }
    });
    return uniqueFiles;
}

export function copyFile(filePath: string, outputPath: string) {
    const outDirPath = path.dirname(outputPath);

    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath);
    }

    fs.copyFileSync(filePath, outputPath);
}
