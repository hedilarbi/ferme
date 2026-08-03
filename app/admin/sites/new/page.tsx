import { createSite } from "@/lib/admin/site-actions";
import Link from "next/link";

export default function NewSitePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/sites" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Site</h1>
          <p className="text-slate-500 mt-1">Create a new tenant with its own domain and design.</p>
        </div>
      </div>

      <form action={createSite} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Identity & Domain</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-700">Internal Name</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                placeholder="Ex: Mon Site de Voyage"
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
                placeholder="Ex: Meridia Voyages"
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
                placeholder="ex: meridia-voyages"
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
                placeholder="ex: voyage.localhost"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all outline-none"
              />
              <p className="text-[10px] text-slate-400">Ne pas inclure http:// ni le port :3000</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-slate-700">Description (SEO)</label>
            <textarea 
              name="description" 
              id="description" 
              rows={2}
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
                defaultValue="#3b82f6"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl p-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="secondaryColor" className="text-sm font-bold text-slate-700">Secondary Color</label>
              <input 
                type="color" 
                name="secondaryColor" 
                id="secondaryColor" 
                defaultValue="#64748b"
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
            Create Site
          </button>
        </div>
      </form>
    </div>
  );
}
