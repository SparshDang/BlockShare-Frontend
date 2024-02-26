import { useState } from "react";
import React from "react";

import style from "./form.module.css";

export default function RetrieveData({ contract, classNames }) {
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);

  const retrieve = async (event) => {
    event.preventDefault();
    const data = await contract.getFiles(address);
    setData(data);
  };

  return (
    <
    >
      <h2>Recieve Files</h2>
      <form onSubmit={retrieve} className={style.form}>
        <label>Enter Sender Address:</label>
        <input
          type="text"
          placeholder="Address"
          onChange={(event) => setAddress(() => event.target.value)}
        />
        <button type="submit" className={style.submit__btn}>
          Recieve
        </button>
      </form>
      <div className={style.files__container}>
        <h3>Received files:</h3>
        <div className={style.files}>
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
        </div>
      </div>
    </>
  );
}
