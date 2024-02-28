import React, { useReducer, useState } from "react";
import { motion } from "framer-motion";
import { isAddress } from "web3-validator";

import Card from "./utils/Card";
import Form from "./utils/Form";
import Loader from "./utils/Loader";
import Overlay from "./utils/Overlay";
import ButtonsContainer from "./ButtonsContainer";

import style from "./SharedFileContainer.module.css";
import style2 from "./FilesContainer.module.css";

const fetchFileReducer = (state, action) => {
  if (action.type === "FETCHING") {
    return {
      isFetching: true,
      isEmpty: false,
      data: [],
      isError: false,
      initial: true,
    };
  } else if (action.type === "FETCHED") {
    return {
      isFetching: false,
      isEmpty: action.data.length === 0,
      data: action.data,
      isError: action.error,
      initial: false,
    };
  } else if (action.type === "RESET") {
    return {
      isFetching: false,
      isEmpty: true,
      data: [],
      isError: false,
      initial: true,
    };
  } else {
    return state;
  }
};

const deleteFileReducer = (state, action) => {
  if (action.type === "DELETING") {
    return {
      isDeleting: true,
      isError: false,
    };
  } else if (action.type === "DELETED") {
    return {
      isDeleting: false,
      isError: action.error,
    };
  } else if (action.type === "RESET") {
    return { isDeleting: false, isError: false };
  }
};

export default function SharedFileContainer({ contract }) {
  const [address, setAddress] = useState("");
  const [filesState, filesDispach] = useReducer(fetchFileReducer, {
    isFetching: false,
    isEmpty: true,
    data: [],
    isError: false,
    initial: true,
  });
  const [deleteState, deleteDispach] = useReducer(deleteFileReducer, {
    isDeleting: false,
    isError: false,
  });

  const [formDisable, setFormDisabled] = useState(false);
  const [isAddressWrong, setAddressIsWrong] = useState(false);


  const getData = async (event) => {
    event?.preventDefault();
    if (isAddress(address)) {
      setAddressIsWrong(false);
    } else {
      setAddressIsWrong(true);
      return;
    }
    try {
      const data_ = await contract.sharedFiles(address);
      filesDispach({ type: "FETCHED", data: data_ });
      setFormDisabled(true);
    } catch (e) {
      filesDispach({ type: "FETCHED", error: true, data: [] });
    }
  };

  const deleteFile = async (ipfsHash) => {
    deleteDispach({
      type: "DELETING",
    });
    try {
      const transaction = await contract.deleteFile(address, ipfsHash);
      await transaction.wait();
      deleteDispach({
        type: "DELETED",
      });
    } catch (e) {
      deleteDispach({
        type: "DELETED",
        error: true,
      });
      setTimeout(() => {
        deleteDispach({ type: "RESET" });
      }, 2000);
    }
    await getData();
  };

  const resetForm = () => {
    filesDispach({ type: "RESET" });
    setFormDisabled(false);
    setAddress("");
  };

  return (
    <Card className={style.main}>
      <h2>Get Shared Files</h2>
      <Form className={style.form} onSubmit={getData}>
        <label>Enter Address:</label>
        <input
          type="text"
          placeholder="Address"
          onChange={(event) => setAddress(() => event.target.value)}
          className={style.input}
          value={address}
          disabled={formDisable}
          style={{
            borderColor: !isAddressWrong ? "#eff8f9" : "red",
          }}
        />
        <ButtonsContainer>
          <button type="reset" disabled={!formDisable} onClick={resetForm}>
            Reset State
          </button>
          <button type="submit" disabled={formDisable}>
            Get Files
          </button>
        </ButtonsContainer>
      </Form>
      {!filesState.isEmpty && (
        <div className={style2.files__container}>
          <h3>Shared files:</h3>
          <motion.div
            className={style2.files}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filesState.data.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`${style2.file} ${style.file}`}
                  onClick={() => deleteFile(item.IpfsHash)}
                >
                  {item[0]}
                </div>
              );
            })}
          </motion.div>
        </div>
      )}
      {filesState.isEmpty && !filesState.initial && (
        <p>No Files Shared with this address</p>
      )}
      {deleteState.isDeleting && <Loader />}
      {deleteState.isError && (
        <Overlay>
          <p> An Error Occured</p>
        </Overlay>
      )}
    </Card>
  );
}
