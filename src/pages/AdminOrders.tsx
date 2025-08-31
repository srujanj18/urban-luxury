import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Order {
  _id: string;
  orderId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    brandName: string;
    selectedColor: string;
    selectedSize: string;
    category: string;
  };
  userInfo: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`);
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.json();
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login', { replace: true });
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ordersUpdated') {
        toast.info('New order received!');
        refetch();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, refetch]);

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Package className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
          </div>
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </header>
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="h-6 w-6 mr-2 text-amber-500" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="text-white text-center">Loading orders...</div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white font-semibold">Order #{order.orderId}</h4>
                          <p className="text-slate-300">Status: {order.status}</p>
                          <p className="text-slate-300">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                          <p className="text-slate-300">Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</p>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Customer</h4>
                          <p className="text-slate-300">{order.userInfo.name}</p>
                          <p className="text-slate-300">{order.userInfo.phone}</p>
                          <p className="text-slate-300">{order.userInfo.address}, {order.userInfo.city}, {order.userInfo.state} - {order.userInfo.pincode}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-4">
                        <img
                          src={order.product.image || fallbackImage}
                          alt={order.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                            console.warn(`Failed to load image for ${order.product.name}: ${order.product.image}`);
                          }}
                        />
                        <div>
                          <h4 className="text-white font-semibold">{order.product.name}</h4>
                          <p className="text-slate-300">{order.product.brandName} - {order.product.category}</p>
                          <p className="text-slate-300">Color: {order.product.selectedColor} | Size: {order.product.selectedSize}</p>
                          <p className="text-amber-500 font-bold">₹{order.product.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-white text-center">No orders found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;