"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Input,
  Modal,
  Spin,
  notification,
  Select,
  Dropdown,
  Menu,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  MoreOutlined,
  ProductOutlined,
  ShopOutlined, // Added for Edit Shop button icon
} from "@ant-design/icons";
import UploadProduct from "@/components/modal/modal.add.product";
import EditProduct from "@/components/modal/modal.edit.product";
import EditShop from "@/components/modal/modal.edit.shop.infor";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

const { confirm } = Modal;
const { Option } = Select;

const StorePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditShopModalOpen, setIsEditShopModalOpen] = useState(false); // State for Edit Shop modal
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [shopData, setShopData] = useState<any>(null); // State to store shop data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <p className="text-red-500 text-center">Authentication error!</p>;
  }

  const { accessToken, user } = authContext;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchShopData();
  }, [accessToken, user?._id]);

  const fetchCategories = async () => {
    if (!accessToken || !user?._id) return;

    try {
      const res = await sendRequest<{ statusCode: number; data: any[] }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-for-products`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.statusCode === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const fetchShopData = async () => {
    if (!accessToken || !user?._id) return;

    try {
      const res = await sendRequest<{ statusCode: number; data: any }>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/shop/${user._id}`,
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.statusCode === 200) {
        setShopData(res.data);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
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
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );

        try {
          await sendRequest({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}`,
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      },
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = (product.productName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.productCategory === selectedCategory;

    return matchesSearchQuery && matchesCategory;
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1
        className="text-4xl font-bold text-center mb-6 text-transparent 
             bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          letterSpacing: "2px",
        }}
      >
        My Store
      </h1>

      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <Input
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3 border p-2 rounded-lg shadow-sm"
          prefix={<SearchOutlined className="text-gray-500" />}
        />
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          className="w-1/4"
        >
          <Option value={undefined}>All</Option>
          {categories.map((category) => (
            <Option key={category._id} value={category.categoryProductName}>
              {category.categoryProductName}
            </Option>
          ))}
        </Select>
        <div className="Cart">
          <ProductOutlined />
          <span className="text-gray-500 ml-2">
            Current product quantity ({products.length})
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2"
          >
            New Product
          </Button>
          <Button
            type="default"
            icon={<ShopOutlined />}
            onClick={() => setIsEditShopModalOpen(true)} // Open Edit Shop modal
            className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg px-4 py-2"
          >
            Edit Shop
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative"
            >
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="edit"
                      onClick={() => handleEdit(product)}
                      icon={<EditOutlined />}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      key="delete"
                      onClick={() => handleDelete(product._id)}
                      icon={<DeleteOutlined />}
                      danger
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <MoreOutlined className="absolute top-3 right-3 text-xl cursor-pointer" />
              </Dropdown>
              <img
                src={product.image || "/default-image.jpg"}
                alt={product.productName}
                className="w-40 h-40 object-cover rounded-lg mb-4"
              />
              <span className="text-lg font-semibold text-gray-800 text-center">
                {product.productName}
              </span>
              <span className="text-gray-500 text-xs mt-1">
                {product.productDescription}
              </span>
              <span className="text-green-600 text-sm font-medium mt-1">
                ${product.productPrice}
              </span>
              <div className="flex gap-2 mt-3 w-full">
                {/* <Button className="flex-1" icon={<DollarCircleOutlined />}>
                  Buy Now
                </Button>
                <Button
                  type="default"
                  className="flex-1"
                  icon={<ShoppingCartOutlined />}
                >
                  Add to Cart
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg font-semibold py-10">
          Not Found
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
      <Modal
        title="Edit Shop"
        open={isEditShopModalOpen}
        onCancel={() => setIsEditShopModalOpen(false)}
        footer={null}
      >
        <EditShop
          shop={shopData}
          onClose={() => setIsEditShopModalOpen(false)}
          refreshShop={fetchShopData}
        />
      </Modal>
    </div>
  );
};

export default StorePage;
