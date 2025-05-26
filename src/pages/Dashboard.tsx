
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag } from 'lucide-react';
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  const brands = [
    { 
      id: 1, 
      name: "Hugo Boss", 
      logo: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      description: "Premium German luxury fashion"
    },
    { 
      id: 2, 
      name: "Giorgio Armani", 
      logo: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop",
      description: "Italian elegance and sophistication"
    },
    { 
      id: 3, 
      name: "Tom Ford", 
      logo: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
      description: "Modern luxury menswear"
    },
    { 
      id: 4, 
      name: "Versace", 
      logo: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
      description: "Bold Italian luxury fashion"
    }
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleBrandClick = (brandId: number, brandName: string) => {
    navigate(`/brand/${brandId}`, { state: { brandName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">MenStyle</h1>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="text-white border-slate-600 hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Premium Brands</h2>
          <p className="text-slate-300 text-lg">Discover our collection from the world's finest fashion houses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {brands.map((brand) => (
            <Card 
              key={brand.id}
              className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => handleBrandClick(brand.id, brand.name)}
            >
              <CardContent className="p-6">
                <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{brand.name}</h3>
                <p className="text-slate-300 mb-4">{brand.description}</p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold">
                  Explore Collection
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
