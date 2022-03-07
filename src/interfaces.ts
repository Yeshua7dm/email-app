export interface MailItemProps {
  mail: {
    id: string,
    subject: string,
    bodyPreview: string,
    isRead: boolean,
    sender: { emailAddress: { name: string, address: string } }
  },
  readMail: Function
}

