"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Thêm useRouter từ next/navigation
import { Spin } from "antd";
import { handleGetAllProducts } from "@/actions/product.action";

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Khởi tạo useRouter

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await handleGetAllProducts(1, 10, "");
        console.log("check result", result);
        if (result && result.data && result.data.result) {
          setProducts(result.data.result);
        } else {
          console.error("Invalid result structure:", result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleCardClick = (productId: string) => {
    router.push(`page/product-detail/${productId}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1
        className="text-4xl font-bold text-center mb-8 text-transparent 
                   bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "2px",
        }}
      >
        Sticktify Shop
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCardClick(product._id)} // Thêm sự kiện onClick
            >
              {/* Hình ảnh sản phẩm */}
              <div className="relative w-full h-56">
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
                {product.stock <= 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Hết hàng
                  </span>
                )}
              </div>

              {/* Thông tin sản phẩm */}
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
                  {product.productName}
                </h3>
                <p className="text-gray-500 text-sm mt-1 text-center truncate w-full">
                  {product.productDescription}
                </p>
                <p className="text-indigo-600 text-lg font-bold mt-2">
                  ${product.productPrice}
                </p>

                {/* Nút Add to Cart */}
                <button
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện onClick của card cha
                    if (product.stock <= 0) return;
                    alert(`Added ${product.productName} to cart!`);
                  }}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold py-10">
          Not Found
        </div>
      )}
    </div>
  );
};

export default StorePage;
