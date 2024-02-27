import React, { useState } from "react";
import { motion } from "framer-motion";

import Card from "./utils/Card";
import Form from "./utils/Form";
import Loader from "./utils/Loader";
import Overlay from "./utils/Overlay";

import style from "./SharedFileContainer.module.css";
import style2 from "./FilesContainer.module.css";

export default function SharedFileContainer({ contract }) {
  const [address, setAddress] = useState();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async (event) => {
    event.preventDefault();
    const data_ = await contract.sharedFiles(address);
    setData(() => data_);
  };

  const deleteFile = async (ipfsHash) => {
    setIsLoading(true);
    const transaction = await contract.deleteFile(address, ipfsHash);
    await transaction.wait();
    setIsLoading(false);
    const data_ = await contract.sharedFiles(address);
    setData(() => data_);
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
        />
        <button type="submit" className={style.submit__btn}>
          Get Files
        </button>
      </Form>
      {data.length !== 0 && (
        <div className={style2.files__container}>
          <h3>Shared files:</h3>
          <motion.div
            className={style2.files}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {data.map((item, i) => {
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
      {isLoading && <Loader />}
    </Card>
  );
}
