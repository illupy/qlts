export type AssetTypeType = {
  id?: number;
  typeCode: string;
  typeName: string;
  groupName: string; 
  groupId: number;
  managementType: "quantity" | "code";
  status: "active" | "inactive";
  note?: string;
};

export type AssetTypeFormData = {
  id?: number;
  typeCode: string;
  typeName: string;
  groupId: number; 
  managementType: "quantity" | "code";
  status: "active" | "inactive";
  note?: string;
};
