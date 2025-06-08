import { AssetTypeStatus, ManagementType } from "../constant/AppConstant";
import { AssetGroupDto } from "./AssetGroupDto";

export interface AssetTypeDto {
  id: number;
  typeCode: string;
  typeName: string;
  groupName: string;
  managementType: ManagementType;
  status: AssetTypeStatus;
  note?: string;
}
export interface AssetTypeSave {
  id: number;
  typeCode: string;
  typeName: string;
  groupId: AssetGroupDto;
  managementType: ManagementType;
  status: AssetTypeStatus;
  note?: string;
}
export interface CreateAssetTypeDto {
  typeCode: string;
  typeName: string;
  groupId: number;
  managementType: ManagementType;
  status?: AssetTypeStatus;
  note?: string;
}