import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Trang bạn tìm không tồn tại.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
