export interface EmployeeOfPartnerModel {
  id?: number;
  shortPartnerName?: string;
  partnerName?: string;
  foundedYear?: number;
  contactClue?: string;
  telephoneOfContactClue?: string;
  managerFullName?: string;
  telephoneOfManager?: string;
  employeeSum?: number;

  baSum?: number;
  baExpert?: number;
  baExperience?: number;
  baBasic?: number;

  devSum?: number;
  devExpert?: number;
  devExperience?: number;
  devBasic?: number;

  devMobileSum?: number;
  devMobileExpert?: number;
  devMobileExperience?: number;
  devMobileBasic?: number;

  testerSum?: number;
  testerExpert?: number;
  testerExperience?: number;
  testerBasic?: number;
}
