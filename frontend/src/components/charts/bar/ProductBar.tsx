import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

interface ByGroupItem {
  groupId: string;
  count: number;
}

interface ByTypeItem {
  typeName: string;
  count: number;
}

interface ByFlowItem {
  flowName: string;
  count: number;
}

interface ApiResponse {
  status: string;
  data: {
    byGroup: { groupId: string; count: string }[];
    byType: { typeName: string; count: string }[];
    byFlow: { flowName: string; count: string }[];
  };
}

const ProductBarsGroup = () => {
  const [byGroup, setByGroup] = useState<ByGroupItem[]>([]);
  const [byType, setByType] = useState<ByTypeItem[]>([]);
  const [byFlow, setByFlow] = useState<ByFlowItem[]>([]);

  const fetchData = async () => {
    try {
      const res = await api.get<ApiResponse>("/dashboard/barchart");
      if (res.data.status === "success") {
        setByGroup(
          res.data.data.byGroup.map((item) => ({
            groupId: item.groupId,
            count: parseInt(item.count, 10),
          }))
        );
        setByType(
          res.data.data.byType.map((item) => ({
            typeName: item.typeName,
            count: parseInt(item.count, 10),
          }))
        );
        setByFlow(
          res.data.data.byFlow.map((item) => ({
            flowName: item.flowName,
            count: parseInt(item.count, 10),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch bar chart data:", error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Group + Type */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product By Group */}
        <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Số lượng theo nhóm hàng hóa
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byGroup}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="groupId" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Số lượng nhóm" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product By Type */}
        <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-2">
            Số lượng theo loại tài sản
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="typeName" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Số lượng loại" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Flow */}
      <div className="w-full bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">
          Số lượng theo dòng tài sản
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byFlow}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="flowName" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ffc658" name="Số lượng dòng" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductBarsGroup;
