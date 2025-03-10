"use client";

import React, { useState, useContext } from "react";
import { Modal, Input, Button, message } from "antd";
import { AuthContext } from "@/context/AuthContext";

const EditShop = ({
  shop,
  onClose,
  refreshShop = () => {},
}: {
  shop?: {
    _id: string;
    shopName: string;
    taxCode: string;
    shopBrandsAddress: string;
    shopDescription: string;
  };
  onClose: () => void;
  refreshShop?: () => void;
}) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [formData, setFormData] = useState({
    shopName: shop?.shopName || "",
    taxCode: shop?.taxCode || "",
    shopBrandsAddress: shop?.shopBrandsAddress || "",
    shopDescription: shop?.shopDescription || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!accessToken || !user?._id) {
      message.error("User ID or access token not found. Please log in again.");
      return;
    }

    if (
      !formData.shopName ||
      !formData.taxCode ||
      !formData.shopBrandsAddress ||
      !formData.shopDescription
    ) {
      message.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/editShop/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            shopName: formData.shopName,
            taxCode: formData.taxCode,
            shopBrandsAddress: formData.shopBrandsAddress,
            shopDescription: formData.shopDescription,
          }),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData?.message || "Failed to update shop information."
        );
      }

      message.success("Shop updated successfully!");
      refreshShop(); // Cập nhật lại dữ liệu shop
      onClose(); // Đóng Modal sau khi lưu thành công
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input
        name="shopName"
        placeholder="Shop Name"
        value={formData.shopName}
        onChange={handleChange}
        style={{ marginBottom: 10 }}
      />
      <Input
        name="taxCode"
        placeholder="Tax Code"
        value={formData.taxCode}
        onChange={handleChange}
        style={{ marginBottom: 10 }}
      />
      <Input
        name="shopBrandsAddress"
        placeholder="Shop's Brand Address"
        value={formData.shopBrandsAddress}
        onChange={handleChange}
        style={{ marginBottom: 10 }}
      />
      <Input.TextArea
        name="shopDescription"
        placeholder="Shop Description"
        value={formData.shopDescription}
        onChange={handleChange}
        style={{ marginBottom: 10 }}
        rows={4}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          loading={loading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditShop;
