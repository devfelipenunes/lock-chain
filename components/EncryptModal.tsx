import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface EncryptModalProps {
    onClose: () => void;
}

import useContract from "@/hook/useContract";
import { usePinata } from "@/hook/usePinata";
import { useCrypto } from "@/hook/useCrypto";

type FormValues = {
    message: string;
    key: string;
    cryptoType: string;
};

const EncryptModal: React.FC<EncryptModalProps> = ({ onClose }) => {
    const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const contract = useContract();
    const [showPassword, setShowPassword] = useState(false);
    const { uploadToPinata } = usePinata();
    const [keyLengthError, setKeyLengthError] = useState<string | null>(null);
    const { encryptMessage } = useCrypto();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmitEncrypt: SubmitHandler<FormValues> = async (data) => {
        const { message, key, cryptoType } = data;

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
            const result = encryptMessage({
                message,
                key,
                mode: cryptoType as "AES_CBC" | "AES_OFB" | "AES_CFB" | "AES_CTR",
            });

            if (result.error) {
                console.error("Erro ao criptografar a mensagem:", result.error);
                return;
            }

            if (result.encryptedMessage) {
                const ipfsHash = await uploadToPinata(result.encryptedMessage);

                if (contract) {
                    const tx = await contract.storeFile(ipfsHash, key);
                    await tx.wait();
                }

                setEncryptedMessage(ipfsHash);
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-[500px]">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold  text-black">
                        Criptografar Mensagem
                    </h2>
                    <button
                        onClick={onClose}
                        className=" text-red-500"
                    >
                        Fechar
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmitEncrypt)}
                    className="flex flex-col items-center"
                >
                    <div className="flex flex-row w-full">
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
                                <p className="text-red-500 text-sm mt-2 ">{keyLengthError}</p>
                            )}
                        </div>
                        <select
                            {...register("cryptoType")}
                            className="border p-2 mt-2  text-black"
                        >
                            <option value="AES_CBC">AES CBC</option>
                            <option value="AES_OFB">AES OFB</option>
                            <option value="AES_CFB">AES CFB</option>
                            <option value="AES_CTR">MODE CTR</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <textarea
                            {...register("message", { required: true })}
                            placeholder="Escreva sua mensagem"
                            className="border p-2 mt-2 w-full text-black"
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-2  ">
                                A mensagem é obrigatória.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded ${isLoading ? "bg-gray-400" : "bg-blue-500"
                            } text-white`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Processando..." : "Criptografar"}
                    </button>
                </form>

                {encryptedMessage && (
                    <div className="mt-4 p-4 bg-gray-200 rounded">
                        <p className="font-bold text-black">Mensagem Criptografada:</p>
                        <div className="flex flex-row items-center justify-between mt-2 p-2 bg-gray-300 rounded">
                            <p className="text-black text-xs break-all">{encryptedMessage}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(encryptedMessage)}
                                className="bg-blue-500 text-white rounded cursor-pointer text-xs px-2 py-1 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncryptModal;
