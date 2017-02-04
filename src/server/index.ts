import * as express from 'express';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as request from 'request';
import * as fs from 'fs';
import { pathExists } from './utils';
import config from './config';
import tgz = require('tarball-extract');

const app = express();
const CACHE_DIR_PATH = path.join(__dirname, '.cache');

// Create cache directory if not exists
mkdirp.sync(CACHE_DIR_PATH);

config.remoteDocs.forEach(remoteDoc => {
    const docDirectory = `${remoteDoc.packageName}/${remoteDoc.version}/`;

    if (!pathExists(docDirectory)) {
        mkdirp.sync(docDirectory);

        const fileName = `${remoteDoc.packageName}-${remoteDoc.version}.tgz`;
        const downloadUrl = `${config.npmRegistry}${remoteDoc.packageName}/-/${fileName}`;
        const downloadFile = path.join(CACHE_DIR_PATH, fileName);
        const destination = path.join(CACHE_DIR_PATH, docDirectory);

        tgz.extractTarballDownload(downloadUrl, downloadFile, destination, {}, (error, result) => {
            if (error) {
                console.error(`Error during downloading ${downloadUrl}`, error);
            } else {
                console.info(`${downloadUrl} downloaded successfully`);
            }
        });
    }

    app.get(`${remoteDoc.packageName}/${remoteDoc.version}/`, (req, res) => {
        return express.static(path.join(CACHE_DIR_PATH, docDirectory, remoteDoc.docPath));
    });
});

app.listen(config.port, config.host, () => {
    console.log(`App started at http://${config.host}:${config.port}/`);
});