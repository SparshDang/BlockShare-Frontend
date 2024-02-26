import React, { useState } from "react";

import UploadButton from "./UploadButton";

import style from "./form.module.css";
import Loader from "./Loader";

const uplaodingReducer = (state, action) => {
  if (action.type === "UPLOADING") {
    return {
      isUploading: true,
      status: null,
    };
  } else if (action.type === "FAIL") {
    return {
      isUploading: false,
      status: "FAIL",
    };
  } else if (action.type === "SUCCESS") {
    return {
      isUploading: false,
      status: "SUCCESS",
    };
  }
};

export default function UploadForm({ contract, classNames }) {
  const [file, setFile] = useState();
  const [recieverAddress, setRecieverAddress] = useState();
  const [uploading, setUploading] = useState(false);

  const uploadData = async (event) => {
    event.preventDefault();

    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadDataToPinata(formData);
        await sendDataToContract(file.name, res);
        alert("Data Uploaded");
      } catch (e) {
        console.log(e);
      }
      setUploading(false);
    }
  };

  const uploadDataToPinata = async (data) => {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `${process.env.REACT_APP_PINATA_KEY}`,
      },
      body: data,
    });

    return res;
  };

  const sendDataToContract = async (fileName, res) => {
    const data = await res.json();

    const transaction = await contract.shareFile(
      recieverAddress,
      fileName,
      `ipfs://${data.IpfsHash}`
    );
    await transaction.wait();
  };

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
    <>
      <h2>Upload Files</h2>
      <form onSubmit={uploadData} className={style.form}>
        <UploadButton retrieveImage={retrieveImage} file={file} />
        <label>Enter Reciever Address:</label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Address"
          onChange={(event) => setRecieverAddress(event.target.value)}
          value={recieverAddress}
        />
        <button
          type="submit"
          className={style.submit__btn}
          disabled={!file && !uploading}
        >
          Upload Data
        </button>
      </form>
      {uploading && <Loader />}
    </>
  );
}
