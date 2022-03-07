import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import { Spinner, Button, Modal } from "react-bootstrap";
import { loginRequest } from "../authConfig.ts";
import { getInbox, updateReadStatus } from "../graph";
import MailItem from "./MailItem";
const Parser = new DOMParser();

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */

export const MailList = () => {
  const { instance, accounts } = useMsal();
  const [topMails, setTopMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
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

  const handleClick = (id) => {
    const mailSelected = topMails.filter((mail) => mail.id === id).pop();
    setSelectedMail(mailSelected);
    const mailBody = mailSelected.body.content
      .replace(/<!--/g, "")
      .replace(/-->/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
    setMailBody(mailBody);
    handleShow();
  };

  const updateMail = (id) => {
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
