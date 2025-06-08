import { PartnerStatus } from "../constant/AppConstant";

export interface PartnerDto {
  id: number;
  code: string;
  name: string;
  status: PartnerStatus;
  note?: string;
}
export interface CreatePartnerDto {
  code?: string;
  name: string;
  status?: PartnerStatus;
  note?: string;
}
