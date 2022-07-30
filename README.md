# NFT Marketplace frontend using NextJs and Moralis.

This is the frontend part of NFT marketplace that allows a web3 user to interact with the [smart contract](https://github.com/sanjaydefidev/hardhat-nft-marketplace-smart-contracts) developed using hardhat. We have used NextJs and [web3uikit](https://web3uikit.com/) as our frontend stack to develop the interface. We have also used [Moralis](https://moralis.io/) database server to store user's NFTes.

The interface show recently listed NFT. It allows owner to update the price of listed NFT and a normal user can buy it. It also allow you to list your NFT to the marketplace so that other can buy it. The seller can withdraw the proceeds that he earn by selling the NFTes.

This web3 application is developed using `TypeScript` while following Patrick Collins course.


## Running the code
To run the code in your local development machine copy the repository with the following command. We have used `yarn` package manager to install all dependencies. You can use `NPM`. Start the local Blockchain server and connect to Moralis server.

```shell
git clone https://github.com/sanjaydefidev/nextjs-nft-marketplace-moralis
```
Installing all the dependencies
```shell
yarn install
```
Check out this [link](https://github.com/PatrickAlphaC/nextjs-nft-marketplace-moralis-fcc) for more information about this tutorial.

## Note
Thanks to @PatrickAlphaC for creating such a helpful tutorial.
