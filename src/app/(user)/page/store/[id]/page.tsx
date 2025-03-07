"use client";

import React, { useState, useEffect, useContext } from "react";
import { Button, Input, Modal, Spin, notification } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UploadProduct from "@/components/modal/modal.add.product";
import EditProduct from "@/components/modal/modal.edit.product";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

const { confirm } = Modal;

const StorePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p className="text-red-500 text-center">Authentication error!</p>;
  }

  const { accessToken, user } = authContext;

  useEffect(() => {
    fetchProducts();
  }, [accessToken, user?._id]);

  const fetchProducts = async () => {
    if (!accessToken || !user?._id) return;

    setLoading(true);
    try {
      const res = await sendRequest<{ statusCode: number; data: any[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/user/${user._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.statusCode === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const res = await sendRequest<{
            statusCode: number;
            message: string;
          }>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (res.statusCode === 200) {
            notification.success({ message: "Product deleted successfully!" });
            fetchProducts();
          } else {
            notification.error({
              message: res.message || "Failed to delete product.",
            });
          }
        } catch {
          notification.error({
            message: "An error occurred while deleting the product.",
          });
        }
      },
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <Input
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 border p-2 rounded-lg shadow-sm"
          prefix={<SearchOutlined className="text-gray-500" />}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
        >
          Add Product
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products
              .filter((product) =>
                (product.productName || "")
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={product.image || "/default-image.jpg"}
                    alt={product.productName}
                    className="w-40 h-40 object-cover rounded-lg mb-4"
                  />
                  <span className="text-lg font-semibold text-gray-800 text-center">
                    {product.productName}
                  </span>
                  <span className="text-blue-600 text-sm font-medium mt-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.productPrice)}
                  </span>
                  <span className="text-gray-500 text-xs mt-1">
                    {product.productCategory}
                  </span>

                  <div className="flex gap-2 mt-3 w-full">
                    <Button
                      type="default"
                      className="border rounded-md flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <EditOutlined /> Edit
                    </Button>
                    <Button
                      type="default"
                      danger
                      className="border rounded-md flex-1"
                      onClick={() => handleDelete(product._id)}
                    >
                      <DeleteOutlined /> Delete
                    </Button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products available.
            </p>
          )}
        </div>
      )}

      <Modal
        title="Upload Product"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <UploadProduct
          isEditMode={false}
          editingProduct={null}
          onClose={() => setIsModalOpen(false)}
          onProductUpdated={fetchProducts}
        />
      </Modal>

      <Modal
        title="Edit Product"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <EditProduct
          product={editingProduct}
          onClose={() => setIsEditModalOpen(false)}
          refreshProducts={fetchProducts}
        />
      </Modal>
    </div>
  );
};

export default StorePage;
