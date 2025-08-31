import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

const fetchUserOrders = async (email: string, userName: string): Promise<Order[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`);
  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
  }
  const allOrders = await response.json();
  
  // Since the current order schema doesn't have userEmail field,
  // we'll filter orders based on the user's name from Firebase
  // This is a temporary solution until we update the order schema
  return allOrders.filter((order: Order) => 
    order.userInfo && order.userInfo.name && 
    order.userInfo.name.toLowerCase().includes(userName.toLowerCase())
  );
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const { data: orders, isLoading, error, refetch } = useQuery<Order[]>({
    queryKey: ["userOrders", user?.email, user?.displayName],
    queryFn: () => fetchUserOrders(user?.email || "", user?.displayName || ""),
    enabled: !!user?.email && !!user?.displayName,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      refetch();
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    return () => window.removeEventListener("orderUpdated", handleOrderUpdate);
  }, [refetch]);

  const [cart, setCart] = useState<Order["product"][]>([]);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = (e: StorageEvent) => {
      if (e.key === "cart") {
        try {
          const updatedCart = JSON.parse(e.newValue || "[]");
          setCart(updatedCart);
        } catch (error) {
          console.error("Error parsing updated cart:", error);
        }
      }
    };

    const handleCustomCartEvent = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error("Error parsing cart:", error);
        }
      }
    };

    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cartUpdated", handleCustomCartEvent);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cartUpdated", handleCustomCartEvent);
    };
  }, []);

  const addToCart = (product: Order["product"]) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((p) => p.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Removed from cart");
  };

  if (!user) {
    return <div className="text-white text-center mt-10">Loading user info...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="ghost"
          className="text-white hover:bg-amber-500/20 hover:text-amber-300 transition-colors mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white">User Profile</h1>
      </div>

      <Card className="mb-6 bg-slate-800/80 border-slate-700 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more profile fields if available */}
        </CardContent>
      </Card>

      <Card className="mb-6 bg-slate-800/80 border-slate-700 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-white">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load orders.</p>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-white font-semibold">{order.product.name}</h4>
                        <p className="text-slate-300">{order.product.brandName} - {order.product.category}</p>
                        <p className="text-slate-300">Color: {order.product.selectedColor} | Size: {order.product.selectedSize}</p>
                        <p className="text-amber-500 font-bold">₹{order.product.price}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                      <p className="text-white">Order ID: {order.orderId}</p>
                      <p className="text-white">Status: {order.status}</p>
                      <p className="text-white">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                      <Button onClick={() => addToCart(order.product)} className="bg-amber-500 hover:bg-amber-600 text-white">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-white">No orders found.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800/80 border-slate-700 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-white">Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-white">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((product) => (
                <div key={product.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h4 className="text-white font-semibold">{product.name}</h4>
                      <p className="text-slate-300">{product.brandName}</p>
                      <p className="text-amber-500 font-bold">₹{product.price}</p>
                    </div>
                  </div>
                  <Button onClick={() => removeFromCart(product.id)} className="bg-red-500 hover:bg-red-600 text-white">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
