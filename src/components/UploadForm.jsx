import React, { useState } from "react";
import {motion} from 'framer-motion';

import UploadButton from "./UploadButton";

import style from './form.module.css';

export default function UploadForm({ contract, classNames }) {
  const [file, setFile] = useState();
  const [recieverAddress, setRecieverAddress] = useState();

  const uploadData = async (event) => {
    event.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadDataToPinata(formData);
        await sendDataToContract(res);
        alert("Data Uploaded");
      } catch (e) {
        console.log(e)
      }
    }
  };

  const uploadDataToPinata = async (data) => {
    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization:
            `${process.env.REACT_APP_PINATA_KEY}`,
        },
        body: data,
      }
    );


    return res;
  } 

  const sendDataToContract = async (res) => {
    const data = await res.json();
    console.log(data)

    const transaction = await contract.shareFile(
      recieverAddress,
      `ipfs://${data.IpfsHash}`
    );
    console.log("h",data)
    await transaction.wait();
  }

  const retrieveImage = (event) => {
    const data = event.target.files[0];
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
  };
  return (
    <motion.div className={ classNames}  initial={{opacity:0}} animate={{ opacity:1 }} exit={{opacity:0}} transition={{duration:0.5}}>
      <h2>Upload Files</h2>

    <form onSubmit={uploadData} className={style.form}>
      <UploadButton retrieveImage={retrieveImage} />
      <label>
        Enter Reciever Address:
      </label>
      <input
        type="text"
        name="address"
        id="address"
        placeholder="address"
        onChange={(event) => setRecieverAddress(event.target.value)}
      />
      <button type="submit" className={style.submit__btn}>Upload Data</button>
    </form>
    </motion.div>
  );
}
