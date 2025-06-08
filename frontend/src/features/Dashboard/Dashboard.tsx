// src/pages/Dashboard.tsx
import ProductBarsGroup from '../../components/charts/bar/ProductBar'; // component gộp 3 biểu đồ cột
import ProductTrendLine from '../../components/charts/line/ProductTrendLine';
import ProductByPartnerBar from '../../components/charts/bar/ProductByPartnerBar';
import ProductRatioPies from '../../components/charts/pie/ProductRatioPies';

const Dashboard = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Row: 3 biểu đồ cột (nhóm, loại, dòng tài sản) */}
      <div className="w-full">
        <ProductBarsGroup />
      </div>

      {/* Row: 2 biểu đồ tròn theo nhóm + loại */}
      <div className="flex flex-col md:flex-row gap-4">
        <ProductRatioPies/>
      </div>

      {/* Row: Biểu đồ đường theo tháng (rộng một mình) */}
      <div className="w-full">
        <ProductTrendLine />
      </div>

      {/* Row: Biểu đồ cột theo đối tác (rộng một mình) */}
      <div className="w-full">
        <ProductByPartnerBar />
      </div>
    </div>
  );
};

export default Dashboard;
