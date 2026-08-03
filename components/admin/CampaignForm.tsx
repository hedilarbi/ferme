"use client";

import { useState } from "react";
import { createCampaign } from "@/lib/admin/campaign-actions";
import Link from "next/link";

export function CampaignForm() {
  const [isScraping, setIsScraping] = useState(false);
  const [productUrl, setProductUrl] = useState("");
  
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [specs, setSpecs] = useState("");
  const [keywords, setKeywords] = useState("");
  const [images, setImages] = useState("");

  const handleScrape = async () => {
    if (!productUrl) return alert("Please enter a URL first.");
    setIsScraping(true);
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }
      const data = await res.json();
      
      setProductName(data.productName || "");
      setCategory(data.category || "");
      setDescription(data.description || "");
      setSpecs(data.specs || "");
      setKeywords(data.keywords || "");
      if (data.imageUrl) setImages(data.imageUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to scrape the URL. See console for details.");
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <form action={createCampaign} className="space-y-8">
      {/* Auto Scraper Section */}
      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="productUrl" className="text-sm font-bold text-blue-900">Product URL (Auto-Scraping)</label>
          <input 
            type="url" 
            id="productUrl" 
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="https://www.baita-home.com/..."
            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
        <button 
          type="button"
          onClick={handleScrape}
          disabled={isScraping}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 h-[50px]"
        >
          {isScraping ? "Scraping..." : "✨ Auto-Fill"}
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        {images && (
          <div className="mb-4">
            <span className="text-sm font-bold text-slate-700 block mb-2">Scraped Product Image</span>
            <img src={images} alt="Scraped product" className="h-24 w-auto rounded-lg border border-slate-200" />
            <input type="hidden" name="images" value={images} />
          </div>
        )}
        
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Campaign Identity</h2>
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-700">Campaign Name</label>
          <input 
            type="text" 
            name="name" 
            id="name" 
            required
            placeholder="e.g. Canapé Oslo - Launch May 2025"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">Product Brief</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="productName" className="text-sm font-bold text-slate-700">Product Name</label>
            <input 
              type="text" 
              name="productName" 
              id="productName" 
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-bold text-slate-700">Category</label>
            <input 
              type="text" 
              name="category" 
              id="category" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-bold text-slate-700">Main Description</label>
          <textarea 
            name="description" 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label htmlFor="specs" className="text-sm font-bold text-slate-700">Technical Specs</label>
          <textarea 
            name="specs" 
            id="specs" 
            value={specs}
            onChange={(e) => setSpecs(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs transition-all outline-none resize-none"
          ></textarea>
        </div>

        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">Optimization Strategy (GEO/SEO)</h2>

        <div className="space-y-2">
          <label htmlFor="strategy" className="text-sm font-bold text-slate-700">Backlink Strategy</label>
          <select
            name="strategy"
            id="strategy"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none"
          >
            <option value="MIXED">Mixte & Aléatoire (Répartit différents types d'articles sur le réseau : Comparatif, Review, Lifestyle...)</option>
            <option value="100_SNIPER">100% Sniper (Article focus produit direct pour chaque site)</option>
            <option value="COMPARATOR_TOP_3">100% Comparatifs (Tous les sites publient un comparatif Top 3)</option>
            <option value="70_20_10">Ratio Sécurité 70/20/10 (Majorité d'articles sans lien produit pour noyer le poisson)</option>
          </select>
          <p className="text-xs text-slate-500">Choose how backlinks are distributed across generated sites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-bold text-slate-700">Target Keywords</label>
            <input 
              type="text" 
              name="keywords" 
              id="keywords" 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="competitors" className="text-sm font-bold text-slate-700">Main Competitors</label>
            <input 
              type="text" 
              name="competitors" 
              id="competitors" 
              placeholder="IKEA Milano, Maisons du Monde..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Link 
          href="/admin/campaigns" 
          className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
        >
          Cancel
        </Link>
        <button 
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          Create Campaign
        </button>
      </div>
    </form>
  );
}
