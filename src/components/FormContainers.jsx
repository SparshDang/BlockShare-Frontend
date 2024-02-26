import React from "react";
import { motion } from "framer-motion";

import UploadForm from "./UploadForm";
import RetrieveData from "./RetrieveData";

import style from "./FormContainers.module.css";

export default function FormContainer({ contract, account, connectAccountHandler }) {
  return (
    <motion.div className={style.main} layout
    >
      <motion.div
        className={style.form__outer__container}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.2 }}
        key={"upload"}
      >
        <UploadForm contract={contract} />
      </motion.div>
      <motion.div
        className={style.form__outer__container}
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.2 }}
        key={"reterueve"}
      >
        <RetrieveData contract={contract} />
      </motion.div>
      {!account && <div className={style.overlay} onClick={connectAccountHandler}>
          <button className={style.button}> Please Connect to Account</button>
        </div>}
    </motion.div>
  );
}
