import * as Util from '../src/Util';
import _ = require("lodash");
import tmp = require('tmp');
import path = require("path");
import fs = require("fs");
import FileInfo from '../src/FileInfo';

interface TmpFile {
    relativePath: string;
    contents: string | Buffer;
}

interface TmpFileResolved extends TmpFile {
    fullPath: string;
}

function getUniqueFiles(tmpFiles: TmpFile[]) {
    const tmpDir = tmp.dirSync();
    const tmpDirPath = tmpDir.name;
    
    const resolvedTmpFiles: TmpFileResolved[] = tmpFiles.map(tmpFile => {
        const fullPath = path.join(tmpDirPath, tmpFile.relativePath);
        return _.assign({}, tmpFile, { fullPath });
    });

    resolvedTmpFiles.forEach(tmpFile => {  
        const folderPath = path.dirname(tmpFile.fullPath);      
        if (!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath, { recursive: true });
        }
        if (_.isString(tmpFile.contents)){
            fs.writeFileSync(tmpFile.fullPath, tmpFile.contents, 'utf-8')
        } else {
            fs.writeFileSync(tmpFile.fullPath, tmpFile.contents);
        }
    });

    const files = resolvedTmpFiles.map(tmpFile => new FileInfo(tmpFile.fullPath));

    const uniqueFiles = Util.getUniqueFiles(files);
    const uniquePaths = uniqueFiles.map(x => x.filePath);
    const uniqueRelPaths = uniquePaths.map(x => 
        x.replace(tmpDirPath, '')
            .replace(/\\/g, '/')
            .replace(/^\//, '')
    );
    fs.rmdirSync(tmpDirPath, { recursive: true });
    return uniqueRelPaths;
}

test("getUniqueFiles with text contents", () => {
    const contents = 'some text';
    const diffContents = 'some different text';
    const tmpFiles: TmpFile[] = [
        { relativePath: 'x/misc/a.txt', contents },
        { relativePath: 'x1/misc/2/a.txt', contents },
        { relativePath: 'x2/back/a.txt', contents: diffContents }
    ];
    const uniqueFilePaths = getUniqueFiles(tmpFiles);
    expect(uniqueFilePaths).toEqual([
        'x/misc/a.txt',
        'x2/back/a.txt'
    ]);
});

test("getUniqueFiles with binary contents", () => {
    const contents = Buffer.alloc(5, 52, 'hex');
    const diffContents = Buffer.alloc(5, 56, 'hex');
    const tmpFiles: TmpFile[] = [
        { relativePath: 'x/misc/a.jpg', contents },
        { relativePath: 'x1/misc/2/a.jpg', contents },
        { relativePath: 'x2/back/a.jpg', contents: diffContents }
    ];
    const uniqueFilePaths = getUniqueFiles(tmpFiles);
    expect(uniqueFilePaths).toEqual([
        'x/misc/a.jpg',
        'x2/back/a.jpg'
    ]);
});
