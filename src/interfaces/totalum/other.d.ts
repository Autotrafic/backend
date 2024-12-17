interface MandateFileOptions {
  templateId: string;
  fileName: string;
  data: MandateData;
}

interface MandateData {
  client: MandateClient;
  company: MandateCompany;
  orderType: string;
  vehiclePlate: string;
  actualDate: MandateDate;
}

interface MandateClient {
  type: TMandateIsFor;
  fullName: string;
  nif: string;
  address: string;
  phoneNumber: string;
}

interface MandateCompany {
  fullName: string;
  nif: string;
}

interface MandateDate {
  year: number;
  month: string;
  day: number;
}
