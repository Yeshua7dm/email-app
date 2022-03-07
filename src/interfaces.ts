export interface SingleMail {
    id: string,
    subject: string,
    bodyPreview: string,
    body: { contentType: string, content: string }
    isRead: boolean,
    "@odata.etag": string,
    sender: { emailAddress: { name: string, address: string } }
}
export interface MailItemProps {
    mail: SingleMail,
    readMail: Function
}
export interface Mails {
    mails: Array<SingleMail>
}