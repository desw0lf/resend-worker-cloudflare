type ContactInputProps = { name: string; children?: React.ReactNode; label?: string; onTouched?: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => void; type?: HTMLInputElement["type"] | "textarea"; };

const capitalizeFirst = (str: string) => str[0].toUpperCase() + str.slice(1);


export const ContactInput: React.FC<ContactInputProps> = ({ name, label, children, onTouched, type = "text" }) => {
  const props = {
    name,
    // autoComplete: "one-time-code",
    placeholder: label || capitalizeFirst(name),
    onKeyDown: onTouched
  };
  return <div>
    {/* <label htmlFor={name}>{text}</label> */}
    {type === "textarea" ? <textarea {...props} /> : <input type={type} {...props} />}
    {children}
  </div>;
}