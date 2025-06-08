import { AssetFlowStatus } from "../constant/AppConstant";

export interface AssetFlowDto {
  id: number;
  flowCode: string;
  flowName: string;
  status: AssetFlowStatus;
  note?: string;
}
export interface CreateAssetFlowDto {
  flowCode?: string;
  flowName: string;
  status?: AssetFlowStatus;
  note?: string;
}
