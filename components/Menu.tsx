import React from 'react';

interface MenuProps {
    setShowEncryptModal: (value: boolean) => void;
    setShowDecryptModal: (value: boolean) => void;
    setShowTransferModal: (value: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ setShowEncryptModal, setShowDecryptModal, setShowTransferModal }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <button
                onClick={() => setShowEncryptModal(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Criptografar Mensagem
            </button>
            <button
                onClick={() => setShowDecryptModal(true)}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Descriptografar Mensagem
            </button>
            <button
                onClick={() => setShowTransferModal(true)}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded"
            >
                Transferir NFT
            </button>
        </div>
    );
};

export default Menu;
