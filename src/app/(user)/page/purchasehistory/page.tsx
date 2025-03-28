"use client";

import React, { useEffect, useState, useContext } from "react";
import { Typography, Spin, Alert, Image, Tooltip } from "antd";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import {
  Package,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShoppingBag,
  User,
  Phone,
  MailIcon,
} from "lucide-react";

const { Title, Text } = Typography;

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  image: string;
}

interface Order {
  _id: string;
  amount: number;
  status: string;
  createdAt?: string;
  paymentMethod: string;
  isPaid: boolean;
  shippingAddress: string;
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  productId?: string;
  product?: Product;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Order[];
}

const OrderStatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-medium uppercase 
        inline-flex items-center 
        ${getStatusStyle()}
        border
        ml-2
      `}
    >
      {status}
    </span>
  );
};

const PurchaseHistory: React.FC = () => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [productDetails, setProductDetails] = useState<{
    [key: string]: Product;
  }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!accessToken) {
        setError("Please log in to view order history");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await sendRequest<ApiResponse>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (res.data && res.data.length > 0) {
          const productDetailsMap: { [key: string]: Product } = {};

          const productDetailPromises = res.data.map(async (order) => {
            if (order.productId) {
              try {
                const productRes = await sendRequest<{ data: Product }>({
                  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${order.productId}`,
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                });

                if (productRes.data) {
                  productDetailsMap[order.productId] = productRes.data;
                }
              } catch (productError) {
                console.error(
                  `Error fetching product ${order.productId}:`,
                  productError
                );
              }
            }
          });

          await Promise.all(productDetailPromises);

          setProductDetails(productDetailsMap);
          setOrders(res.data);
        } else {
          setError("No orders found");
        }
      } catch (err: any) {
        console.error("Fetch Orders Error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load order list"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-100">
      <header className="mb-8 text-center">
        <Title
          level={1}
          className="
            text-4xl 
            font-extrabold 
            text-transparent 
            bg-clip-text 
            bg-gradient-to-r 
            from-blue-600 
            to-purple-600 
            mb-4
            tracking-tight
          "
        >
          PURCHASE HISTORY
        </Title>
        <p className="text-gray-600 max-w-xl mx-auto text-base">
          Details of your completed orders. Check the status, payment, and
          shipping information for each order.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Notification"
          description={error}
          type="error"
          showIcon
        />
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const product = order.productId
              ? productDetails[order.productId]
              : undefined;

            return (
              <div
                key={order._id}
                className="
                  bg-white 
                  shadow-lg 
                  rounded-xl 
                  border 
                  border-gray-200 
                  overflow-hidden 
                  transition 
                  hover:shadow-xl
                "
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3 truncate">
                      <Package className="text-blue-600 w-6 h-6 flex-shrink-0" />
                      <div className="truncate">
                        <Text
                          strong
                          className="
                            text-lg 
                            text-gray-800 
                            block 
                            truncate 
                            max-w-[250px] 
                            sm:max-w-full
                          "
                        >
                          Order ID: #{order._id.slice(-8)}
                        </Text>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Text
                        strong
                        className="text-xl text-green-600 block mb-1 whitespace-nowrap"
                      >
                        {order.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </Text>
                      <div className="text-sm text-gray-500 flex items-center justify-end space-x-2 whitespace-nowrap">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Date Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4 border-t pt-4 border-gray-100">
                    {/* Product Details Column */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                        <Text strong>Product Information</Text>
                      </div>
                      {product ? (
                        <div className="flex items-center space-x-4">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.productName}
                              className="w-24 h-24 object-cover rounded"
                              preview={true}
                            />
                          ) : (
                            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                              <ShoppingBag className="w-12 h-12 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <Text
                              strong
                              className="block truncate max-w-[200px]"
                            >
                              {product.productName}
                            </Text>
                            <p className="text-gray-500 whitespace-nowrap">
                              Price:{" "}
                              {product.productPrice.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-gray-500">
                          <ShoppingBag className="w-5 h-5" />
                          <Text type="secondary">Product not available</Text>
                        </div>
                      )}
                    </div>

                    {/* Payment Information Column */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <Text strong>Payment Information</Text>
                      </div>
                      <div className="space-y-1 text-gray-700">
                        <p className="truncate">
                          <span className="text-gray-500">Method: </span>
                          {order.paymentMethod}
                        </p>
                        <p>
                          <span className="text-gray-500">Status: </span>
                          {order.isPaid ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" /> Paid
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="w-4 h-4 mr-1" /> Not Paid
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Information Column */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <Text strong>Shipping Information</Text>
                      </div>
                      <div className="space-y-1 text-gray-700">
                        <p className="flex items-center truncate">
                          <User className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-500 mr-1">Name:</span>
                          {order.fullName || "Unknown"}
                        </p>
                        <Tooltip
                          title={order.emailAddress || "No email provided"}
                        >
                          <p className="flex items-center truncate">
                            <MailIcon className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-500 mr-1">Email:</span>
                            {order.emailAddress || "N/A"}
                          </p>
                        </Tooltip>
                        <p className="flex items-center truncate">
                          <Phone className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-500 mr-1">Phone:</span>
                          {order.phoneNumber || "N/A"}
                        </p>
                        <p className="flex items-center truncate">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-500 mr-1">Address:</span>
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <AlertTriangle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <p className="text-xl text-gray-600">You have no orders yet.</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
