// src/components/charts/bar/ProductByPartnerBar.tsx
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
import api from "../../../api/axios"; // giống như trong ProductBarsGroup

interface PartnerItem {
  partnerCode: string;
  partnerName: string;
  count: string;
}

interface TransformedItem {
  partner: string;
  quantity: number;
}

interface ApiResponse {
  status: string;
  data: PartnerItem[];
}

const ProductByPartnerBar = () => {
  const [data, setData] = useState<TransformedItem[]>([]);

  const fetchData = async () => {
    try {
      const res = await api.get<ApiResponse>("/dashboard/product-partner");
      if (res.data.status === "success") {
        const transformed = res.data.data.map((item) => ({
          partner: item.partnerName,
          quantity: parseInt(item.count, 10),
        }));
        setData(transformed);
      }
    } catch (error) {
      console.error("Failed to fetch partner chart data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2">
        Số lượng theo đối tác cung cấp
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
        //   barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="partner"
            angle={-30}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="quantity" fill="#FF8042" name="Số lượng sản phẩm" barSize={40}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductByPartnerBar;
