import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingBag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  image?: string;
  colors?: string[];
  sizes?: string[];
  features?: string[];
  category?: string;
}

interface BackendProduct {
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
  createdAt: string;
}

const fetchProduct = async (brandId: string, productId: string): Promise<Product | null> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  const products: BackendProduct[] = await response.json();
  const foundProduct = products.find(
    (p) => p.brandId === brandId && p._id === productId
  );
  if (!foundProduct) {
    return null;
  }
  return {
    id: foundProduct._id,
    name: foundProduct.productName,
    price: foundProduct.offerPrice,
    description: foundProduct.description,
    image: foundProduct.imageUrl,
    images: [foundProduct.imageUrl],
    colors: ["Black", "White"],
    sizes: foundProduct.sizes,
    category: foundProduct.productType,
    features: ["Premium Quality", "Comfort Fit", "Durable Fabric"],
  };
};

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const brandName = location.state?.brandName || "Brand";
  const brandId = location.state?.brandId;

  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ["product", brandId, productId],
    queryFn: () => fetchProduct(brandId!, productId!),
    enabled: !!brandId && !!productId,
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white p-6 text-center"
      >
        Loading...
      </motion.div>
    );
  }

  if (error || !product) {
    toast.error(error?.message || "Product not found");
    navigate("/");
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white p-6 text-center"
      >
        Product not found
      </motion.div>
    );
  }

  if (!productId) {
    toast.error("Invalid product ID");
    navigate("/");
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white p-6 text-center"
      >
        Invalid product ID
      </motion.div>
    );
  }

  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";
  const images = product.images?.map(img => img || fallbackImage) || [product.image || fallbackImage];
  const colors = product.colors || ["Black", "White"];
  const sizes = product.sizes || ["S", "M", "L", "XL"];
  const features = product.features || ["Premium Quality", "Comfort Fit", "Durable Fabric"];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    toast.info(`Selected color: ${color}`);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    toast.info(`Selected size: ${size}`);
  };

  const handleBuyNow = () => {
    toast.success(
      `Admin notified: Customer considering ${product.name} in ${selectedColor}, size ${selectedSize}`
    );
    navigate("/checkout", {
      state: {
        product: {
          ...product,
          selectedColor,
          selectedSize,
          brandName,
        },
      },
    });
  };

  const handleAddToCart = () => {
    toast.success(
      `${product.name} in ${selectedColor}, size ${selectedSize} added to cart`
    );
    // Add to cart logic here (e.g., update context or localStorage)
    const cartItem = {
      ...product,
      selectedColor,
      selectedSize,
      brandName,
      quantity: 1,
    };
    // Save to localStorage and trigger update events
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const updatedCart = [...cart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

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
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold gradient-text">URBAN LUXURY</h1>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="aspect-square overflow-hidden rounded-lg bg-slate-700"
            >
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                  console.warn(`Failed to load image for ${product.name}: ${images[currentImageIndex]}`);
                }}
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-amber-500"
                      : "border-slate-600 hover:border-amber-500/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                      console.warn(`Failed to load thumbnail for ${product.name}: ${image}`);
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-medium gradient-text-desc"
              >
                {brandName}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl font-extrabold gradient-text mt-2 drop-shadow-md"
              >
                {product.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-3xl font-bold text-amber-400 mt-4 drop-shadow-md"
              >
                {typeof product.price === "number"
                  ? `₹${product.price}`
                  : product.price}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-200 leading-relaxed font-medium drop-shadow-sm"
            >
              {product.description || "High-quality product."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-white font-semibold mb-3 drop-shadow-sm">
                Color: {selectedColor}
              </h3>
              <div className="flex space-x-2">
                {colors.map((color, index) => (
                  <motion.button
                    key={color}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    onClick={() => handleColorSelect(color)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedColor === color
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-slate-700 border-slate-600 text-slate-200 hover:border-amber-500/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {color}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-white font-semibold mb-3 drop-shadow-sm">
                Size: {selectedSize}
              </h3>
              <div className="flex space-x-2">
                {sizes.map((size, index) => (
                  <motion.button
                    key={size}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.05 }}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      selectedSize === size
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "bg-slate-700 border-slate-600 text-slate-200 hover:border-amber-500/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Card className="bg-slate-800/50 border-amber-500/50">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3 drop-shadow-sm">Features</h3>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + index * 0.05 }}
                        className="text-slate-200 flex items-center font-medium"
                      >
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="flex space-x-4"
            >
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Buy Now
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProductDetail;
