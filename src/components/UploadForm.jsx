import React, { useReducer, useState } from "react";

import { AnimatePresence } from "framer-motion";

import FileInput from "./utils/FileInput";
import Form from "./utils/Form";
import Loader from "./utils/Loader";
import Card from "./utils/Card";
import Overlay from "./utils/Overlay";


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
  } else {
    return {
      isUploading: false,
      status: null,
    };
  }
};

export default function UploadForm({ contract }) {
  const [uploadState, uploadReducer] = useReducer(uplaodingReducer, {
    isUploading: false,
    status: null,
  });

  const [file, setFile] = useState();
  const [recieverAddress, setRecieverAddress] = useState("");

  const uploadData = async (event) => {
    event.preventDefault();

    if (file) {
      uploadReducer({
        type: "UPLOADING",
      });
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadDataToPinata(formData);
        await sendDataToContract(file.name, res);
        uploadReducer({
          type: "SUCCESS",
        });
        resetFields();
      } catch (e) {
        uploadReducer({
          type: "FAIL",
        });
      }
      setTimeout(
        () =>
          uploadReducer({
            type: "RESET",
          }),
        2000
      );
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
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
  };

  const resetFields = () => {
    setFile(null);
    setRecieverAddress("");
  }

  return (
    <Card>
      <h2>Upload Files</h2>
      <Form onSubmit={uploadData}>
        <FileInput retrieveImage={retrieveImage} file={file} />
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
          disabled={!file && !uploadState.status && !(recieverAddress.trim().length === 0)}
        >
          Upload Data
        </button>
      </Form>
      <AnimatePresence>
        {uploadState.isUploading && <Loader />}
        {uploadState.status === "SUCCESS" && (
          <Overlay>
            <p>File Uploaded Successfully</p>
          </Overlay>
        )}
        {uploadState.status === "FAIL" && (
          <Overlay>
            <p>File Upload Failed</p>
          </Overlay>
        )}
      </AnimatePresence>
    </Card>
  );
}
