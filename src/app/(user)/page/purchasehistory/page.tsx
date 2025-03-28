"use client";

import React, { useEffect, useState, useContext } from "react";
import { Typography, Spin, Alert, Image, Tooltip, Badge } from "antd";
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
  products?: OrderProduct[];
}

interface OrderProduct {
  productId: string;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: Order[];
}

// OrderStatusBadge Component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "processing";
      case "completed":
        return "success";
      case "shipped":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "refunded":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Badge
      status={getStatusColor(status)}
      text={status.charAt(0).toUpperCase() + status.slice(1)}
      className="order-status-badge"
    />
  );
};

const PurchaseHistory: React.FC = () => {
  const { accessToken } = useContext(AuthContext) ?? {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
          // Fetch products for each order
          const ordersWithProducts = await Promise.all(
            res.data.map(async (order) => {
              try {
                const productsRes = await sendRequest<{ data: OrderProduct[] }>(
                  {
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/${order._id}/products`,
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  }
                );

                return {
                  ...order,
                  products: productsRes.data || [],
                };
              } catch (productError) {
                console.error(
                  `Error fetching products for order ${order._id}:`,
                  productError
                );
                return order;
              }
            })
          );

          setOrders(ordersWithProducts);
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

  const renderProductColumn = (order: Order) => {
    const products = order.products || [];

    return (
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <ShoppingBag className="w-5 h-5 text-green-600" />
          <Text strong>Product Information</Text>
          <Text className="text-gray-500 ml-2">({products.length} items)</Text>
        </div>
        {products.length > 0 ? (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {products.map((product, index) => (
              <div
                key={`${product.productId}-${index}`}
                className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
              >
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
                  <Text strong className="block truncate max-w-[300px]">
                    {product.productName}
                  </Text>
                  <p className="text-gray-500 whitespace-nowrap">
                    Price:{" "}
                    {product.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className="text-gray-500">Quantity: {product.quantity}</p>
                  <p className="text-gray-500 font-semibold">
                    Subtotal:{" "}
                    {(product.price * product.quantity).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-gray-500">
            <ShoppingBag className="w-5 h-5" />
            <Text type="secondary">No products in this order</Text>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-100">
      <div className="mb-8">
        <Title level={2} className="text-gray-800 mb-2">
          Purchase History
        </Title>
        <Text className="text-gray-600">
          View and manage all of your previous orders
        </Text>
      </div>

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
          {orders.map((order) => (
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
                  {renderProductColumn(order)}

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
          ))}
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
