export function getInvoiceName(invoiceNumber: number): string {
  const date = new Date();
  const year = date.getFullYear();

  const month = date.getMonth() + 1;
  const trimester = Math.ceil(month / 3);

  const invoiceName = `${year}-T${trimester}-${invoiceNumber}`;

  return invoiceName;
}
