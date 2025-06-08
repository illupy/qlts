export type PaginateRequest = {
  page: number;
  pageSize: number;
};

export interface PaginateInfo<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// AssetGroupPaginateRequest is used to filter asset groups based on group code, group name, and status
export interface AssetGroupPaginateRequest extends PaginateRequest {
  searchGroupCode?: string;
  searchGroupName?: string;
  searchStatus?: string;
  searchNote?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
export interface AssetTypePaginateRequest extends PaginateRequest {
  searchTypeCode?: string;
  searchTypeName?: string;
  searchGroupName?: string;
  searchManagementType?: string;
  searchStatus?: string;
  searchNote?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
export interface AssetFlowPaginateRequest extends PaginateRequest {
  searchFlowCode?: string;
  searchFlowName?: string;
  searchStatus?: string;
  searchNote?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
export interface PartnerPaginateRequest extends PaginateRequest {
  searchCode?: string;
  searchName?: string;
  searchStatus?: string;
  searchNote?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
export interface ProductPaginateRequest extends PaginateRequest {
  searchProductCode?: string;
  searchProductName?: string;
  searchProductType?: string;
  searchProductGroup?: string;
  searchAssetType?: string;
  searchAssetFlow?: string;
  searchUnit?: string;
  searchPartner?: number[];
  searchStatus?: string;
  searchNote?: string;
  orderBy?: string;
  orderDirection?: "ASC" | "DESC";
}
