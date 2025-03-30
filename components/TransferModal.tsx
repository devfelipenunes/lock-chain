import useContract from "@/hook/useContract";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface TransferModalProps {
    onClose: () => void;
}

type FormValues = {
    to: string;
    ipfsHash: string;
};

const TransferModal: React.FC<TransferModalProps> = ({ onClose }) => {
    const contract = useContract();
    const [transferError, setTransferError] = useState<string | null>(null);
    const [transferSuccess, setTransferSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            to: "",
            ipfsHash: "",
        },
    });

    const onSubmitTransfer: SubmitHandler<FormValues> = async (data) => {
        const { to, ipfsHash } = data;

        if (!contract) {
            console.error("Contrato não inicializado.");
            return;
        }

        setIsLoading(true);
        try {
            const tx = await contract.transferNFT(to, ipfsHash);
            await tx.wait();
            setTransferSuccess(`NFT transferido com sucesso para ${to}`);
            setTransferError(null);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("execution reverted")) {
                    const revertMessage = error.message.split('"')[1];
                    setTransferError(`Erro da blockchain: ${revertMessage}`);
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
            <div className="bg-white p-6 rounded shadow-lg w-96">
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
                    onSubmit={handleSubmit(onSubmitTransfer)}
                    className="flex flex-col items-center"
                >
                    <input
                        type="text"
                        {...register("to", { required: true })}
                        placeholder="Endereço do destinatário"
                        className="border p-2 mt-2 w-full text-black"
                    />
                    <input
                        type="text"
                        {...register("ipfsHash", { required: true })}
                        placeholder="Hash do IPFS do NFT"
                        className="border p-2 mt-2 w-full text-black"
                    />
                    <button
                        type="submit"
                        className={`mt-4 px-4 py-2 rounded ${isLoading ? "bg-gray-400" : "bg-purple-500 text-white"
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Transferindo..." : "Transferir"}
                    </button>
                </form>
                {transferSuccess && (
                    <div className="mt-4 p-4 bg-green-200 rounded">
                        <p className="text-black">{transferSuccess}</p>
                    </div>
                )}
                {transferError && (
                    <div className="mt-4 text-red-500 p-2 border border-red-500 rounded">
                        {transferError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferModal;
