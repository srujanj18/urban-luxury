import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Admin = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false); // Track upload state

  const brands = [
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !imageFile || !category) {
      toast.error("Please fill all fields");
      return;
    }

    // Check if user is authenticated (optional, based on your rules)
    const auth = getAuth();
    if (!auth.currentUser) {
      toast.error("You must be logged in to add a product");
      return;
    }

    setUploading(true);

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "products"), {
        name,
        price: price.startsWith("₹") ? price : `₹${price}`,
        image: imageUrl,
        category, // brandId
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully!");
      setName("");
      setPrice("");
      setImageFile(null);
      setCategory("");
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error(`Failed to add product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg bg-slate-800/80 border-slate-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Panel</h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
              disabled={uploading}
            />
            <input
              type="text"
              placeholder="Price (e.g. 3999 or ₹3999)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
              disabled={uploading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600"
              disabled={uploading}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white"
              disabled={uploading}
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>

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
    </div>
  );
};

export default Admin;