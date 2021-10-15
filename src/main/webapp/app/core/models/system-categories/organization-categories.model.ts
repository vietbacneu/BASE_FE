export interface OrganizationCategoriesModel {
  id?: number;
  state?: number;
  group?: string;
  nameGroup?: string;
  orderNumber?: number;
  code?: string;
  name?: string;
  organizationGroup?: number;
  organizationGroupName: string;
  parentId: number;
  dataCategoryId: number;
  parentName?: string;
  description: string;
  note: string;
}
