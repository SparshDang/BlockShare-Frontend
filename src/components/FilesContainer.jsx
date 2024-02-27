import React from "react";
import {motion} from 'framer-motion';

import style from "./FilesContainer.module.css";

export default function FilesContainer({data}) {
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
            <a
              href={`https://gateway.pinata.cloud/ipfs/${item[1].substring(
                7
              )}/`}
              key={i}
              target="_blank"
              rel="noreferrer"
              download={item[0]}
              className={style.file}
            >
              {item[0]}
            </a>
          );
        })}
      </motion.div>
    </div>
  );
}
