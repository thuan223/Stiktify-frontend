import React, { useState, useEffect, useContext } from "react";
import { notification, Select } from "antd";
import { sendRequestFile, sendRequest } from "@/utils/api";
import { AuthContext } from "@/context/AuthContext";

interface ICategory {
  _id: string;
  categoryProductName: string;
}

interface UploadProductProps {
  isEditMode: boolean;
  editingProduct: any;
  onClose: () => void;
  onProductUpdated: () => void;
}

const UploadProduct: React.FC<UploadProductProps> = ({
  isEditMode,
  editingProduct,
  onClose,
  onProductUpdated,
}) => {
  const { accessToken, user } = useContext(AuthContext) ?? {};
  const userId = user?._id || user?.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!accessToken) return;
      try {
        const res = await sendRequest<{
          statusCode: number;
          data: ICategory[];
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category-for-products`,
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.statusCode === 200) {
          setCategories(res.data);
        } else {
          notification.error({ message: "Failed to fetch categories." });
        }
      } catch {
        notification.error({
          message: "An error occurred while retrieving categories.",
        });
      }
    };

    fetchCategories();

    if (isEditMode && editingProduct) {
      setName(editingProduct.productName);
      setDescription(editingProduct.productDescription || "");
      setPrice(editingProduct.productPrice.toString());
      setStock(editingProduct.stock.toString());
      setCategory(editingProduct.productCategory);
    }
  }, [accessToken, isEditMode, editingProduct]);

  const validateInputs = () => {
    if (!name.trim()) {
      notification.error({ message: "Product name is required." });
      return false;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      notification.error({ message: "Price must be a positive number." });
      return false;
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) <= 0) {
      notification.error({ message: "Stock must be a non-negative number." });
      return false;
    }
    if (!category) {
      notification.error({ message: "Please select a product category." });
      return false;
    }
    if (!isEditMode && !image) {
      notification.error({ message: "Please upload an image." });
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleUpload = async () => {
    if (!accessToken) {
      notification.error({
        message: "You are not logged in. Please log in again.",
      });
      return;
    }

    if (!validateInputs()) return;

    setLoading(true);
    try {
      let imageUrl = editingProduct?.image || null;
      if (image) {
        const uploadImageForm = new FormData();
        uploadImageForm.append("file", image);
        uploadImageForm.append("folder", "products");

        const imageUploadRes = await sendRequestFile<{
          statusCode: number;
          data: string;
        }>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload/upload-image`,
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: uploadImageForm,
        });

        if (imageUploadRes.statusCode === 201) {
          imageUrl = imageUploadRes.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const productData = {
        userId,
        productName: name,
        productDescription: description,
        productCategory: category,
        productPrice: Number(price),
        stock: Number(stock),
        image: imageUrl,
      };

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${editingProduct._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`;
      const method = isEditMode ? "PUT" : "POST";

      const postRes = await sendRequest<{
        statusCode: number;
        message: string;
      }>({
        url,
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        body: productData,
      });

      if (postRes.statusCode === 200 || postRes.statusCode === 201) {
        notification.success({
          message: isEditMode
            ? "Product updated successfully!"
            : "Product added successfully!",
        });
        onProductUpdated();
        onClose();
      } else {
        notification.error({
          message: postRes.message || "Product upload failed.",
        });
      }
    } catch {
      notification.error({ message: "An error occurred during upload." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Product Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Choose Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Category</label>
        <Select
          placeholder="Select Category"
          style={{ width: "100%" }}
          value={category || undefined}
          onChange={setCategory}
        >
          {categories.map((category) => (
            <Select.Option
              key={category._id}
              value={category.categoryProductName}
            >
              {category.categoryProductName}
            </Select.Option>
          ))}
        </Select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded mt-4"
      >
        {loading ? "Saving..." : isEditMode ? "Save Changes" : "Add Product"}
      </button>
    </div>
  );
};

export default UploadProduct;
