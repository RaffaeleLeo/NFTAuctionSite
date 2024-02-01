import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-web3";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  defaultNetwork:"hardhat",
  networks:{
    hardhat:{
      chainId:1137
    }
  }
};

export default config;
