import { useState } from "react";
import crypto from "crypto";

type EncryptMessageParams = {
  message: string;
  key: string;
  mode: "AES_CBC" | "AES_OFB" | "AES_CFB" | "AES_CTR";
};

type EncryptMessageResult = {
  encryptedMessage?: string;
  error?: string;
};

export const useCrypto = () => {
  const [encryptedMessage, setEncryptedMessage] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const encryptMessage = ({
    message,
    key,
    mode,
  }: EncryptMessageParams): EncryptMessageResult => {
    try {
      if (![16, 24, 32].includes(key.length)) {
        throw new Error("Key must be 16, 24, or 32 bytes!");
      }

      const modes: Record<string, string> = {
        AES_CBC: "aes-128-cbc",
        AES_OFB: "aes-128-ofb",
        AES_CFB: "aes-128-cfb",
        AES_CTR: "aes-128-ctr",
      };

      if (!modes[mode]) {
        throw new Error("Invalid encryption mode!");
      }

      const messageBuffer = Buffer.from(message, "utf-8");
      let cipher;
      let encrypted;
      let iv;

      if (mode === "AES_CTR") {
        iv = Buffer.alloc(16, 0);
        cipher = crypto.createCipheriv(
          modes[mode],
          Buffer.from(key, "utf-8"),
          iv
        );
        encrypted = Buffer.concat([
          cipher.update(messageBuffer),
          cipher.final(),
        ]);
      } else {
        iv = crypto.randomBytes(16);
        cipher = crypto.createCipheriv(
          modes[mode],
          Buffer.from(key, "utf-8"),
          iv
        );
        encrypted = Buffer.concat([
          cipher.update(messageBuffer),
          cipher.final(),
        ]);
      }

      const encryptedMessageB64 = Buffer.concat([iv, encrypted]).toString(
        "base64"
      );
      setEncryptedMessage(encryptedMessageB64);
      setError(null);
      return { encryptedMessage: encryptedMessageB64 };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error while encrypting the message.";
      setError(errorMessage);
      setEncryptedMessage("");
      return { error: errorMessage };
    }
  };

  const decryptMessage = ({
    encryptedMessage,
    key,
    mode,
  }: {
    encryptedMessage: string;
    key: string;
    mode: "AES_CBC" | "AES_OFB" | "AES_CFB" | "AES_CTR";
  }): { decryptedMessage?: string; error?: string } => {
    try {
      if (![16, 24, 32].includes(key.length)) {
        throw new Error("Key must be 16, 24, or 32 bytes!");
      }

      const modes: Record<string, string> = {
        AES_CBC: "aes-128-cbc",
        AES_OFB: "aes-128-ofb",
        AES_CFB: "aes-128-cfb",
        AES_CTR: "aes-128-ctr",
      };

      if (!modes[mode]) {
        throw new Error("Invalid decryption mode!");
      }

      const encryptedBuffer = Buffer.from(encryptedMessage, "base64");
      const iv =
        mode === "AES_CTR" ? Buffer.alloc(16, 0) : encryptedBuffer.slice(0, 16);
      const encryptedData =
        mode === "AES_CTR" ? encryptedBuffer : encryptedBuffer.slice(16);

      const decipher = crypto.createDecipheriv(
        modes[mode],
        Buffer.from(key, "utf-8"),
        iv
      );
      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);

      const decryptedMessage = decrypted.toString("utf-8");
      return { decryptedMessage };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error while decrypting the message.";
      return { error: errorMessage };
    }
  };

  return { encryptMessage, decryptMessage, encryptedMessage, error };
};
