import type { NextPage } from "next";
import { useMoralis, useMoralisQuery } from "react-moralis";

import NFTBox from "../components/NFTBox";

const Home: NextPage = () => {
    const { isWeb3Enabled } = useMoralis();
    // How we will list the NFT?
    // We will index the events off-chain and then read from the database
    // To do so, setup a server to listen for those events to be fired, and we will add them to a database so that we can query
    const { data: activeNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId")
    );

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        activeNfts.map((nft, index) => {
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes;
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            );
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    );
};

export default Home;
