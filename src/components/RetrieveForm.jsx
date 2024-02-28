import { useState } from "react";
import { isAddress } from "web3-validator";
import React from "react";

import Card from "./utils/Card";
import Form from "./utils/Form";
import FilesContainer from "./FilesContainer";
import ButtonsContainer from "./ButtonsContainer";

export default function RetrieveForm({ contract }) {
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);
  const [initial, setInitial ] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [isAddressWrong, setAddressIsWrong] = useState(false);


  const resetForm = () => {
    setData([]);
    setAddress("");
    setFormDisabled(false);
    setInitial(true);
    setAddressIsWrong(false)
  };

  const retrieve = async (event) => {
    event.preventDefault();
    if (isAddress(address)){
      setAddressIsWrong(false)
    }
    else{
      setAddressIsWrong(true);
      return
    }
    const data = await contract.getFiles(address);
    setData(data);
    setFormDisabled(true);
    setInitial(false);
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
          disabled={formDisabled}
          style={{
            borderColor: !isAddressWrong ?  "#eff8f9" : "red"
          }}
        />
        <ButtonsContainer>
          <button type="reset" disabled={!formDisabled} onClick={resetForm}>
            Reset State
          </button>
          <button type="submit" disabled={formDisabled}>
            Recieve Files
          </button>
        </ButtonsContainer>
      </Form>
      {data.length !== 0 && <FilesContainer data={data} />}
      {!initial && data.length === 0  && <p style={{
        margin:"10px"
      }}>There is no file shared to you by this address..</p> }
    </Card>
  );
}
