import fs = require("fs");
import path = require("path");
import glob = require("glob");
import _ = require("lodash");

import OutputPathMapper from "./OutputPathMapper";
import FileInfo from "./FileInfo";
import * as Util from "./Util";

const srcDir = "c:/data"; // srcDir should contain only directories
const destDir = "c:/data-parsed";

const unexpectedFilesInSrcRoot = glob.sync(srcDir + "/*", { nodir: true });
if (unexpectedFilesInSrcRoot.length > 0) {
    throw new Error(
        "srcDir should contain only directories representing the backups to be combined"
    );
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir);
}

const srcFiles = glob.sync(srcDir + "/**/*", { nodir: true });
const numSrcFiles = srcFiles.length;

console.log("Found " + numSrcFiles + " files.");

const files = srcFiles.map((x) => new FileInfo(x));
const duplicateGroups = _.groupBy(files, (x) => x.hashKey);

const outputPathMapper = new OutputPathMapper(destDir);

let numDestFiles = 0;

_.each(duplicateGroups, (groupedFiles) => {
    const uniqueFiles = Util.getUniqueFiles(groupedFiles);

    _.each(uniqueFiles, (file) => {
        const outputPath = outputPathMapper.getOutputPath(file);

        numDestFiles++;
        Util.writeFile(outputPath, file.getContents());
    });

    _.each(groupedFiles, (file) => {
        file.clearContents();
    });
});

console.log("Wrote " + numDestFiles + " files.");
console.log("Done!");
