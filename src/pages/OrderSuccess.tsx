import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShoppingBag, Eye } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, product, formData, paymentMethod } = location.state || {};

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">MenStyle</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
            <p className="text-slate-300">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>

          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Order ID:</span>
                <span className="text-white font-semibold">{orderId || 'N/A'}</span>
              </div>
              
              {product && (
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex space-x-4">
                    <img 
                      src={product.image || fallbackImage} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                        console.warn(`Failed to load image for ${product.name}: ${product.image}`);
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-slate-300">{product.brandName}</p>
                      <p className="text-slate-300">Color: {product.selectedColor} | Size: {product.selectedSize}</p>
                      <p className="text-amber-500 font-bold">₹{product.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {formData && (
                <div className="border-t border-slate-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Delivery Address</h4>
                  <div className="text-slate-300">
                    <p>{formData.name}</p>
                    <p>{formData.phone}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-300">Payment Method:</span>
                  <span className="text-white">{paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/order-details', { state: { orderId, product, formData, paymentMethod } })}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Order
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;