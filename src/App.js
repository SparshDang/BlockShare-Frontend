import abi from "./artifacts/contracts/Share.sol/Share.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import UploadForm from "./components/UploadForm";
import RetrieveData from "./components/RetrieveData";

import style from './app.module.css';


function App() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [uploadFile, setUploadFile] = useState(false)

  useEffect(() => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());

    const preLoader = async () => {
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

      const contract_ = new ethers.Contract(contractAddress, abi.abi, signer);
      console.log(contract_);
      setContract(contract_);
    };

    if (provider) {
      preLoader();
    } else {
      console.log("No metamask");
    }
  }, []);

  return (
    <>
      <div className={style.center}>
        <h1>BlockShare</h1>
        <p>A secure way to share files...</p>
      </div>
      <div   className={style.carousel}>
        <div className={style.carousel__inner}>
        {uploadFile && <UploadForm contract={contract} classNames={style.carousel__element} />}
        {!uploadFile && <RetrieveData contract={contract} classNames={style.carousel__element} />}
        </div>
        <button className={style.changing__button} onClick={() => setUploadFile((p) => !p)}>{uploadFile ? "Recieve Files" : "Share Files"}</button>
      </div>
    </>
  );
}

export default App;
