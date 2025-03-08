"use client";
import React, { useState, useContext } from "react";
import { Button, Input, notification, Modal } from "antd";
import { sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
}

interface EditProductProps {
  product: Product;
  onClose: () => void;
  refreshProducts: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({
  product,
  onClose,
  refreshProducts,
}) => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [name, setName] = useState(product?.productName || "");
  const [price, setPrice] = useState(product?.productPrice.toString() || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!accessToken) {
      notification.error({
        message: "You are not logged in. Please log in again.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = (await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${product._id}`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { productName: name, productPrice: parseFloat(price) },
      })) as { statusCode: number; message?: string };

      if (res.statusCode === 200) {
        notification.success({ message: "Product updated successfully!" });
        refreshProducts();
        onClose();
      } else {
        notification.error({ message: res.message || "Update failed." });
      }
    } catch {
      notification.error({ message: "Error updating product." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Product</h2>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="mb-3 p-2 border rounded-lg w-full"
      />
      <Input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Product Price"
        className="mb-3 p-2 border rounded-lg w-full"
      />
      <div className="flex justify-end gap-2">
        <Button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-black rounded-lg px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          loading={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditProduct;
