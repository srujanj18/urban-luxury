
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, Package, Truck } from 'lucide-react';

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, product, formData, paymentMethod } = location.state || {};

  const orderStatus = [
    { step: 'Order Placed', completed: true, icon: ShoppingBag },
    { step: 'Processing', completed: true, icon: Package },
    { step: 'Shipped', completed: false, icon: Truck },
    { step: 'Delivered', completed: false, icon: Package }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="ghost" 
              className="text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-amber-500" />
              <h1 className="text-2xl font-bold text-white">Order Details</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Order Status - {orderId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {orderStatus.map((status, index) => {
                  const Icon = status.icon;
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        status.completed 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-slate-600 text-slate-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`text-sm ${status.completed ? 'text-white' : 'text-slate-400'}`}>
                        {status.step}
                      </span>
                      {index < orderStatus.length - 1 && (
                        <div className={`w-full h-0.5 mt-2 ${
                          status.completed ? 'bg-amber-500' : 'bg-slate-600'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Details */}
            {product && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                      <p className="text-slate-300">{product.brandName}</p>
                      <p className="text-slate-300">Color: {product.selectedColor}</p>
                      <p className="text-slate-300">Size: {product.selectedSize}</p>
                      <p className="text-amber-500 font-bold text-xl mt-2">{product.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Delivery Information */}
            {formData && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-white font-semibold">Contact Details</h4>
                    <p className="text-slate-300">{formData.name}</p>
                    <p className="text-slate-300">{formData.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Delivery Address</h4>
                    <p className="text-slate-300">{formData.address}</p>
                    <p className="text-slate-300">{formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Payment Method</h4>
                    <p className="text-slate-300">{paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
