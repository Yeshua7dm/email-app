import * as React from "react";
import { Card, Button } from "react-bootstrap";
import { MailItemProps } from "../interfaces"


const MailItem = ({ mail, readMail }: MailItemProps) => {
  return (
    // <div>
    <Card
      bg="light"
      text="dark"
      style={{ width: "80%" }}
      className="mb-2 mx-auto"
    >
      <Card.Header className="text-right">
        <p>
          Sent From:{" "}
          <a href={`mailto:${mail.sender.emailAddress.address}`}>
            {mail.sender.emailAddress.name}
          </a>
        </p>
      </Card.Header>
      <Card.Body>
        <Card.Title>{mail.subject}</Card.Title>
        <Card.Text>{mail.bodyPreview}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-right">
        {!mail.isRead ? (
          <Button variant="primary" onClick={() => { readMail(mail.id) }}>
            Read Mail
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            Mail has been read
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default MailItem;
