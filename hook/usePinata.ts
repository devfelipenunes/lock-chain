import { useState } from "react";

export const usePinata = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToPinata = async (content: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.NEXT_PINATA_API_KEY || "",
          pinata_secret_api_key: process.env.NEXT_PINATA_SECRET_API_KEY || "",
        },
        body: JSON.stringify({
          pinataContent: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload para o Pinata");
      }

      const result = await response.json();
      return result.IpfsHash;
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchFromPinata = async (ipfsHash: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao recuperar arquivo do Pinata");
      }

      return await response.text();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadToPinata, fetchFromPinata, loading, error };
};
