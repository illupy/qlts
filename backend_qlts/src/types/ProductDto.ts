import {
  ProductType,
  ProductGroup,
  ProductStatus,
} from "../constant/AppConstant";
import { Partner } from "../entity/Partner";

export interface ProductDto {
  id: number;
  productCode: string;
  productName: string;
  productType: ProductType;
  productGroup: ProductGroup;
  assetTypeId: {
    id: number;
    assetType: string;
  };
  assetFlowId: {
    id: number;
    assetFlow: string;
  };
  unitId: {
    id: number;
    unit: string;
  };
  status: ProductStatus;
  note?: string;
  partners: {
    id: number;
    code: string;
    name: string;
  }[];
}
export interface CreateProductDto {
  productCode?: string;
  productName: string;
  productType: ProductType;
  productGroup: ProductGroup;
  assetTypeId: number;
  assetFlowId: number;
  unitId: number;
  status?: ProductStatus;
  note?: string;
  partnerIds: number[];
}

export interface UpdateProductDto {
  productCode?: string;
  productName?: string;
  productType?: ProductType;
  productGroup?: ProductGroup;
  assetTypeId?: number;
  assetFlowId?: number;
  unitId?: number;
  status?: ProductStatus;
  note?: string;
  partnerIds?: number[];
}
