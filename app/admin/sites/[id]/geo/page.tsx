import { prisma } from "@/lib/db";
import { updateGeoSettings } from "@/lib/admin/site-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GeoSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await prisma.site.findUnique({
    where: { id },
    include: {
      geoSettings: true,
    },
  });

  if (!site) notFound();

  const updateGeoWithId = updateGeoSettings.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href={`/admin/sites`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">GEO Configuration</h1>
          <p className="text-slate-500 mt-1">AI Engine settings for: <span className="text-blue-600 font-medium">{site.name}</span></p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 pb-px">
        <Link 
          href={`/admin/sites/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          General Settings
        </Link>
        <div className="px-4 py-2 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
          GEO & AI Strategy
        </div>
      </div>

      <form action={updateGeoWithId} className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg w-fit">
            <span className="text-lg">🤖</span>
            <span className="text-xs font-bold uppercase tracking-wider">Moteur d'Optimisation Générative (GEO)</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Target Geography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="region" className="text-sm font-bold text-slate-700">Target Region</label>
              <input 
                type="text" 
                name="region" 
                id="region" 
                placeholder="e.g. Auvergne-Rhône-Alpes"
                defaultValue={site.geoSettings?.region || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-bold text-slate-700">Country</label>
              <input 
                type="text" 
                name="country" 
                id="country" 
                required
                defaultValue={site.geoSettings?.country || "France"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">AI Content Strategy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="persona" className="text-sm font-bold text-slate-700">AI Persona</label>
              <select 
                name="persona" 
                id="persona"
                defaultValue={site.geoSettings?.persona || "expert"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="expert">Expert / Authority</option>
                <option value="lifestyle">Lifestyle / Storyteller</option>
                <option value="comparator">Comparator / Analyst</option>
                <option value="local">Local Journalist / Guide</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="writingTone" className="text-sm font-bold text-slate-700">Writing Tone</label>
              <select 
                name="writingTone" 
                id="writingTone"
                defaultValue={site.geoSettings?.writingTone || "informatif"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="informatif">Informatif / Neutre</option>
                <option value="inspirationnel">Inspirationnel / Créatif</option>
                <option value="technique">Technique / Détaillé</option>
                <option value="local">Ancrage Local / Communautaire</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="audienceDesc" className="text-sm font-bold text-slate-700">Target Audience Description</label>
            <textarea 
              name="audienceDesc" 
              id="audienceDesc" 
              rows={3}
              placeholder="e.g. Jeunes familles de 25-40 ans cherchant des solutions d'ameublement durables..."
              defaultValue={site.geoSettings?.audienceDesc || ""}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="locale" className="text-sm font-bold text-slate-700">Content Locale</label>
              <input 
                type="text" 
                name="locale" 
                id="locale" 
                required
                defaultValue={site.geoSettings?.locale || "fr"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
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
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            Save GEO Strategy
          </button>
        </div>
      </form>
    </div>
  );
}
