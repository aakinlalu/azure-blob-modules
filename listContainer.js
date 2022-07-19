import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
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

      
        //list containers in the storage account
        const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            shaaredKeyCredential
        );

        //Iterate over all containers in the account
        console.log("Listing all containers in the account");
        for await (const response of blobServiceClient.listContainers().byPage({
            maxPageSize: 20,
        })) {
            console.log("- Pages:");
            if (response.containerItems) {
                for (const container of response.containerItems) {
                    console.log(`  - ${container.name}`);
                }
              }
            }
        } catch (err) {
          console.log(err);
       }
}

main();