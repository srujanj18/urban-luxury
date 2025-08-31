import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

interface BackendProduct {
  _id: string;
  brandId: string;
  brandName: string;
  productType: string;
  productName: string;
  offerPrice: number;
  imageUrl: string;
}

const fetchProductsByBrand = async (brandId: string): Promise<Product[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  const products: BackendProduct[] = await response.json();
  return products
    .filter((p) => p.brandId === brandId)
    .map((p) => ({
      id: p._id,
      name: p.productName,
      price: p.offerPrice,
      image: p.imageUrl,
      category: p.productType,
    }));
};

const fetchBrandName = async (brandId: string): Promise<string> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/brands`);
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  const brands = await response.json();
  const brand = brands.find((b: { id: string; name: string }) => b.id === brandId);
  return brand?.name || "Brand";
};

const BrandProducts: React.FC = () => {
  const { brandId } = useParams<{ brandId: string }>();
  const navigate = useNavigate();

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["products", brandId],
    queryFn: () => fetchProductsByBrand(brandId!),
    enabled: !!brandId,
  });

  const { data: brandName, isLoading: isBrandLoading } = useQuery({
    queryKey: ["brandName", brandId],
    queryFn: () => fetchBrandName(brandId!),
    enabled: !!brandId,
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "productsUpdated") {
        refetch();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refetch]);

  const cardColors = [
    "from-amber-600/20 to-amber-800/20",
    "from-blue-600/20 to-blue-800/20",
    "from-emerald-600/20 to-emerald-800/20",
    "from-rose-600/20 to-rose-800/20",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ShoppingBag className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold gradient-text">URBAN LUXURY</h1>
          </motion.div>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="text-black border-amber-500 hover:bg-amber-500/20 hover:text-amber-300 transition-colors rounded-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </motion.header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="w-full max-w-5xl mx-auto bg-slate-800/90 border-amber-500/50 shadow-xl">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <ShoppingBag className="h-8 w-8 text-amber-500" />
                <CardTitle className="text-2xl font-bold gradient-text">
                  {isBrandLoading ? "Loading..." : `${brandName || "Brand"} Collection`}
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-6">
              <AnimatePresence>
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-white text-lg"
                  >
                    Loading products...
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-white text-lg"
                  >
                    {error.message || "Failed to load products."}
                  </motion.div>
                ) : !products || products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-white text-lg"
                  >
                    No products available for this brand.
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card
                          className={`relative bg-gradient-to-br ${cardColors[index % cardColors.length]} border-none shadow-lg rounded-xl overflow-hidden`}
                          onClick={() =>
                            navigate(`/product/${product.id}`, {
                              state: { brandId, brandName: brandName || "Brand" },
                            })
                          }
                        >
                          <CardContent className="p-4">
                            <div className="relative overflow-hidden rounded-lg">
                              <img
                                src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                                  console.warn(`Failed to load image for ${product.name}: ${product.image}`);
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <h3 className="mt-4 text-xl font-bold text-black truncate drop-shadow-sm">{product.name}</h3>
                            <p className="text-amber-400 text-lg font-semibold drop-shadow-sm">₹{product.price}</p>
                            <p className="text-black text-sm font-medium drop-shadow-sm">{product.category}</p>
                            <Button
                              className="mt-4 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${product.id}`, {
                                  state: { brandId, brandName: brandName || "Brand" },
                                });
                              }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default BrandProducts;