import { prisma } from "@/lib/db";
import { updateSite } from "@/lib/admin/site-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await prisma.site.findUnique({
    where: { id },
    include: {
      domains: { where: { isPrimary: true } },
      themeSettings: true,
    },
  });

  if (!site) notFound();

  const updateSiteWithId = updateSite.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/sites" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Site</h1>
          <p className="text-slate-500 mt-1">Modify site: <span className="text-blue-600 font-medium">{site.name}</span></p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-px">
        <div className="px-4 py-2 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
          General Settings
        </div>
        <Link 
          href={`/admin/sites/${id}/geo`}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          GEO & AI Strategy
        </Link>
      </div>

      <form action={updateSiteWithId} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-700">Internal Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                defaultValue={site.name}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="brandName" className="text-sm font-bold text-slate-700">Public Brand Name</label>
              <input 
                type="text" 
                name="brandName" 
                id="brandName" 
                required
                defaultValue={site.brandName}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-bold text-slate-700">Database Slug (Unique)</label>
              <input 
                type="text" 
                name="slug" 
                id="slug" 
                required
                defaultValue={site.slug}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hostname" className="text-sm font-bold text-slate-700">Primary Hostname</label>
              <input 
                type="text" 
                name="hostname"
                id="hostname"
                required
                defaultValue={site.domains[0]?.hostname || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all outline-none"
              />
              <p className="text-[10px] text-slate-400 italic">Modifiez ce domaine avec précaution, cela impacte les URLs publiques.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-slate-700">Description (SEO)</label>
            <textarea 
              name="description" 
              id="description" 
              rows={2}
              defaultValue={site.description || ""}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">Design & Appearance</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="designKey" className="text-sm font-bold text-slate-700">Design Template</label>
              <select 
                name="designKey" 
                id="designKey"
                defaultValue={site.themeSettings?.designKey || "default"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="deco">Deco (Editorial)</option>
                <option value="guide">Guide (Professional)</option>
                <option value="magazine">Magazine (High Impact)</option>
                <option value="default">Default (Simple)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="primaryColor" className="text-sm font-bold text-slate-700">Primary Color</label>
              <input 
                type="color" 
                name="primaryColor" 
                id="primaryColor" 
                defaultValue={site.themeSettings?.primaryColor || "#3b82f6"}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl p-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="secondaryColor" className="text-sm font-bold text-slate-700">Secondary Color</label>
              <input 
                type="color" 
                name="secondaryColor" 
                id="secondaryColor" 
                defaultValue={site.themeSettings?.secondaryColor || "#64748b"}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl p-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/sites" 
            className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Update Site
          </button>
        </div>
      </form>
    </div>
  );
}
