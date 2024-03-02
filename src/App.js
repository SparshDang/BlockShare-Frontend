import abi from "./artifacts/contracts/Share.sol/Share.json";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ethers } from "ethers";

import SharedFileContainer from "./components/SharedFileContainer";
import Overlay from "./components/utils/Overlay";
import RetrieveForm from './components/RetrieveForm';
import UploadForm from './components/UploadForm';

import style from "./app.module.css";

function App() {
  const contractAddress = "0xfe61022C7582e98Bd2415d1acaF8BA1f10A87865";
  // const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const connectAccount = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());

    if (provider) {
      const signer = await provider.getSigner();
      let account_ = await signer.getAddress();
      setAccount(account_);
      setIsConnected(true);

      const contract_ = new ethers.Contract(contractAddress, abi.abi, signer);
      setContract(contract_);
    } else {
      console.log("No metamask");
    }
  };

  return (
    <>
      <div className={style.center}>
        <h1>BlockShare</h1>
        <p className={style.secondary__text}>A secure way to share files...</p>
        {isConnected && (
          <p className={style.secondary__text}>Connected Account :{account}</p>
        )}
      </div>
      <main className={style.main}>
          <UploadForm contract={contract} />
          <RetrieveForm contract={contract} />
        <SharedFileContainer contract={contract} />
      </main>
      <AnimatePresence>
        {!isConnected && (
          <Overlay className={style.overlay} onClick={connectAccount}>
            <button className={style.button}> Please Connect to Account</button>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
