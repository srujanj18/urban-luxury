import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';

interface Product extends DocumentData {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

const MensPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMensProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsCollection = collection(db, 'products');
        const q = query(productsCollection, where('category', '==', 'men'));
        
        const querySnapshot = await getDocs(q);
        const mensProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(mensProducts);
      } catch (err) {
        console.error("Error fetching men's products: ", err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchMensProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Men's Style</h1>
      {products.length === 0 ? (
        <p className="text-center">No products found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="font-bold text-lg">{product.name}</h2>
                <p className="text-gray-600 mt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MensPage;