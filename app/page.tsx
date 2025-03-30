"use client";

import { useState } from "react";
import EncryptModal from "@/components/EncryptModal";
import TransferModal from "@/components/TransferModal";
import DecryptModal from "@/components/DecryptModal";
import Menu from "@/components/Menu";

export default function Home() {
  const [showEncryptModal, setShowEncryptModal] = useState(false);
  const [showDecryptModal, setShowDecryptModal] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);

  return (
    <div className="flex flex-col items-center p-10">
      <Menu
        setShowDecryptModal={setShowDecryptModal}
        setShowEncryptModal={setShowEncryptModal}
        setShowTransferModal={setShowTransferModal}
      />
      {showEncryptModal && (
        <EncryptModal onClose={() => setShowEncryptModal(false)} />
      )}

      {showTransferModal && (
        <TransferModal onClose={() => setShowTransferModal(false)} />
      )}

      {showDecryptModal && (
        <DecryptModal onClose={() => setShowDecryptModal(false)} />
      )}
    </div>
  );
}
