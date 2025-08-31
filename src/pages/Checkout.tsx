import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const Checkout: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product } = state || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const orderData = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brandName: product.brandName,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize,
          category: product.category
        },
        userInfo: formData,
        paymentMethod
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error(`Failed to create order: ${response.statusText}`);

      const result = await response.json();
      toast.success("Order placed successfully!");

      // Notify AdminDashboard to update
      window.localStorage.setItem("ordersUpdated", Date.now().toString());

      navigate('/order-success', {
        state: {
          orderId: result.order.orderId,
          product,
          formData,
          paymentMethod,
        },
      });
    } catch (error: any) {
      toast.error(`Failed to place order: ${error.message}`);
    }
  };

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      >
        <p className="text-white text-xl font-semibold drop-shadow-md">No product selected.</p>
      </motion.div>
    );
  }

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <style>
        {`
          @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .gradient-text {
            background: linear-gradient(45deg, rgb(255, 193, 7), rgb(0, 184, 212), rgb(255, 87, 34), rgb(255, 193, 7));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientText 5s ease-in-out infinite;
          }
          .gradient-text-desc {
            background: linear-gradient(45deg, rgb(255, 245, 157), rgb(128, 222, 234), rgb(255, 171, 145), rgb(255, 245, 157));
            background-size: 200% 200%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: gradientText 7s ease-in-out infinite;
          }
        `}
      </style>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gradient-to-r from-amber-600 via-rose-600 to-blue-600 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="text-white hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <motion.h1
              className="text-2xl font-bold gradient-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              URBAN LUXURY
            </motion.h1>
          </motion.div>
        </div>
      </motion.header>

      {/* Main */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-12"
      >
        <Card className="w-full max-w-2xl mx-auto bg-slate-800/90 border-amber-500/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold gradient-text text-center">Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-white font-semibold mb-4 drop-shadow-sm">Product Details</h3>
                <div className="flex space-x-4">
                  <img 
                    src={product.image || fallbackImage} 
                    alt={product.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                      console.warn(`Failed to load image for ${product.name}: ${product.image}`);
                    }}
                  />
                  <div className="text-white">
                    <h4 className="font-semibold drop-shadow-sm">{product.name}</h4>
                    <p className="text-slate-200 drop-shadow-sm">{product.brandName}</p>
                    <p className="text-slate-200 drop-shadow-sm">Color: {product.selectedColor}</p>
                    <p className="text-slate-200 drop-shadow-sm">Size: {product.selectedSize}</p>
                    <p className="text-amber-400 font-bold drop-shadow-sm">₹{product.price}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-white font-semibold mb-4 drop-shadow-sm">Delivery Information</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-white drop-shadow-sm">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none focus:ring-amber-500 focus:ring-2"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="upi">UPI Payment</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    Place Order
                  </Button>
                </form>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Checkout;