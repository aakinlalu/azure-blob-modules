import { ContainerClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    try {
        //DEV_STORAGE_ACCOUNT_NAME
    // DEV_TOKEN_KEY
        const account =process.env.DEV_STORAGE_ACCOUNT_NAME  || "";
        const accountkey = process.env.DEV_TOKEN_KEY || "";

        // Use StorageSharedKeyCredential with storage account and account key
        // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
        const shaaredKeyCredential = new StorageSharedKeyCredential(account, accountkey);

        // Create a container 
        const containerName = `manual`;
        const containerClient = new ContainerClient(
            `https://${account}.blob.core.windows.net/${containerName}`,
            shaaredKeyCredential
        );
         // Create a container 
        // const createContainerResponse = await containerClient.create();
        // console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);

        // Create some blobs with delimiters in names 
        // for (let index = 0; index < 5; index++) {
        //     const blobName = "newblob" + new Date().getTime();
        //     const content = `Hello World!${index}`;
        //     const contentBytesLength = Buffer.byteLength(content);
        //     const blocBlobClient = containerClient.getBlockBlobClient(blobName);
        //     const uploadBlobResponse = await blocBlobClient.upload(content, contentBytesLength);
        //     console.log(`Uploaded blob ${blobName} successfully`, uploadBlobResponse.requestId);
        // }

        // Iterate over all blobs in the container
        console.log("Blobs:");
        for await (const blob of containerClient.listBlobsFlat()) {
             console.log(`-${blob.name}`);
        }

        // The iterator also supports iteration by page with a limit of 1000 blobs per page
        
        const maxPageSize = 3;
        console.log('Blobs by page (maxPageSize: ${maxPageSize}:');
        let pageNumber = 1;
        for await (const page of containerClient.listBlobsFlat({ maxPageSize })) {
            console.log(`- Page ${pageNumber++}`);
            for (const blob of page.segment.blobItems) {
                console.log(`- ${blob.name}`);
            }
        }

        // The paged iterator alse supports resumming from a continuation token. In the following example, 
        // we use the continuation token from first Iteration  to resume from the second page.
        
        // Get the continuation token
        // console.log("Blobs starting from the second page of results:");
        // const iter = containerClient.listBlobsFlat().byPage({ maxPageSize });
        // const result = await iter.next();

        // if (result.done) {
        //     throw new Error("Rxpected at least one page of reesults.")
        // }

        // // The continuation token is an optional property of the page
        // const continuationToken = result.value.continuationToken;

        // if (!continuationToken) {
        //     throw new Error(
        //         "Expected a continuation token from the blob service, but one was not returned."
        //         );
        // }

    
        // const resumed = await containerClient.listBlobsFlat().byPage({ continuationToken, maxPageSize });
        // pageNumber= 2;
        // for await (const page of resumed) {
        //     console.log(`- Page ${pageNumber++}`);
        //     for (const blob of page.segment.blobItems) {
        //         console.log(`- ${blob.name}`);
        //     }
        // }

        //Finally, delete the container

        // await containerClient.delete();
        // console.log(`Deleted container ${containerName} successfully`);


    } catch (err) {
        console.log(err);
    }
}