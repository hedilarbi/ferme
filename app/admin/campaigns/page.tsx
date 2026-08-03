import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { generatedArticles: true }
      }
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Campaigns</h1>
          <p className="text-slate-500 mt-1">Generate multi-tenant content for your products.</p>
        </div>
        <Link 
          href="/admin/campaigns/new"
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95"
        >
          <span>✨</span>
          New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-4 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Campaign & Product</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-6 grid grid-cols-4 gap-4 items-center hover:bg-slate-50 transition-colors">
              <div className="col-span-2 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{campaign.name}</h3>
                  <p className="text-sm text-slate-500">
                    Product: <span className="font-medium text-slate-700">{campaign.productName}</span> • {campaign._count.generatedArticles} articles
                  </p>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  campaign.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-600" :
                  campaign.status === "GENERATING" ? "bg-amber-100 text-amber-600" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Link 
                  href={`/admin/campaigns/${campaign.id}`}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
          {campaigns.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              No campaigns created yet. Click "New Campaign" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
