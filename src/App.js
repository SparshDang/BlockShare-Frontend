import abi from "./artifacts/contracts/Share.sol/Share.json";
import {  useState } from "react";
import { ethers } from "ethers";

import style from "./app.module.css";
import FormContainer from "./components/FormContainers";

function App() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();

  const connectAccount = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    window.ethereum.on("chainChanged", () => window.location.reload());
    window.ethereum.on("accountsChanged", () => window.location.reload());

    if (provider) {
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());

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
        {account && <p  className={style.secondary__text}>
          Connected Account :{account}
        </p>}
      </div>
      <main className={style.main}>
        <FormContainer contract={contract} account={account} connectAccountHandler={connectAccount}/>
        <div className={style.landing}>
          <h2>Share File in a secure way</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
            cumque nostrum eius error nulla, hic, quo cupiditate obcaecati,
            dolorem deserunt nobis perspiciatis mollitia tenetur repellat?
            Laudantium quisquam possimus amet recusandae harum. Pariatur
            temporibus quia saepe.
          </p>
        </div>
      </main>
    </>
  );
}

export default App;
