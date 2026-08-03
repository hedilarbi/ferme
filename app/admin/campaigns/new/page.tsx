import Link from "next/link";
import { CampaignForm } from "@/components/admin/CampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/campaigns" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New AI Campaign</h1>
          <p className="text-slate-500 mt-1">Create a brief to generate content across your multi-tenant sites.</p>
        </div>
      </div>
      
      <CampaignForm />
    </div>
  );
}
