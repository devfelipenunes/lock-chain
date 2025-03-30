import useContract from "@/hook/useContract";
import { useCrypto } from "@/hook/useCrypto";
import { usePinata } from "@/hook/usePinata";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface DecryptModalProps {
    onClose: () => void;
}

type FormValues = {
    encryptedMessage: string;
    key: string;
    cryptoType: string;
};

const DecryptModal: React.FC<DecryptModalProps> = ({ onClose }) => {
    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            key: "",
            cryptoType: "AES_CBC",
            encryptedMessage: "",
        },
    });
    const contract = useContract();
    const { fetchFromPinata } = usePinata();
    const [showPassword, setShowPassword] = useState(false);
    const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
    const [blockchainError, setBlockchainError] = useState<string | null>(null);
    const [keyLengthError, setKeyLengthError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { decryptMessage } = useCrypto();

    const onSubmitDecrypt: SubmitHandler<FormValues> = async (data) => {
        const { key, cryptoType, encryptedMessage } = data;

        if (!encryptedMessage) {
            alert("Por favor, forneça a mensagem criptografada.");
            return;
        }

        let requiredKeyLength = 0;

        if (cryptoType === "AES_CBC" || cryptoType === "AES_CTR") {
            requiredKeyLength = 16;
        } else if (cryptoType === "AES_OFB") {
            requiredKeyLength = 24;
        } else if (cryptoType === "AES_CFB") {
            requiredKeyLength = 32;
        }

        if (key.length !== requiredKeyLength) {
            setKeyLengthError(
                `A chave para o algoritmo ${cryptoType} deve ter exatamente ${requiredKeyLength} caracteres!`
            );
            return;
        }

        setIsLoading(true);

        try {
            if (!contract) {
                console.error("Contrato não inicializado.");
                return;
            }

            const ipfsHash = encryptedMessage;
            const storedIpfsHash = await contract.getFile(ipfsHash, key);

            const encryptedMessageFromPinata = await fetchFromPinata(storedIpfsHash);

            const result = decryptMessage({
                encryptedMessage: encryptedMessageFromPinata || "",
                key,
                mode: cryptoType as "AES_CBC" | "AES_OFB" | "AES_CFB" | "AES_CTR",
            });

            if (result.decryptedMessage) {
                setDecryptedMessage(result.decryptedMessage);
            } else if (result.error) {
                console.error("Erro ao descriptografar a mensagem:", result.error);
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("execution reverted")) {
                    const revertMessage = error.message.split('"')[1];
                    setBlockchainError(`Erro da blockchain: ${revertMessage}`);
                } else {
                    console.error("Erro de conexão:", error);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-[500px]">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-black">
                        Descriptografar Mensagem
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-red-500"
                    >
                        Fechar
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmitDecrypt)}
                    className="flex flex-col items-center"
                >
                    <input
                        type="text"
                        {...register("encryptedMessage", { required: true })}
                        placeholder="Mensagem Criptografada"
                        className="border p-2 mt-2 w-full text-black"
                    />
                    <div className="w-full relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("key", { required: true })}
                            placeholder="Chave de criptografia"
                            className="border p-2 mt-2 w-full text-black"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-3 text-black"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                        {keyLengthError && (
                            <p className="text-red-500 text-sm mt-2  ">{keyLengthError}</p>
                        )}
                    </div>
                    <select
                        {...register("cryptoType")}
                        className="border p-2 mt-2 w-full text-black"
                    >
                        <option value="AES_CBC">AES CBC</option>
                        <option value="AES_OFB">AES OFB</option>
                        <option value="AES_CFB">AES CFB</option>
                        <option value="AES_CTR">MODE CTR</option>
                    </select>
                    <button
                        type="submit"
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? "Carregando..." : "Descriptografar"}
                    </button>
                </form>
                {isLoading && (
                    <div className="mt-4 text-center">
                        <p className="text-black">Processando...</p>
                    </div>
                )}
                {decryptedMessage && (
                    <div className="mt-4 p-4 bg-gray-200 rounded">
                        <p className="font-bold text-black">Mensagem Descriptografada:</p>
                        <p className="text-black">{decryptedMessage}</p>
                    </div>
                )}

                {blockchainError && (
                    <div className="mt-4 text-red-500 p-2 border border-red-500 rounded">
                        {blockchainError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DecryptModal;
