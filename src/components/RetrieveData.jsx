import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";

import style from './form.module.css';

export default function RetrieveData({ contract, classNames }) {
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);

  const retrieve = async (event) => {
    event.preventDefault();
    const data = await contract.getFiles(address);
    setData(() => data);
    console.log(data)
  };

  return (
    <motion.div className={classNames} initial={{opacity:0}} animate={{ opacity:1 }} exit={{opacity:0}} transition={{duration:0.5}}>
      <h2>Recieve Files</h2>
      <form onSubmit={retrieve} className={style.form}>
        <input
          type="text"
          placeholder="Address"
          onChange={(event) => setAddress(() => event.target.value)}
        />
        <button type="submit" className={style.submit__btn}>Recieve</button>
      </form>
      {
        data.map( (item, i) => {
          return <a href={ `https://gateway.pinata.cloud/ipfs/${item.substring(7)}/`} key={i}>
              {item}
          </a>
        })
      }
    </motion.div>
  );
}
