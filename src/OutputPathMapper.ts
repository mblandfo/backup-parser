import fs = require("fs");
import path = require("path");
import _ = require("lodash");

import FileInfo from "./FileInfo";

export default class OutputPathMapper {
    constructor(destDir: string) {
        let removeEndChar = destDir.endsWith("/") || destDir.endsWith("\\");
        this.destDir = removeEndChar ? destDir.substr(0, destDir.length - 1) : destDir;
    }

    public readonly destDir: string;
    private uniquePathMap: _.Dictionary<number> = {};

    getOutputPath(file: FileInfo) {
        const outDirPath = this.destDir + "/" + file.folderName + "/";
        const uniquePathMap = this.uniquePathMap;

        let outputPath = outDirPath + file.fileNameNoExtension;

        if (uniquePathMap[outputPath] !== undefined) {
            let fileNum = uniquePathMap[outputPath]++;            
            outputPath += fileNum;
        } else {
            uniquePathMap[outputPath] = 2;
        }
        outputPath += file.extension;
        return outputPath;
    }
}
