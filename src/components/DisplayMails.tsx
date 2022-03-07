import { useMsal } from "@azure/msal-react";
import React, { useState, useEffect } from "react";
import { Spinner, Button, Modal, Tab, Tabs, Container, Badge } from "react-bootstrap";
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
  const [unreadMails, setUnreadMails] = useState<SingleMail[]>([]);
  const [readMails, setReadMails] = useState<SingleMail[]>([]);
  const [selectedMail, setSelectedMail] = useState<SingleMail>(
    {
      "@odata.etag": "",
      "id": "",
      "subject": "",
      "bodyPreview": "",
      "isRead": false,
      "body": {
        "contentType": "",
        "content": ""
      },
      "sender": {
        "emailAddress": {
          "name": "",
          "address": ""
        }
      }
    });
  const [mailBody, setMailBody] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [allRead, setAllRead] = useState(0)


  function FetchUnreadMails() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        getInbox(response.accessToken).then((response) =>
          setUnreadMails(response.value)
        );
      });
  }

  useEffect(() => {
    FetchUnreadMails();
  }, []);

  const handleClick = (id: string) => {
    const mailSelected = unreadMails.filter((mail) => mail.id === id).pop();
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
      setShow(true)
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
            pushReadMail(selectedMail)
          }
        });
      });
  };

  const pushReadMail = (email: SingleMail) => {
    const thisMail = { ...email, isRead: !email.isRead }
    setReadMails(() => [thisMail, ...readMails])
    setAllRead(allRead + 1)
    FetchUnreadMails()
  }
  return (
    <Container>
      <Tabs defaultActiveKey="unreadMails" id="controlled-tab-example" className="mb-3">
        <Tab eventKey="unreadMails" title={`Last 20 Unread Mails`}>
          {unreadMails !== [] ? (
            unreadMails.map((mail) => (
              <MailItem key={mail.id} mail={mail} readMail={handleClick} />
            ))
          ) : (
            <Spinner animation="border" />
          )}
        </Tab>
        <Tab eventKey="readMails" title={`Read Mails (${allRead})`}>
          {readMails !== [] ? (
            readMails.map((mail) => (
              <MailItem key={mail.id} mail={mail} readMail={handleClick} />
            ))
          ) : (
            <p>No Mail has been read in this session</p>
          )}
        </Tab>
      </Tabs>

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
          <Button variant="success" onClick={() => {
            updateMail(selectedMail.id);
            setShow(false);
          }}>
            Mark as Read
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
