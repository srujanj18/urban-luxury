
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from "sonner";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmOrder = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error("Please fill in all delivery details");
      return;
    }

    toast.success("Order Confirmed!");
    navigate('/order-success', { state: { product, formData, paymentMethod } });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-white">No product selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="ghost" 
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{product.name}</h3>
                  <p className="text-slate-300">{product.brandName}</p>
                  <p className="text-slate-300">Color: {product.selectedColor}</p>
                  <p className="text-slate-300">Size: {product.selectedSize}</p>
                  <p className="text-amber-500 font-bold text-lg">{product.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter your complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-white">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4">
                <Label className="text-white font-semibold">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" className="border-slate-600" />
                    <Label htmlFor="upi" className="text-white">UPI Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cod" id="cod" className="border-slate-600" />
                    <Label htmlFor="cod" className="text-white">Cash on Delivery</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handleConfirmOrder}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 text-lg"
              >
                Confirm Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
