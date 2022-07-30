Moralis.Cloud.afterSave("ItemListed", async (request) => {
    //every events get triggered twice, once on unconfirmed, again on confirmed.
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Looking for confirmed TX...");
    if (confirmed) {
        logger.info("Found item!");
        const ActiveItem = Moralis.Object.extend("ActiveItem"); // this create a new Table if it doesnot exist

        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("marketplaceAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        query.equalTo("seller", request.object.get("seller"));
        logger.info(`Marketplace | Query: ${query}`);
        const alreadyListedItem = await query.first();
        if (alreadyListedItem) {
            logger.info(`Deleting...`);
            await alreadyListedItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} since the listing is being updated. `
            );
        }

        // Add new ActiveItem or add the deleted Item during update.
        const activeItem = new ActiveItem();
        activeItem.set("marketplaceAddress", request.object.get("address"));
        activeItem.set("nftAddress", request.object.get("marketplaceAddress"));
        activeItem.set("price", request.object.get("price"));
        activeItem.set("tokenId", request.object.get("tokenId"));
        activeItem.set("seller", request.object.get("seller"));
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        );
        logger.info("Saving...");
        await activeItem.save();
    }
});

Moralis.Cloud.afterSave("ListingCancelled", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info(`Marketplace | Object: ${request.object}`);
    logger.info("Looking for confirmed TX2...");
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("marketplaceAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const canceledItem = await query.first();
        logger.info(`Marketplace | CanceledItem: ${canceledItem}`);
        if (canceledItem) {
            logger.info(`Deleting...`);
            await canceledItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since it was canceled. `
            );
        } else {
            logger.info(
                `No item canceled with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found.`
            );
        }
    }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info(`Marketplace | Object: ${request.object}`);
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("marketplaceAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | Query: ${query}`);
        const boughtItem = await query.first();
        logger.info(`Marketplace | boughtItem: ${boughtItem}`);
        if (boughtItem) {
            logger.info(`Deleting...`);
            await boughtItem.destroy();
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} from ActiveItem table since it was bought.`
            );
        } else {
            logger.info(
                `No item bought with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found`
            );
        }
    }
});
