import fs = require('fs');
import path = require('path');
import glob = require('glob');
import _ = require('lodash');

import OutputPathMapper from './OutputPathMapper';
import FileInfo from './FileInfo';
import * as Util from './Util';

const intl = new Intl.NumberFormat('en-US');

function formatNumber(num: number) {
    return intl.format(num);
}

export function parseBackups(backupsDir: string, outputDir: string) {
    const unexpectedFilesInSrcRoot = glob.sync(backupsDir + '/*', { nodir: true });
    if (unexpectedFilesInSrcRoot.length > 0) {
        throw new Error(
            'srcDir should contain only directories representing the backups to be combined'
        );
    }

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    console.log('Gathering files from: ' + backupsDir);

    const srcFiles = glob.sync(backupsDir + '/**/*', { nodir: true });
    const numSrcFiles = srcFiles.length;

    console.log('Found ' + formatNumber(numSrcFiles) + ' files.');

    const files = srcFiles.map((x) => new FileInfo(x));
    const duplicateGroups = _.groupBy(files, (x) => x.hashKey);
    const numUniqueCombos = _.keys(duplicateGroups).length;

    console.log(
        'Found ' + formatNumber(numUniqueCombos) + ' unique filename + filesize combinations.'
    );

    const outputPathMapper = new OutputPathMapper(outputDir);

    let numDestFiles = 0;

    _.each(duplicateGroups, (groupedFiles) => {
        const uniqueFiles = Util.getUniqueFiles(groupedFiles);

        _.each(uniqueFiles, (file) => {
            const outputPath = outputPathMapper.getOutputPath(file);

            Util.copyFile(file.filePath, outputPath);
            numDestFiles++;

            if (numDestFiles % 5000 === 0) {
                console.log('Progress: wrote ' + formatNumber(numDestFiles));
            }
        });

        _.each(groupedFiles, (file) => {
            file.clearContents();
        });
    });

    console.log('Wrote ' + formatNumber(numDestFiles) + ' files.');
    console.log('Done!');
}
