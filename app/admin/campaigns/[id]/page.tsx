import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GenerateCampaignButton } from "@/components/admin/GenerateCampaignButton";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      generatedArticles: {
        include: { article: true }
      }
    }
  });

  if (!campaign) notFound();

  const sites = await prisma.site.findMany({
    where: { status: "ACTIVE" },
    include: { geoSettings: true }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaigns" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
            <p className="text-slate-500 mt-1">Status: <span className="font-bold uppercase text-blue-600">{campaign.status}</span></p>
          </div>
        </div>
        <div className="flex gap-4">
          <GenerateCampaignButton campaignId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brief Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Product Brief</h2>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Product Name</p>
              <p className="text-slate-700 font-medium">{campaign.productName}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
              <p className="text-slate-700">{campaign.category || "N/A"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">{campaign.description}</p>
            </div>

            <div className="pt-2">
              <button className="text-sm text-blue-600 font-bold hover:underline">Edit Brief</button>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white space-y-4">
            <h2 className="font-bold border-b border-slate-800 pb-2">AI Strategy</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Keywords</p>
                <p className="text-xs text-slate-300">{campaign.keywords || "None"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Competitors</p>
                <p className="text-xs text-slate-300">{campaign.competitors || "None"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sites Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Sites & Generation Status</h2>
              <span className="text-xs text-slate-400 font-medium">{sites.length} Active Sites</span>
            </div>
            <div className="divide-y divide-slate-100">
              {sites.map((site) => {
                const generated = campaign.generatedArticles.find(ga => ga.siteId === site.id);
                return (
                  <div key={site.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                        🌐
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{site.name}</h3>
                        <p className="text-xs text-slate-500">
                          Geo: <span className="text-emerald-600 font-medium">{site.geoSettings?.city || "Global"}</span> • Persona: <span className="italic">{site.geoSettings?.persona || "Standard"}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        generated?.status === "READY" ? "bg-emerald-100 text-emerald-600" :
                        generated?.status === "GENERATING" ? "bg-amber-100 text-amber-600" :
                        "bg-slate-100 text-slate-400"
                      }`}>
                        {generated?.status || "PENDING"}
                      </span>
                      
                      {generated?.status === "READY" ? (
                        <Link 
                          href={`/admin/campaigns/${campaign.id}/review/${site.id}`}
                          className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Review
                        </Link>
                      ) : (
                        <button className="px-4 py-2 text-xs font-bold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
                          Action
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
