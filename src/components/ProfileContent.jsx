import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { loginRequest } from "../authConfig";
import { ProfileData } from "./ProfileData";
import { callMsGraph, getInbox } from "../graph";


/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

export const ProfileContent = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);
    const [topMails, setTopMails] = useState([]);

    function RequestProfileData() {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance
            .acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            })
            .then((response) => {
                callMsGraph(response.accessToken).then((response) => setGraphData(response)
                );
                getInbox(response.accessToken).then(response => setTopMails(response));
            });
    }


    return (
        <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            {graphData ? (
                <ProfileData graphData={graphData} />
            ) : (
                <Button variant="secondary" onClick={RequestProfileData}>
                    Request Profile Information
                </Button>
            )}
        </>
    );
};
