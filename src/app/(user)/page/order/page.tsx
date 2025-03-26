"use client";

import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Radio,
  Card,
  Typography,
  Space,
  notification,
  Spin,
} from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { AuthContext } from "@/context/AuthContext";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

// Detailed type definitions
interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: "COD" | "VNPAY";
}

interface OrderSubmissionData extends OrderFormData {
  userId: string;
  items: OrderItem[];
  totalPrice: number;
}

interface ApiResponse {
  statusCode: number;
  data?: any;
  message?: string;
}

interface IRequest {
  url: string;
  method: string;
  headers?: { [key: string]: string };
  body?: { [key: string]: any };
}

const OrderPage: React.FC = () => {
  const [form] = Form.useForm<OrderFormData>();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Currency formatter for consistent price display
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Helper method to format price with two decimal places
  const formatPrice = (price: number) => {
    return Math.round(price * 100) / 100;
  };

  if (!authContext) {
    return <p className="text-red-500 text-center">Authentication error!</p>;
  }

  const { accessToken, user } = authContext;

  // Fetch products
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
      notification.error({
        message: "Failed to load products",
        description: "Please try again later",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine cart with product details
  useEffect(() => {
    if (cart.length && products.length) {
      const enrichedCart = cart
        .map((cartItem) => {
          const product = products.find((p) => p._id === cartItem.productId);
          if (product) {
            return {
              ...cartItem,
              productName: product.productName,
              price: product.productPrice,
              image: product.image,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      setCart(enrichedCart);
    }
  }, [products]);

  // Load cart data and fetch products
  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: OrderItem[] = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
      }
    }

    fetchProducts();
  }, [accessToken, user?._id]);

  // Calculate total price
  const getTotalPrice = () => {
    return formatPrice(
      cart.reduce(
        (total, item) => total + (item.quantity || 0) * (item.price || 0),
        0
      )
    );
  };

  // Calculate total items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Handle order submission
  const handleSubmitOrder = async (values: OrderFormData) => {
    if (!accessToken || !user?._id) {
      notification.error({
        message: "Authentication Error",
        description: "Please log in to complete your order",
      });
      return;
    }

    // Validate cart is not empty
    if (cart.length === 0) {
      notification.error({
        message: "Empty Cart",
        description:
          "Your cart is empty. Please add items before placing an order.",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData: OrderSubmissionData = {
        ...values,
        userId: user._id,
        items: cart,
        totalPrice: getTotalPrice(),
      };

      const requestPayload: IRequest = {
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: orderData,
      };

      const response = await sendRequest<ApiResponse>(requestPayload);

      if (response.statusCode === 201) {
        notification.success({
          message: "Order Placed Successfully",
          description: "Your order has been processed.",
          placement: "bottomRight",
        });

        // Clear cart after successful order
        sessionStorage.removeItem("cart");
        router.push("/page/order-confirmation");
      } else {
        notification.error({
          message: "Order Failed",
          description:
            response.message ||
            "Unable to process your order. Please try again.",
          placement: "bottomRight",
        });
      }
    } catch (error) {
      console.error("Order submission error:", error);
      notification.error({
        message: "Order Error",
        description: "An unexpected error occurred. Please try again.",
        placement: "bottomRight",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Title level={2} className="text-center mb-6">
          Complete Your Order
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Details Form */}
          <div className="md:col-span-2">
            <Card>
              <Form<OrderFormData>
                form={form}
                layout="vertical"
                onFinish={handleSubmitOrder}
                requiredMark={false}
              >
                <Title level={4}>Shipping Information</Title>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: "Please enter your full name" },
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Your full name"
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Phone number must be 10-11 digits",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Your phone number"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Your email address"
                  />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Shipping Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your shipping address",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter your complete shipping address"
                  />
                </Form.Item>

                <Title level={4}>Payment Method</Title>
                <Form.Item
                  name="paymentMethod"
                  rules={[
                    {
                      required: true,
                      message: "Please select a payment method",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="COD">
                      <Space>
                        <CreditCardOutlined /> Cash on Delivery (COD)
                      </Space>
                    </Radio>
                    <Radio value="VNPAY">
                      <Space>
                        <CreditCardOutlined /> VNPAY Online Payment
                      </Space>
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    icon={<ShoppingCartOutlined />}
                    disabled={cart.length === 0}
                  >
                    Place Order
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card>
              <Title level={4}>Order Summary</Title>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center">
                          <img
                            src={item.image || "/default-image.jpg"}
                            alt={item.productName || "Product"}
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                          <div>
                            <Text strong>
                              {item.productName || "Unknown Product"}
                            </Text>
                            <div className="text-gray-500">
                              {item.quantity} x ${formatPrice(item.price || 0)}
                            </div>
                          </div>
                        </div>
                        <Text strong>
                          $
                          {formatPrice(
                            (item.quantity || 0) * (item.price || 0)
                          )}
                        </Text>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <Text>Subtotal ({getTotalItems()} items)</Text>
                      <Text strong>${formatPrice(getTotalPrice())}</Text>
                    </div>
                    <div className="flex justify-between mb-2">
                      <Text>Shipping</Text>
                      <Text strong>Free</Text>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <Text>Total</Text>
                      <Text strong>${formatPrice(getTotalPrice())}</Text>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
