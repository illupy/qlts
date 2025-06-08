import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

const generateColor = (index: number) => {
  const hue = (index * 137.508) % 360; // sử dụng số vàng để phân bố đều màu
  return `hsl(${hue}, 70%, 60%)`;
};

interface RawItem {
  groupId?: string;
  typeName?: string;
  count: string;
}

interface ProcessedItem {
  name: string;
  percentage: number;
}

const calculatePercentage = (
  items: RawItem[],
  key: "groupId" | "typeName"
): ProcessedItem[] => {
  const total = items.reduce((sum, item) => sum + parseInt(item.count, 10), 0);
  return items.map((item) => ({
    name: item[key] || "Unknown",
    percentage: Math.round((parseInt(item.count, 10) / total) * 100),
  }));
};

const ProductRatioPies = () => {
  const [groupData, setGroupData] = useState<ProcessedItem[]>([]);
  const [typeData, setTypeData] = useState<ProcessedItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/barchart");
        if (res.data.status === "success") {
          const rawGroup = res.data.data.byGroup;
          const rawType = res.data.data.byType;

          setGroupData(calculatePercentage(rawGroup, "groupId"));
          setTypeData(calculatePercentage(rawType, "typeName"));
        }
      } catch (err) {
        console.error("Failed to fetch pie chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Group Pie */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Tỉ trọng theo nhóm hàng hóa
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={groupData}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              isAnimationActive={true}
              stroke="#fff"
            >
              {groupData.map((_, index) => (
                <Cell key={`cell-group-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Type Pie */}
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Tỉ trọng theo loại tài sản
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={typeData}
              dataKey="percentage"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              startAngle={90}
              endAngle={-270}
              labelLine={false}
              isAnimationActive={true}
              stroke="#fff"
            >
              {typeData.map((_, index) => (
                <Cell key={`cell-type-${index}`} fill={generateColor(index)} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductRatioPies;
