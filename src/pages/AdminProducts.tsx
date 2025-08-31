import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  _id: string;
  brandId: string;
  brandName: string;
  productType: string;
  productName: string;
  description: string;
  sizes: string[];
  mrp: number;
  offerPrice: number;
  imageUrl: string;
  createdAt: any;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
};

const deleteProduct = async (productId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.statusText}`);
  }
  return response.json();
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      window.localStorage.setItem("productsUpdated", Date.now().toString());
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login', { replace: true });
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productsUpdated') {
        toast.info('Product list updated!');
        refetch();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, refetch]);

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Manage Products</h1>
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
              <ShoppingBag className="h-6 w-6 mr-2 text-amber-500" />
              Manage Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-white text-center">Loading products...</div>
            ) : products && products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product._id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex space-x-4">
                        <img
                          src={product.imageUrl || fallbackImage}
                          alt={product.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                            console.warn(`Failed to load image for ${product.productName}: ${product.imageUrl}`);
                          }}
                        />
                        <div>
                          <h4 className="text-white font-semibold">{product.productName}</h4>
                          <p className="text-slate-300">{product.brandName} - {product.productType}</p>
                          <p className="text-slate-300">Sizes: {product.sizes.join(', ')}</p>
                          <p className="text-amber-500 font-bold">₹{product.offerPrice}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteProduct(product._id, product.productName)}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteProductMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-white text-center">No products found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;