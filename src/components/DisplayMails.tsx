import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import { Spinner, Button, Modal } from "react-bootstrap";
import { loginRequest } from "../authConfig";
import { getInbox, updateReadStatus } from "../graph";
import MailItem from "./MailItem";
const Parser = new DOMParser();

import { SingleMail } from '../interfaces'

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

export const DisplayMails = () => {
  const { instance, accounts } = useMsal();
  const [topMails, setTopMails] = useState<SingleMail[]>([]);
  // const [selectedMail, setSelectedMail] = useState(null);
  const [selectedMail, setSelectedMail] = useState<SingleMail>({
    "@odata.etag": "W/\"CQAAABYAAAAiIsqMbYjsT5e/T7KzowPTAAQ+faR0\"",
    "id": "AAMk",
    "subject": "Your monthly digest",
    "bodyPreview": "Private to youHi, Megan Bowen,This is your month in reviewAn in-depth look at your work patterns in the last four weeksInsight of the monthJanuary 9 – February 5Your calendar is usually less than 30% booked when the week star",
    "isRead": false,
    "body": {
      "contentType": "html",
      "content": "html"
    },
    "sender": {
      "emailAddress": {
        "name": "Microsoft Viva",
        "address": "viva-noreply@microsoft.com"
      }
    }
  });
  const [mailBody, setMailBody] = useState("");

  //   functionalities for the Modal
  const [show, setShow] = useState(false);

  const modalCloser = () => {
    updateMail(selectedMail.id);
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    function RequestProfileAndEmailData() {
      // Silently acquires an access token which is then attached to a request for MS Graph data
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          getInbox(response.accessToken).then((response) =>
            setTopMails(response.value)
          );
        });
    }
    RequestProfileAndEmailData();
  }, []);

  const handleClick = (id: string) => {
    const mailSelected = topMails.filter((mail) => mail.id === id).pop();
    if (mailSelected !== undefined) {
      setSelectedMail(mailSelected)
      console.log(mailSelected)
      const mailBody = mailSelected.body.content
        .replace(/<!--/g, "")
        .replace(/-->/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      setMailBody(mailBody);
      handleShow();
    }
  };

  const updateMail = (id: string) => {
    instance
      .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
      .then((response) => {
        updateReadStatus(response.accessToken, id).then((response) => {
          if (response.isRead) {
            console.log(response.isRead);
            console.log(selectedMail);
            setTopMails(
              topMails.map((mail) =>
                mail.id === selectedMail.id
                  ? { ...mail, isRead: !mail.isRead }
                  : mail
              )
            );
          }
        });
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

      <Modal
        show={show}
        // fullscreen={true}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Body>
          {<div dangerouslySetInnerHTML={{ __html: mailBody }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={modalCloser}>
            Mark as Read
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
