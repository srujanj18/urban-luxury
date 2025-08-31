import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

const brandsData: Brand[] = [
  { id: "1", name: "PUMA", logo: "/images/puma.png", description: "Unleash your bold with PUMA – where sport meets style" },
  { id: "2", name: "ADDIDAS", logo: "/images/addidas.png", description: "Impossible is nothing – step into confidence with Adidas." },
  { id: "3", name: "Nike", logo: "/images/Nike.png", description: "Just do it — every step, a statement" },
  { id: "4", name: "BURBERRY London", logo: "/images/london.png", description: "Timeless British elegance — make every moment iconic with Burberry London" },
  { id: "5", name: "GUCCI", logo: "/images/gucci.png", description: "Elevate your style with the luxury of Gucci" },
  { id: "6", name: "H&M", logo: "/images/H.png", description: "Fashion and quality at the best price — discover H&M" },
  { id: "7", name: "ZARA", logo: "/images/zara.png", description: "Trendy fashion for the modern you — explore Zara" },
  { id: "8", name: "LEVIS", logo: "/images/levis.png", description: "Authentic denim since 1853 — wear your story with Levi's" },
  { id: "9", name: "ARMANI EXCHANGE", logo: "/images/Armani.png", description: "Modern style meets Italian heritage with Armani Exchange" },
  { id: "10", name: "BOSS", logo: "/images/Boss.png", description: "Refined German tailoring and modern luxury — discover BOSS" },
  { id: "11", name: "POLO", logo: "/images/polo.png", description: "Classic American style — discover the world of Polo" },
  { id: "12", name: "LACOSTE", logo: "/images/lacoste.png", description: "Timeless French elegance — discover the world of Lacoste" },
  { id: "13", name: "TOMMY", logo: "/images/Tommy.png", description: "Classic American cool — discover the world of Tommy" },
  { id: "14", name: "BALMAIN", logo: "/images/balmain.png", description: "Parisian luxury and bold design — discover the world of Balmain" },
  { id: "15", name: "EMPORIO", logo: "/images/emporio.jpeg", description: "Italian sophistication and modern style — discover Emporio" },
];

const Index: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setBrands(brandsData);
      setIsLoading(false);
    }, 500);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "brandsUpdated") {
        setBrands(brandsData);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setIsSubscribing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Subscribed successfully with ${email}!`);
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleBrandClick = (brandId: string, brandName: string) => {
    navigate("/login", { state: { redirectTo: `/brand/${brandId}`, brandName, brandId } });
  };

  const handleStartOrdering = () => {
    navigate("/login");
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
          <Button
            onClick={() => navigate("/login")}
            variant="outline"
            className="text-black border-amber-500 hover:bg-amber-500/20 hover:text-amber-300 transition-colors"
          >
            Login
          </Button>
        </div>
      </motion.header>

      {/* Hero Section with Background Image */}
      <section
        className="container mx-auto px-4 py-20 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4 drop-shadow-lg"
        >
          Welcome to Urban Luxury
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl gradient-text-desc mb-8 max-w-3xl mx-auto drop-shadow"
        >
          Discover curated collections from the world's top brands, featuring premium apparel, footwear, and accessories. Experience timeless style and quality craftsmanship.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleStartOrdering}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-6 px-10 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Start Ordering
          </Button>
        </motion.div>
      </section>

      {/* Featured Brands Section */}
      <section className="container mx-auto px-4 py-12 bg-slate-900/50">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-10 text-center"
        >
          Featured Brands
        </motion.h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                      />
                      <h3 className="text-xl font-semibold text-white">{brand.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Newsletter Subscription */}
      <section
        className="container mx-auto px-4 py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-800/90 border-amber-500/50 max-w-md mx-auto shadow-xl">
            <CardHeader>
              <CardTitle className="text-white text-center flex items-center justify-center text-2xl">
                <Mail className="h-6 w-6 mr-2 text-amber-500" />
                Subscribe to Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mohammednizamuddin78654@gmail.com"
                    className="bg-slate-700 text-white border-amber-500/50 focus:ring-amber-500 transition-all"
                  />
                </div>
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-full py-6 transition-all"
                  disabled={isSubscribing}
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer with Contact Info */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/70 backdrop-blur-sm border-t border-slate-700 py-8"
      >
        <div className="container mx-auto px-4 text-center text-slate-200">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-amber-500" />
              <span>Kukkady 7th block krishnapura</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2 text-amber-500" />
              <span>+91 9380849319</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-amber-500" />
              <span>mohammednizamuddin78654@gmail.com</span>
            </div>
          </div>
          <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Urban Luxury. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;