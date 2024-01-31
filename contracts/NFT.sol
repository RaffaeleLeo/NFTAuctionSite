// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {

    // NFT ID
    uint256 private _tokenId;
    constructor() ERC721("MyNFT", "MNFT") {}
    // address "to" is the address of the NFT owner, tokernURI is the link to the IPFS
    function mintNFT(address to, string memory tokenURI) public returns (uint256) {
        // increment the NFT ID every time a new one is created
        _tokenId++;
        _mint(to, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
        return _tokenId;
    }

    // Public getter for the current tokenId
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenId;
    }
}
