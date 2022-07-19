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
        const containerName = 'manual';
        const containerClient = new ContainerClient(
            `https://${account}.blob.core.windows.net/${containerName}`,
            shaaredKeyCredential
        );

        // List blobs by hierarchy
        console.log("Listing blobs by hierarchy")
        for await (const item of containerClient.listBlobsByHierarchy("/")) {
            if (item.kind === "budget_tracker") {
                console.log(`\tBlobPrefix: ${item.name}`);
            } else {
            console.log(`\tBlobItem: name - ${item.name}, last modified - ${item.properties.lastModified}`);
        }

      }

      // A prefix may also be specified
      console.log("Listing blobs by hierarchy, specify a prefix")
      const items = containerClient.listBlobsByHierarchy("/", { prefix: "budget_tracker/" });
        for await (const item of items) {
            if (item.kind === "prefix") {
                console.log(`\tBlobPrefix: ${item.name}`);
            } else {
            console.log(`\tBlobItem: name - ${item.name}, last modified - ${item.properties.lastModified}`);
        }
      }

      // The iterator also supports iteration by page, by calling `byPage`. Paging may be combined with prefixes option.
      // for full control over iteration
      console.log('Listing blobs by hierarchy, by pages:')
        for await (const page of containerClient.listBlobsByHierarchy("/").byPage()) {
            const segment = page.segment;
            if (segment.blobPrefixes) {
                for (const prefix of segment.blobPrefixes) {
                    console.log(`\tBlobPrefix: ${prefix.name}`);
                }
            }
            for (const blob of page.segment.blobItems) {
                console.log(`\tBlobItem: name - ${blob.name}, last modified - ${blob.properties.lastModified}`);
            }
        }
    
 } catch (err) {
        console.log(err);
    }

}