import React from "react";
import { motion } from "framer-motion";

import style from "./FilesContainer.module.css";

export default function FilesContainer({ data }) {
  const downloadFile = async (hash, name) => {
    const url = `https://orange-gigantic-wren-85.mypinata.cloud/ipfs/${hash}/`;
    // const url =  `https://gateway.pinata.cloud/ipfs/${hash}`;
    const res = await fetch(url, {
      headers: {
        "x-pinata-gateway-token": process.env.REACT_APP_PINATA_GATEWAY_KEY,
      },
    });
    console.log(res);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = name;
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    URL.revokeObjectURL(blobUrl);
  };
  return (
    <div className={style.files__container}>
      <h3>Received files:</h3>

      <motion.div
        className={style.files}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {data.map((item, i) => {
          return (
            <div
              onClick={() => downloadFile(item[1].substring(7), item[0])}
              key={i}
              className={style.file}
            >
              {item[0]}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
