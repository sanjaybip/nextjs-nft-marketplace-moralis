const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");
let chainId = process.env.chainId || "31337";
//let moralisChainId = chainId == "31337" ? "1337" : chainId; // Moralis consider localchain at 1337.
let moralisChainId = "0x539";

/* Moralis init code */
const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const masterKey = process.env.moralisMasterKey;

async function main() {
    await Moralis.start({ serverUrl, appId, masterKey });
    const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];
    console.log(`Working with contract address: ${contractAddress}`);

    //events logging
    let itemListedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        description: "Fire event on listing NFT",
        topic: "ItemListed(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "marketplaceAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
        tableName: "ItemListed",
    };

    let itemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        description: "Fire event on Buying NFT",
        topic: "ItemBought(address,address,uint256,uint256)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "marketplaceAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
        tableName: "ItemBought",
    };

    let listingCancelledOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        sync_historical: true,
        description: "Fire event on cancelling NFT",
        topic: "ListingCancelled(address,uint256,address)",
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "marketplaceAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
            ],
            name: "ListingCancelled",
            type: "event",
        },
        tableName: "ListingCancelled",
    };

    const listedRespo = await Moralis.Cloud.run("watchContractEvent", itemListedOptions, {
        useMasterKey: true,
    });
    const boughtRespo = await Moralis.Cloud.run("watchContractEvent", itemBoughtOptions, {
        useMasterKey: true,
    });
    const cancelledRespo = await Moralis.Cloud.run(
        "watchContractEvent",
        listingCancelledOptions,
        { useMasterKey: true }
    );

    if (listedRespo.success && boughtRespo.success && cancelledRespo.success) {
        console.log(
            "Updated! You should now be able to see these tables in your database. \n Note: You won't be able to see the events on the `sync` tab of the UI though."
        );
    } else {
        console.log(
            "Something went wrong uploading events... Try manually importing for a better error code. "
        );
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
