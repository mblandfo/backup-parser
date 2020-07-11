import fs = require("fs");
import path = require("path");
import _ = require("lodash");

import FileInfo from "./FileInfo";

export function getUniqueFiles(files: FileInfo[]) {
    let uniqueFiles: FileInfo[] = [];
    _.each(files, (f) => {
        if (!_.some(uniqueFiles, (x) => x.filesAreSame(f))) {
            uniqueFiles.push(f);
        }
    });
    return uniqueFiles;
}

export function writeFile(filePath: string, contents: Buffer) {
    const outDirPath = path.dirname(filePath);

    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath);
    }

    fs.writeFileSync(filePath, contents);
}
