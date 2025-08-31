import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  productCount: number;
}

const staticBrands: Brand[] = [
  { id: "1", name: "PUMA", logo: "/images/puma.png", description: "Unleash your bold with PUMA – where sport meets style", productCount: 0 },
  { id: "2", name: "ADDIDAS", logo: "/images/addidas.png", description: "Impossible is nothing – step into confidence with Adidas.", productCount: 0 },
  { id: "3", name: "Nike", logo: "/images/Nike.png", description: "Just do it — every step, a statement", productCount: 0 },
  { id: "4", name: "BURBERRY London", logo: "/images/london.png", description: "Timeless British elegance — make every moment iconic with Burberry London", productCount: 0 },
  { id: "5", name: "GUCCI", logo: "/images/gucci.png", description: "Elevate your style with the luxury of Gucci", productCount: 0 },
  { id: "6", name: "H&M", logo: "/images/H.png", description: "Fashion and quality at the best price — discover H&M", productCount: 0 },
  { id: "7", name: "ZARA", logo: "/images/zara.png", description: "Trendy fashion for the modern you — explore Zara", productCount: 0 },
  { id: "8", name: "LEVIS", logo: "/images/levis.png", description: "Authentic denim since 1853 — wear your story with Levi's", productCount: 0 },
  { id: "9", name: "ARMANI EXCHANGE", logo: "/images/Armani.png", description: "Modern style meets Italian heritage with Armani Exchange", productCount: 0 },
  { id: "10", name: "BOSS", logo: "/images/Boss.png", description: "Refined German tailoring and modern luxury — discover BOSS", productCount: 0 },
  { id: "11", name: "POLO", logo: "/images/polo.png", description: "Classic American style — discover the world of Polo", productCount: 0 },
  { id: "12", name: "LACOSTE", logo: "/images/lacoste.png", description: "Timeless French elegance — discover the world of Lacoste", productCount: 0 },
  { id: "13", name: "TOMMY", logo: "/images/Tommy.png", description: "Classic American cool — discover the world of Tommy", productCount: 0 },
  { id: "14", name: "BALMAIN", logo: "/images/balmain.png", description: "Parisian luxury and bold design — discover the world of Balmain", productCount: 0 },
  { id: "15", name: "EMPORIO", logo: "/images/emporio.jpeg", description: "Italian sophistication and modern style — discover Emporio", productCount: 0 },
];

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/brands`);
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  return response.json();
};

const fetchProductCounts = async (): Promise<Record<string, number>> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/counts`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product counts: ${response.statusText}`);
  }
  return response.json();
};

const Dashboard: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(staticBrands);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      const [dynamicBrands, countsData] = await Promise.all([fetchBrands(), fetchProductCounts()]);
      
      const mergedBrands = [
        ...staticBrands,
        ...dynamicBrands.filter(db => !staticBrands.some(sb => sb.id === db.id)),
      ].map(brand => ({
        ...brand,
        productCount: countsData[brand.id] || 0,
      }));

      setBrands(mergedBrands);
    } catch (error) {
      console.error("Error fetching brands or counts:", error);
      toast.error("Failed to load additional brands. Showing static brands.");
      const countsData = await fetchProductCounts().catch(() => ({}));
      setBrands(
        staticBrands.map(brand => ({
          ...brand,
          productCount: countsData[brand.id] || 0,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "productsUpdated" || e.key === "brandsUpdated") {
        loadBrands();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleBrandClick = (brandId: string, brandName: string) => {
    navigate(`/brand/${brandId}`, { state: { brandName, brandId } });
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

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
          <div className="flex space-x-4">
            <Button
              onClick={handleProfileClick}
              variant="outline"
              className="text-black border-amber-500 hover:bg-amber-500/20 hover:text-amber-300 transition-colors rounded-full"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-black border-amber-500 hover:bg-amber-500/20 hover:text-amber-300 transition-colors rounded-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <main
        className="container mx-auto px-4 py-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">URBAN LUXURY</h2>
          <p className="text-lg gradient-text-desc max-w-3xl mx-auto">
            Discover our collection from the world's finest fashion houses
          </p>
        </motion.div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-white text-lg"
            >
              Loading brands...
            </motion.div>
          ) : brands.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-white text-lg"
            >
              No brands available.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)" }}
                >
                  <Card
                    className={`bg-gradient-to-br ${cardColors[index % cardColors.length]} border-none hover:bg-opacity-90 transition-all duration-300 cursor-pointer shadow-lg`}
                    onClick={() => handleBrandClick(brand.id, brand.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-full h-32 object-contain mb-4 rounded-lg bg-white/10 p-2"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                      <h3 className="text-xl font-semibold text-white">{brand.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
