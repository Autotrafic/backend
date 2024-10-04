export function parsePhoneNumberForWhatsApp(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedPhoneNumber.startsWith('34')) {
    return cleanedPhoneNumber;
  }

  return `34${cleanedPhoneNumber}`;
}
