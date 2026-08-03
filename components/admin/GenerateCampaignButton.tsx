"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GenerateCampaignButton({ campaignId }: { campaignId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    console.log("CLIENT: Generate button clicked for ID:", campaignId);
    if (!confirm("Start generating articles for all sites? This may take a minute.")) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}/generate`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error("API Error Status:", res.status);
        console.error("API Error Body:", errorBody);
        throw new Error(`Generation failed: ${res.status}`);
      }

      const data = await res.json();
      alert("Generation complete! Review your articles.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error during generation. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleGenerate}
      disabled={isGenerating}
      className={`px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 ${
        isGenerating ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <span>{isGenerating ? "⏳" : "🚀"}</span>
      {isGenerating ? "Generating..." : "Generate All Articles"}
    </button>
  );
}
