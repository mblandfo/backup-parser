import fs = require('fs');
import path = require('path');
import _ = require('lodash');

import FileInfo from './FileInfo';

export default class OutputPathMapper {
    constructor(destDir: string) {
        let removeEndChar = destDir.endsWith('/') || destDir.endsWith('\\');
        this.destDir = removeEndChar ? destDir.substr(0, destDir.length - 1) : destDir;
    }

    public readonly destDir: string;
    private uniquePathMap: _.Dictionary<number> = {};

    getOutputPath(file: FileInfo) {
        const outDirPath = this.destDir + '/' + file.folderName + '/';
        const uniquePathMap = this.uniquePathMap;

        let outputPath = outDirPath + file.fileNameNoExtension;
        const extension = file.extension;
        const outputPathKey = outputPath.toLowerCase() + extension.toLowerCase();

        if (uniquePathMap[outputPathKey] !== undefined) {
            let fileNum = uniquePathMap[outputPathKey]++;
            outputPath += fileNum;
        } else {
            uniquePathMap[outputPathKey] = 2;
        }
        outputPath += extension;
        return outputPath;
    }
}
