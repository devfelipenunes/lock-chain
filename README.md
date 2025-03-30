# Lock-Chain

[![Website](https://img.shields.io/website?url=https%3A%2F%2Flock-chain.vercel.app)](https://lock-chain.vercel.app)

## Descrição

Lock-Chain é um projeto que implementa criptografia segura, armazenamento de dados no IPFS via Pinata e interação com contratos inteligentes na blockchain Ethereum.

## Tecnologias Utilizadas

- **React** & **Next.js**
- **TypeScript**
- **Ethers.js**
- **Crypto (Node.js)**
- **Pinata IPFS**

## Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/lock-chain.git
   ```
2. Instale as dependências:
   ```sh
   cd lock-chain
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env.local`:
   ```sh
   NEXT_PINATA_API_KEY=SEU_API_KEY
   NEXT_PINATA_SECRET_API_KEY=SEU_SECRET_API_KEY
   NEXT_PUBLIC_CONTRACT_ADDRESS=SEU_CONTRACT_ADDRESS
   ```
4. Inicie o projeto:
   ```sh
   npm run dev
   ```

## Principais Funcionalidades

### 1. Criptografia com AES

A biblioteca `useCrypto` permite criptografar e descriptografar mensagens usando AES em diferentes modos.

#### Exemplo de Uso:

```tsx
const { encryptMessage, decryptMessage } = useCrypto();
const result = encryptMessage({
  message: "Hello World",
  key: "1234567890123456",
  mode: "AES_CBC",
});
console.log(result.encryptedMessage);
```

### 2. Upload e Download via Pinata (IPFS)

A biblioteca `usePinata` permite armazenar e recuperar arquivos no IPFS utilizando Pinata.

#### Exemplo de Uso:

```tsx
const { uploadToPinata, fetchFromPinata } = usePinata();
const ipfsHash = await uploadToPinata("Meu arquivo JSON");
const data = await fetchFromPinata(ipfsHash);
console.log(data);
```

### 3. Interação com Contratos Inteligentes

A biblioteca `useContract` conecta-se a contratos inteligentes na Ethereum via MetaMask.

#### Exemplo de Uso:

```tsx
const contract = useContract();
if (contract) {
  const balance = await contract.getBalance();
  console.log(balance);
}
```

## Licença

Este projeto está sob a licença MIT.
