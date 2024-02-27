import { useState } from "react";
import React from "react";

import Card from './utils/Card'
import Form from "./utils/Form";
import FilesContainer from "./FilesContainer";

export default function RetrieveForm({ contract }) {
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);

  const retrieve = async (event) => {
    event.preventDefault();
    const data = await contract.getFiles(address);
    setData(data);
    setAddress('');
  };

  return (
    <Card>
      <h2>Recieve Files</h2>
      <Form onSubmit={retrieve}>
        <label>Enter Sender Address:</label>
        <input
          type="text"
          placeholder="Address"
          onChange={(event) => setAddress(() => event.target.value)}
          value={address}
        />
        <button type="submit">
          Recieve
        </button>
      </Form>
      {data.length !== 0 && (
        <FilesContainer data={data}/>
      )}
    </Card>
  );
}
