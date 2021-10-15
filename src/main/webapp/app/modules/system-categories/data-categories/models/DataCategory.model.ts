import { DataCategoryTypeModel } from "app/modules/system-categories/data-categories/models/DataCategoryType.model";

export class DataCategoryModel {
  id: number;
  code: string;
  name: string;
  type: number;
  paramName: string;
  description: string;
  note: string;
  constructor() {}
}
