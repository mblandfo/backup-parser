import fs = require('fs');
import path = require('path');
import * as BackupParser from './BackupParser';

const srcDir = 'c:/data'; // srcDir should contain only directories
const destDir = 'c:/data-parsed';

BackupParser.parseBackups(srcDir, destDir);
