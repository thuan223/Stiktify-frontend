"use client";

import React, { useState, useEffect, useContext } from "react";
import { Input, Button, message, Typography } from "antd";
import { AuthContext } from "@/context/AuthContext";

const { Title } = Typography;

interface EditShopProps {
  shop?: {
    _id: string;
    shopName: string;
    taxCode: string;
    shopBrandsAddress: string;
    shopDescription: string;
  };
  onClose: () => void;
  refreshShop?: () => void;
}

const EditShop = ({ shop, onClose, refreshShop = () => {} }: EditShopProps) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const [formData, setFormData] = useState({
    shopName: shop?.shopName || "",
    taxCode: shop?.taxCode || "",
    shopBrandsAddress: shop?.shopBrandsAddress || "",
    shopDescription: shop?.shopDescription || "",
  });

  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (shop) {
      setFormData({
        shopName: shop.shopName,
        taxCode: shop.taxCode,
        shopBrandsAddress: shop.shopBrandsAddress,
        shopDescription: shop.shopDescription,
      });
    }
  }, [shop]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsChanged(true);
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
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData?.message || "Failed to update shop information."
        );
      }

      message.success("Shop updated successfully!");
      refreshShop();
      onClose();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
      setIsChanged(false);
    }
  };

  return (
    <div>
      <Title level={4}>Current Shop Information</Title>
      <p style={{ marginBottom: 20 }}></p>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Name:</label>
        <Input
          name="shopName"
          placeholder="Enter shop name"
          value={formData.shopName}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Tax Code:</label>
        <Input
          name="taxCode"
          placeholder="Enter tax code"
          value={formData.taxCode}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Brand Address:</label>
        <Input
          name="shopBrandsAddress"
          placeholder="Enter shop brand address"
          value={formData.shopBrandsAddress}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ fontWeight: "bold" }}>Shop Description:</label>
        <Input.TextArea
          name="shopDescription"
          placeholder="Enter shop description"
          value={formData.shopDescription}
          onChange={handleChange}
          rows={4}
        />
      </div>

      {isChanged && (
        <p style={{ color: "orange" }}>You have unsaved changes!</p>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <Button key="cancel" onClick={onClose} disabled={loading}>
          Close
        </Button>
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!isChanged}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditShop;
