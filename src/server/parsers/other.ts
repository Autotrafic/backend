export function parsePhoneNumberForWhatsApp(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedPhoneNumber.startsWith('34')) {
    return cleanedPhoneNumber;
  }

  return `34${cleanedPhoneNumber}`;
}

export function parsePhoneNumberForWhatsappId(phoneNumber: string): string {
  const cleanedNumber = phoneNumber.replace(/[^+\d]/g, "");

  let formattedNumber = cleanedNumber;
  if (formattedNumber.startsWith("+")) {
    formattedNumber = formattedNumber.slice(1);
  } else if (!formattedNumber.startsWith("34")) {
    formattedNumber = `34${formattedNumber}`;
  }

  if (formattedNumber.startsWith("34")) {
    formattedNumber = formattedNumber.replace(/^34(0+)/, "34");
  }

  return `${formattedNumber}@c.us`;
}

export function parsePhoneNumberToE164(phoneNumber: string): string | null {
  if (!phoneNumber) return null;
  
  const SPANISH_CODE = "34";

  const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

  if (/^\+/.test(cleanedNumber)) {
    return /^\+\d{1,15}$/.test(cleanedNumber) ? cleanedNumber : null;
  }

  const formattedNumber = `+${SPANISH_CODE}${cleanedNumber}`;

  return /^\+\d{1,15}$/.test(formattedNumber) ? formattedNumber : null;
}

export function parseStripeError(stripeError: StripeError): CustomStripeError {
  switch (stripeError.code) {
    case 'email_invalid':
      return {
        ...stripeError,
        publicMessage: 'El correo electrónico introducido no es válido. Revísalo o intenta con otra dirección',
      };
  }
}

export function formatCurrentDateToSpain(): string {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Madrid",
  };

  const formatter = new Intl.DateTimeFormat("es-ES", options);
  const formattedDate = formatter.format(date);

  const [dayMonth, time] = formattedDate.split(", ");
  const [day, month] = dayMonth.split("/");

  return `${day}/${month} ${time}`;
}

export function extractDriveFolderIdFromLink(driveLink: string): string {
  const url = new URL(driveLink);
  const pathSegments = url.pathname.split('/');
  return pathSegments.pop() || '';
}

interface StripeError {
  type: 'StripeInvalidRequestError';
  code: 'email_invalid';
  message: string;
}

interface CustomStripeError extends StripeError {
  publicMessage: string;
}
