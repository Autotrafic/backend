interface TMandate {
  _id: string;
  totalum_order_id: string;
  docuseal_submission_id: number;
  mandate_is_for: TMandateIsFor;
  signed: 'true' | 'false' | null;
}

type TMandateIsFor = 'client' | 'related_person' | null;
