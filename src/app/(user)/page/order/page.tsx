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

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  shippingAddress: string;
  paymentMethod: "COD" | "VNPAY";
}

interface OrderSubmissionData {
  userId: string;
  productId: string;
  amount: number;
  paymentMethod: "COD" | "VNPAY";
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  shippingAddress: string;
}

interface ApiResponse {
  statusCode: number;
  data?: any;
  message?: string;
  paymentUrl?: string;
}

const OrderPage: React.FC = () => {
  const [form] = Form.useForm<OrderFormData>();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Currency formatter
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Helper method to format price
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
              image: product.image, // Lấy hình ảnh từ sản phẩm
            };
          }
          return null;
        })
        .filter((item) => item !== null) as OrderItem[];

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
    // Validate user ID
    if (!user?._id || typeof user._id !== "string") {
      notification.error({
        message: "Invalid User",
        description: "User ID is missing or invalid",
      });
      return;
    }

    // Validate cart and product
    if (cart.length === 0 || !cart[0]?.productId) {
      notification.error({
        message: "Cart Error",
        description: "Please add a valid product to your cart",
      });
      return;
    }

    // Ensure payment method is valid
    if (!["COD", "VNPAY"].includes(values.paymentMethod)) {
      notification.error({
        message: "Payment Method Error",
        description: "Please select a valid payment method",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData: OrderSubmissionData = {
        userId: user._id.toString(),
        productId: cart[0].productId.toString(),
        amount: Number(getTotalPrice()),
        paymentMethod: values.paymentMethod === "COD" ? "COD" : "VNPAY",
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber.trim(),
        emailAddress: values.emailAddress.trim(),
        shippingAddress: values.shippingAddress.trim(),
      };

      const response = await sendRequest<any>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: orderData,
      });

      if (response.statusCode === 201) {
        // Handle different payment methods
        if (values.paymentMethod === "VNPAY" && response.paymentUrl) {
          // Redirect to VNPAY payment URL
          window.location.href = response.paymentUrl;
        } else {
          // For COD or other methods
          notification.success({
            message: "Order Placed Successfully",
            description: "Your order has been processed.",
            placement: "bottomRight",
          });

          // Clear cart after successful order
          sessionStorage.removeItem("cart");
          router.push("/page/order-confirmation");
        }
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
                    {
                      required: true,
                      message: "Please enter your full name",
                    },
                    {
                      type: "string",
                      message: "Full name must be a valid string",
                    },
                    {
                      validator: async (_, value) => {
                        if (!value || value.trim().length < 2) {
                          throw new Error(
                            "Full name must be at least 2 characters"
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Your full name"
                  />
                </Form.Item>

                <Form.Item
                  name="phoneNumber"
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
                  name="emailAddress"
                  label="Email Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Your email address"
                  />
                </Form.Item>

                <Form.Item
                  name="shippingAddress"
                  label="Shipping Address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your shipping address",
                    },
                    {
                      min: 10,
                      message:
                        "Shipping address must be at least 10 characters",
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
                    type="default"
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

          {/* Order Summary Section */}
          <div className="md:col-span-1">
            <Card title="Order Summary">
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center mb-3 space-x-3"
                    >
                      {/* Thêm hình ảnh sản phẩm */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-grow">
                        <Text>{item.productName}</Text>
                        <div className="flex justify-between">
                          <Text type="secondary">x {item.quantity}</Text>
                          <Text strong>
                            {currencyFormatter.format(
                              item.price * item.quantity
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between">
                      <Text>Total Items:</Text>
                      <Text strong>{getTotalItems()}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text>Total Price:</Text>
                      <Text strong>
                        {currencyFormatter.format(getTotalPrice())}
                      </Text>
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
