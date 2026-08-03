import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function NavigationSiteSelector() {
  const sites = await prisma.site.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { navigationItems: true } }
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Navigation</h1>
        <p className="text-slate-500 mt-1">Select a site to manage its header menu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Link 
            key={site.id} 
            href={`/admin/navigation/${site.id}`}
            className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                {site._count.navigationItems} links
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {site.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1 italic">
              {site.brandName}
            </p>
            <div className="mt-6 flex items-center text-blue-600 font-bold text-sm">
              Manage Menu <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
