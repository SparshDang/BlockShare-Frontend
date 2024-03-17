import React from "react";

const ContractContext = React.createContext(
    {
        contract : null,
        account : null,
        isConnected : false,
        connectAccount : () => {},
        getFriends : () => {},
    }
)
export default ContractContext;