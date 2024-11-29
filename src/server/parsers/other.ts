export function parsePhoneNumberForWhatsApp(phoneNumber: string): string {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedPhoneNumber.startsWith('34')) {
    return cleanedPhoneNumber;
  }

  return `34${cleanedPhoneNumber}`;
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

interface StripeError {
  type: 'StripeInvalidRequestError';
  code: 'email_invalid';
  message: string;
}

interface CustomStripeError extends StripeError {
  publicMessage: string;
}
