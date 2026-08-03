import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteSite } from "@/lib/admin/site-actions";

export default async function AdminSitesList() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      domains: { where: { isPrimary: true } },
      themeSettings: true,
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sites</h1>
          <p className="text-slate-500 mt-1">Manage your multi-tenant domains and themes.</p>
        </div>
        <Link 
          href="/admin/sites/new" 
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          + New Site
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Site Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hostname</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Design</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sites.map((site) => (
              <tr key={site.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {site.name}
                    </span>
                    <span className="text-xs text-slate-400">Slug: {site.slug}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a 
                    href={`http://${site.domains[0]?.hostname}:3000`} 
                    target="_blank"
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {site.domains[0]?.hostname}
                    <span className="text-[10px]">↗</span>
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    {site.themeSettings?.designKey || "default"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(site.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link 
                      href={`/admin/sites/${site.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <form action={async () => { "use server"; await deleteSite(site.id); }}>
                      <button 
                        type="submit"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
