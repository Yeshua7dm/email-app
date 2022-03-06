import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import { Spinner, Button } from "react-bootstrap";
import { loginRequest } from "../authConfig";
import { getInbox, updateReadStatus } from "../graph";
import MailItem from "./MailItem";
var HE = require("he");

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

export const MailList = () => {
  const { instance, accounts } = useMsal();
  const [topMails, setTopMails] = useState([]);
  const [selectedMailBody, setSelectedMail] = useState("");

  useEffect(() => {
    function RequestProfileAndEmailData() {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          getInbox(response.accessToken).then((response) => {
            console.log(response);
            setTopMails(response.value);
          });
        });
    }
    RequestProfileAndEmailData();
  }, []);

  const handleClick = (id) => {
    const mailSelected = topMails.filter((mail) => mail.id === id).pop();
    console.log(mailSelected);
    let mailBody = mailSelected.body.content
      .replace(/<!--/g, "")
      .replace(/-->/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    console.log(mailBody);
  };

  const updateMail = (id) => {
    instance
      .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
      .then((response) => {
        updateReadStatus(response.accessToken, id).then((response) =>
          console.log(response)
        );
      });
  };

  return (
    <>
      <h5 className="card-title">Welcome {accounts[0].name}</h5>

      {topMails !== [] ? (
        topMails.map((mail) => (
          <MailItem key={mail.id} mail={mail} readMail={handleClick} />
        ))
      ) : (
        <Spinner animation="border" />
      )}
    </>
  );
};
