import { Moment } from "moment";

export class OutsourcingPlanModel {
  id: number;
  softwareDevelopmentID: number;
  userCreateID: number;
  startTime: Moment;
  endTime: Moment;
  baNumber: number;
  devNumber: number;
  devMobileNumber: number;
  testNumber: number;
  requireBA: string;
  requireDev: string;
  requireDevMobile: string;
  requireTest: string;
  description: string;
  planCode: string;
  mmos: number;
  outsourceTypeCode: string;
  outsourceTypeName: string;
  planStatus: string;
  projectCode?: string;
  projectName: string;
  pm: string;
  am: string;
  productUnit: string;
  businessUnit: string;
  idProject: number;
  idBusinessUnit: number;
  idProductionUnit: number;
  outsourceTypeID: number;
  fileName: string;
  isFile: number;
  reasonRejection: string;
  planStatusCode: string;

  // Actual
  startTimeActual: string;
  endTimeActual: string;
  outsourceTypeNameActual: string;
  mmosActual: number;
  baNumberActual: number;
  devNumberActual: number;
  devMobileNumberActual: number;
  testNumberActual: number;
  requireBAActual: string;
  requireDevActual: string;
  requireDevMobileActual: string;
  requireTestActual: string;
  descriptionActual: string;
  productUnitActual: string;
  businessUnitActual: string;
}
