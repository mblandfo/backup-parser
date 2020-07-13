import fs = require('fs');
import path = require('path');
import _ = require('lodash');

const BYTES_PER_GIGABYTE = 1024 * 1024 * 1024;

export default class FileInfo {
    constructor(public filePath: string) {
        this.fileName = path.basename(filePath);
        const folderPath = path.dirname(filePath);
        const idx = Math.max(folderPath.lastIndexOf('/'), folderPath.lastIndexOf('\\'));
        this.folderName = folderPath.substr(idx + 1);
    }

    readonly fileName: string;
    readonly folderName: string;

    private _fileSizeBytes?: number;

    get fileSizeBytes() {
        if (_.isNil(this._fileSizeBytes)) {
            const stats = fs.statSync(this.filePath);
            this._fileSizeBytes = stats.size;
        }
        return this._fileSizeBytes;
    }

    private _contents?: Buffer;

    getContents() {
        if (!this._contents) {
            this._contents = fs.readFileSync(this.filePath);
        }
        return this._contents;
    }

    clearContents() {
        this._contents = undefined;
    }

    get fileNameNoExtension() {
        const fileName = this.fileName;
        let dotIdx = fileName.indexOf('.');
        if (dotIdx < 0) {
            return fileName;
        }
        return fileName.substr(0, dotIdx);
    }

    get extension() {
        const fileName = this.fileName;
        let dotIdx = fileName.indexOf('.');
        if (dotIdx < 0) {
            return '';
        }
        return fileName.substr(dotIdx);
    }

    get hashKey() {
        // windows is case insensitive
        return this.fileName.toLowerCase() + this.fileSizeBytes;
    }

    filesAreSame(fileInfo: FileInfo) {
        if (this.fileName !== fileInfo.fileName || this.fileSizeBytes !== fileInfo.fileSizeBytes) {
            return false;
        }

        if (this.fileSizeBytes > BYTES_PER_GIGABYTE) {
            // TODO: filestream compare. False is safe, at worst we make a duplicate file
            return false;
        }

        let contents = this.getContents();
        let otherContents = fileInfo.getContents();
        return contents.equals(otherContents);
    }
}
