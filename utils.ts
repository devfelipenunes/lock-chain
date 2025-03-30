const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_ipfsHash", type: "string" },
      { internalType: "string", name: "_key", type: "string" },
    ],
    name: "storeFile",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_ipfsHash", type: "string" },
      { internalType: "string", name: "_key", type: "string" },
    ],
    name: "getFile",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "_ipfsHash", type: "string" },
    ],
    name: "transferNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export { CONTRACT_ABI };
