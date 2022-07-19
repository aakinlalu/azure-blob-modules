import { ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';

import { streamToBuffer } from './utils/stream';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
    const account = process.env.DEV_STORAGE_ACCOUNT_NAME  ||  "";
    const accountKey = process.env.DEV_TOKEN_KEY || "";

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

    const containerName = `manual`;

    const containerClient = new ContainerClient( 
        `https://${account}.blob.core.windows.net/${containerName}`, 
        sharedKeyCredential);  

    // const createContainerResponse = await containerClient.create();
    // console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);

    const blockBlobClient = containerClient.getBlockBlobClient('budget_tracker');

    const snapshotResponse = await blockBlobClient.createSnapshot();
    const blobSnapshotClient = blockBlobClient.withSnapshot(snapshotResponse.snapshot);
    

    const response = await blobSnapshotClient.download(0);
    console.log(
        "Reading response tp string ....",
        (await streamToBuffer(response.readableStreamBody)).toString()

    )

    } catch (err) {
        console.log(err);
    }


}