import { AssetGroupStatus } from "../constant/AppConstant";

export interface AssetGroupDto {
  id: number;
  groupCode: string;
  groupName: string;
  status: AssetGroupStatus;
  note?: string;
}
export interface CreateAssetGroupDto {
  groupCode?: string;
  groupName: string;
  status?: AssetGroupStatus;
  note?: string;
}
