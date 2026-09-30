export const sendMail = async (
  to: string,
  subject: string,
  text: string,
): Promise<void> => {
  console.log(`To: ${to}\nSubject: ${subject}\n\n${text}`);
};
