import { prisma } from "@/lib/db";
import { createArticle } from "@/lib/admin/actions";
import Link from "next/link";

export default async function NewArticlePage() {
  const sites = await prisma.site.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">New Article</h1>
          <p className="text-slate-500 mt-1">Create a new post for one of your sites.</p>
        </div>
      </div>

      <form action={createArticle} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="siteId" className="text-sm font-bold text-slate-700">Target Site</label>
              <select 
                name="siteId" 
                id="siteId" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">Select a site...</option>
                {sites.map(site => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-bold text-slate-700">Status</label>
              <select 
                name="status" 
                id="status"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold text-slate-700">Title</label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              required
              placeholder="Ex: 10 conseils pour un salon moderne"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-bold text-slate-700">Slug (URL)</label>
            <input 
              type="text" 
              name="slug" 
              id="slug" 
              required
              placeholder="ex: 10-conseils-salon"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="featuredImage" className="text-sm font-bold text-slate-700">Featured Image URL</label>
            <input 
              type="url" 
              name="featuredImage" 
              id="featuredImage" 
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="excerpt" className="text-sm font-bold text-slate-700">Excerpt (Short Description)</label>
            <textarea 
              name="excerpt" 
              id="excerpt" 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-bold text-slate-700">HTML Content</label>
            <textarea 
              name="content" 
              id="content" 
              required
              rows={12}
              placeholder="<h1>My Title</h1><p>My content here...</p>"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm transition-all outline-none"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link 
            href="/admin/articles" 
            className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Create Article
          </button>
        </div>
      </form>
    </div>
  );
}
