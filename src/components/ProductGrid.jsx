'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { Search, Sparkles } from 'lucide-react';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--accent-gold)] text-white border-[var(--accent-gold)] shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-heading)] border-[var(--border-color)] hover:border-[var(--accent-gold)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search crafts or runes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] focus:border-[var(--accent-gold)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--text-heading)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)] transition-all shadow-xs font-medium"
          />
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 animate-pulse h-96 flex flex-col justify-between">
              <div className="bg-[var(--bg-image-placeholder)] rounded-xl h-48 w-full mb-4" />
              <div className="space-y-2">
                <div className="bg-[var(--bg-image-placeholder)] rounded h-5 w-3/4" />
                <div className="bg-[var(--bg-image-placeholder)] rounded h-4 w-full" />
              </div>
              <div className="bg-[var(--bg-image-placeholder)] rounded-xl h-10 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-xs">
          <Sparkles className="w-10 h-10 text-[var(--accent-gold)] opacity-60 mx-auto mb-3" />
          <h3 className="text-lg font-serif text-[var(--text-heading)] font-bold">No crafts match your filter</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">Try clearing your search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
