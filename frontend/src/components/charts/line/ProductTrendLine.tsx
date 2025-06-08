import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

const getRecentYears = (count: number): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => currentYear - i).reverse();
};

interface ApiResponseItem {
  month: number;
  count: number;
}

interface ChartItem {
  month: string; // eg. 'Tháng 1'
  quantity: number;
}

const ProductTrendLine = () => {
  const [data, setData] = useState<ChartItem[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const years = getRecentYears(5);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const res = await api.get(`/dashboard/linechart?year=${year}`);
        if (res.data.status === "success") {
          const raw: ApiResponseItem[] = res.data.data;
          const formatted: ChartItem[] = raw.map((item) => ({
            month: `Tháng ${item.month}`,
            quantity: item.count,
          }));
          setData(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch line chart data:", err);
      }
    };

    fetchTrendData();
  }, [year]);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Biến động theo tháng</h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductTrendLine;
