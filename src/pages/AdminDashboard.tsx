import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShoppingBag } from 'lucide-react';

interface ProductData {
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

interface Brand {
  id: string;
  name: string;
}

const staticBrands: Brand[] = [
  { id: "1", name: "PUMA" },
  { id: "2", name: "ADDIDAS" },
  { id: "3", name: "Nike" },
  { id: "4", name: "BURBERRY london" },
  { id: "5", name: "GUCCI" },
  { id: "6", name: "H&M" },
  { id: "7", name: "ZARA" },
  { id: "8", name: "LEVIS" },
  { id: "9", name: "ARMANI EXCHANGE" },
  { id: "10", name: "BOSS" },
  { id: "11", name: "POLO" },
  { id: "12", name: "LACOSTE" },
  { id: "13", name: "TOMMY" },
  { id: "14", name: "BALMAIN" },
  { id: "15", name: "EMPORIO" },
];

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/brands`);
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  return response.json();
};

const AdminDashboard: React.FC = () => {
  const [brandId, setBrandId] = useState("");
  const [productType, setProductType] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [mrp, setMrp] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>(staticBrands);
  const [selectedBrandToDelete, setSelectedBrandToDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // For adding new brands
  const [newBrandId, setNewBrandId] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandDescription, setNewBrandDescription] = useState("");
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [brandUploading, setBrandUploading] = useState(false);

  const navigate = useNavigate();
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  const loadBrands = async () => {
    try {
      const dynamicBrands = await fetchBrands();
      const mergedBrands = [
        ...staticBrands,
        ...dynamicBrands.filter(db => !staticBrands.some(sb => sb.id === db.id)),
      ];
      setBrands(mergedBrands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to load additional brands. Using static brands.");
      setBrands(staticBrands);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin-login', { replace: true });
    } else {
      loadBrands();
      setIsLoading(false);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "brandsUpdated") {
        loadBrands();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('adminLoggedIn');
      toast.success("Signed out successfully");
      navigate('/admin-login', { replace: true });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId || !productType || !productName || !mrp || !offerPrice || !imageFile || selectedSizes.length === 0) {
      toast.error("Please fill all fields and select at least one size.");
      return;
    }

    const mrpFloat = parseFloat(mrp);
    const offerPriceFloat = parseFloat(offerPrice);

    if (isNaN(mrpFloat) || isNaN(offerPriceFloat)) {
      toast.error("Prices must be valid numbers.");
      return;
    }

    setUploading(true);

    try {
      const selectedBrand = brands.find(b => b.id === brandId);
      const productData: ProductData = {
        brandId: brandId,
        brandName: selectedBrand ? selectedBrand.name : "Unknown",
        productType,
        productName,
        description,
        sizes: selectedSizes,
        mrp: mrpFloat,
        offerPrice: offerPriceFloat,
        imageUrl: "",
        createdAt: new Date(),
      };

      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('productData', JSON.stringify(productData));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to save product: ${response.statusText}`);

      const result = await response.json();
      toast.success("🎉 Product added successfully!");

      window.localStorage.setItem("productsUpdated", Date.now().toString());

      setBrandId("");
      setProductType("");
      setProductName("");
      setDescription("");
      setSelectedSizes([]);
      setMrp("");
      setOfferPrice("");
      setImageFile(null);
      const fileInput = document.getElementById('image-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      toast.error(`Failed to add product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandId || !newBrandName || !newBrandDescription || !newBrandLogo) {
      toast.error("Please fill all fields and select a logo.");
      return;
    }

    // Validate unique Brand ID
    if (brands.some(b => b.id === newBrandId)) {
      toast.error("Brand ID already exists. Choose a unique ID.");
      return;
    }

    setBrandUploading(true);

    try {
      const brandData = {
        id: newBrandId,
        name: newBrandName,
        description: newBrandDescription,
        logo: "",
      };

      const formData = new FormData();
      formData.append('logo', newBrandLogo);
      formData.append('brandData', JSON.stringify(brandData));

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/brands`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to save brand: ${response.statusText}`);

      const result = await response.json();
      toast.success("🎉 Brand added successfully!");

      window.localStorage.setItem("brandsUpdated", Date.now().toString());
      loadBrands(); // Refresh brand dropdown

      setNewBrandId("");
      setNewBrandName("");
      setNewBrandDescription("");
      setNewBrandLogo(null);
      const logoInput = document.getElementById('brand-logo-input') as HTMLInputElement;
      if (logoInput) logoInput.value = "";
    } catch (error: any) {
      toast.error(`Failed to add brand: ${error.message}`);
    } finally {
      setBrandUploading(false);
    }
  };

  const handleDeleteBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandToDelete) {
      toast.error("Please select a brand to delete.");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/brands/${selectedBrandToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete brand: ${response.statusText}`);

      const result = await response.json();
      toast.success("🎉 Brand deleted successfully!");

      window.localStorage.setItem("brandsUpdated", Date.now().toString());
      loadBrands(); // Refresh brand dropdown

      setSelectedBrandToDelete("");
    } catch (error: any) {
      toast.error(`Failed to delete brand: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <ShoppingBag className="h-8 w-8 text-amber-500" />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate('/admin/orders')}
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              Orders
            </Button>
            <Button
              onClick={() => navigate('/admin/products')}
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              Products
            </Button>
            <Button
              onClick={() => navigate('/admin/users')}
              variant="ghost"
              className="text-white hover:bg-slate-700"
            >
              Users
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-white border-slate-600 hover:bg-slate-700"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Product Section */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-white text-sm">Brand</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-white text-sm">Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pant">Pant</option>
                    <option value="Shoe">Shoe</option>
                    <option value="Accessory">Accessory</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-white text-sm">Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Classic White Sneaker"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-white text-sm">MRP (₹)</label>
                  <input
                    type="number"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="e.g., 12999"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white text-sm">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder="e.g., 9999"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-white text-sm">Available Sizes</label>
                <div className="flex flex-wrap gap-4 p-3 bg-slate-700 rounded-lg">
                  {availableSizes.map(size => (
                    <label key={size} className="flex items-center space-x-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleSizeChange(size)}
                        className="form-checkbox bg-slate-600 border-slate-500 text-amber-500 focus:ring-amber-500"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-white text-sm">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Product description..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-white text-sm">Product Image</label>
                <input
                  id="image-file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Add New Brand Section */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Manage Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Add Brand Form */}
              <form onSubmit={handleAddBrand} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Add New Brand</h3>
                <div>
                  <label className="block mb-1 text-white text-sm">Brand ID</label>
                  <input
                    type="text"
                    value={newBrandId}
                    onChange={(e) => setNewBrandId(e.target.value)}
                    placeholder="e.g., 16"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white text-sm">Brand Name</label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g., New Brand"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white text-sm">Description</label>
                  <textarea
                    value={newBrandDescription}
                    onChange={(e) => setNewBrandDescription(e.target.value)}
                    rows={3}
                    placeholder="Brand description..."
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-white text-sm">Brand Logo</label>
                  <input
                    id="brand-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewBrandLogo(e.target.files?.[0] || null)}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                  disabled={brandUploading}
                >
                  {brandUploading ? "Uploading..." : "Add Brand"}
                </Button>
              </form>

              {/* Delete Brand Form */}
              <form onSubmit={handleDeleteBrand} className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Delete Brand</h3>
                <div>
                  <label className="block mb-1 text-white text-sm">Select Brand to Delete</label>
                  <select
                    value={selectedBrandToDelete}
                    onChange={(e) => setSelectedBrandToDelete(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white border-none"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white"
                  disabled={isDeleting || !selectedBrandToDelete}
                >
                  {isDeleting ? "Deleting..." : "Delete Brand"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;