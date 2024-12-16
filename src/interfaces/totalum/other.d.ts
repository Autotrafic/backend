interface MandateFileOptions {
  templateId: string;
  fileName: string;
  data: MandateFileData;
}

interface MandateFileData {
  client: {
    fullName: string;
    nif: string;
    address: string;
  };
  company: {
    fullName: string;
    nif: string;
  };
  orderType: string;
  vehiclePlate: string;
  actualDate: {
    year: number;
    month: string;
    day: number;
  };
}
