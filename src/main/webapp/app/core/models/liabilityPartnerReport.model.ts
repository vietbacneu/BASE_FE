export class LiabilitiesPartnerModel {
  id: number;
  partnerShortName: string;
  startTimeFrom: string;
  startTimeTo: string;
  endTimeFrom: string;
  endTimeTo: string;

  note: string;
  signatureStatus: number;
  totalUsedMM: number;
  totalMMPayed: number;
  totalMMRemain: number;
  signatureStatusCode: string;
  signatureStatusName: string;
}
