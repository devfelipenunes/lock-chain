import { useState, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import { CONTRACT_ABI } from "@/utils";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: Ethereum;
  }
}

const useContract = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum!);
          await provider.send("eth_requestAccounts", []);
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );

          setContract(contractInstance);
        } catch (error) {
          console.error("Erro ao acessar o Ethereum:", error);
        }
      } else {
        console.error("Ethereum não está disponível.");
      }
    };

    initializeContract();
  }, []);

  return contract;
};

export default useContract;
