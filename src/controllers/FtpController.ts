import { Request, Response, NextFunction } from "express";
import * as basicFtp from 'basic-ftp';
import { anchorPathServer, boaPathServer, drhpPathServer, logoPathServer, rhpPathServer } from "../utils/constant";
import { ServerUploadFileEnum } from "../utils/enumData";
export async function saveFileToFtpServer(file: any,serverFileType:any) {
    console.log(file)
    const client = new basicFtp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: false
        });

        console.log("Connected to FTP server");

        var remoteDir = "";

        if(serverFileType == ServerUploadFileEnum.LOGO) {
            remoteDir = logoPathServer
        } else if(serverFileType == ServerUploadFileEnum.BOA) {
            remoteDir = boaPathServer
        } else if(serverFileType == ServerUploadFileEnum.ANCHOR) {
            remoteDir = anchorPathServer
        } else if(serverFileType == ServerUploadFileEnum.RHP) {
            remoteDir = rhpPathServer
        } else if(serverFileType == ServerUploadFileEnum.DRHP) {
            remoteDir = drhpPathServer
        }
        const localFilePath = file.path;
        const remoteFileName = file.filename;

        // Ensure the directory exists, create it if it doesn't
        await client.ensureDir(remoteDir);
        console.log(`Changed to directory: ${remoteDir}`);

        // Upload the file to the specified directory
        await client.uploadFrom(localFilePath, `${remoteDir}/${remoteFileName}`);

        console.log("File uploaded successfully");
        return true
    } catch (err) {
        console.error("An error occurred:", err);
        return false
    } finally {
        client.close();
    }
}