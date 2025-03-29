export const ContactError: React.FC<{ messages: string[] | undefined }> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return null;
  }
  return <div className="contact__error">{messages.join(",")}</div>; 
}