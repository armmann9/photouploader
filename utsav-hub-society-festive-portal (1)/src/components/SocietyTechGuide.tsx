import React, { useState } from 'react';
import { BookOpen, HardDrive, Globe, ScanFace, Check, ArrowRight, DollarSign, Download, Copy, CheckCheck, Lightbulb, ShieldAlert } from 'lucide-react';
import { SOCIETY_GUIDE_TOPICS } from '../data/festivalEvents';
import { playTempleBell, playSitarPluck } from '../utils/audio';

export const SocietyTechGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos-management' | 'domain-and-hosting' | 'ai-face-matching'>('photos-management');
  const [copied, setCopied] = useState(false);

  const currentTopic = SOCIETY_GUIDE_TOPICS.find(t => t.id === activeTab) || SOCIETY_GUIDE_TOPICS[0];

  const copyCommitteeProposal = () => {
    playTempleBell(980);
    const text = `
🏛️ SOCIETY RWA PROPOSAL: COMMUNITY FESTIVAL PORTAL & AI PHOTO HUB
-----------------------------------------------------------------
Objective: Replace WhatsApp photo chaos with an official festive portal where residents find their photos via AI face-search.

1. Photo Storage Solution (300+ Photos/Event):
   - Client-Side WebP Compression reduces 3 GB camera files down to ~110 MB.
   - Cloudinary / Firebase Storage Free Tier: ₹0 / month.
   - Global CDN (Cloudflare): ₹0 / month.

2. Official Domain & Hosting:
   - Official domain (e.g. www.mycolony.in): ~₹499 to ₹799 per year.
   - Cloud Server Hosting: ₹0 (Free Tier Cloud Run / Vercel handles 50,000 requests).
   - SSL Security Padlock: ₹0 (Included free).

3. AI Face Recognition:
   - On-Device private browser matching or AWS Rekognition (~₹50 per big festival).

TOTAL ANNUAL SOCIETY BUDGET: ~₹500 to ₹1,200 PER YEAR TOTAL!
(Less than ₹2 per flat for a 500-flat society!)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-emerald-950/90 to-emerald-900/90 border border-emerald-700/80 p-6 md:p-10 shadow-2xl backdrop-blur-md" id="society-tech-guide-section">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Society Committee Handbook • आसान गाइड</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display text-amber-200">
            How to Manage 300 Photos, Domain & AI
          </h2>
          <p className="text-emerald-300/80 text-xs md:text-sm mt-1 max-w-2xl">
            Everything explained in simple, plain language for society secretaries, cultural committee members, and residents.
          </p>
        </div>

        <button
          id="copy-rwa-proposal-btn"
          onClick={copyCommitteeProposal}
          className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          {copied ? <CheckCheck className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Proposal for Society Meeting'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-emerald-800/80 pb-4">
        {SOCIETY_GUIDE_TOPICS.map((topic) => {
          const isActive = activeTab === topic.id;
          return (
            <button
              key={topic.id}
              id={`guide-tab-${topic.id}`}
              onClick={() => {
                setActiveTab(topic.id as any);
                playSitarPluck('Ma');
              }}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 shadow-md scale-102'
                  : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800/60 border border-emerald-800'
              }`}
            >
              {topic.id === 'photos-management' && <HardDrive className="w-4 h-4" />}
              {topic.id === 'domain-and-hosting' && <Globe className="w-4 h-4" />}
              {topic.id === 'ai-face-matching' && <ScanFace className="w-4 h-4" />}
              <span>{topic.title.split(' ')[0]} {topic.title.split(' ')[1]} {topic.title.split(' ')[2]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Display */}
      <div className="space-y-8">
        {/* Hindi Quick Summary Callout */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider mb-1">
              सरल शब्दों में (In Plain Hindi):
            </span>
            <p className="text-sm text-amber-100/90 leading-relaxed font-medium">
              {currentTopic.summaryHindi}
            </p>
          </div>
        </div>

        {/* The Problem & Solution Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-red-950/30 border border-red-900/50">
            <h3 className="text-sm font-bold text-red-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>The Problem Most Societies Face</span>
            </h3>
            <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed">
              {currentTopic.fullGuide.problemStatement}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-700/60">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400" />
              <span>Recommended Smart Solution</span>
            </h3>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">
              {currentTopic.fullGuide.recommendedSolution}
            </p>
          </div>
        </div>

        {/* Step-by-Step Implementation */}
        <div className="bg-emerald-950/50 p-6 rounded-2xl border border-emerald-800/80">
          <h3 className="text-base font-bold text-amber-200 mb-4 flex items-center gap-2">
            <span>Step-by-Step Action Plan</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentTopic.fullGuide.stepByStep.map((step, idx) => (
              <div key={idx} className="flex gap-3 p-3.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-emerald-950 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown Table */}
        <div>
          <h3 className="text-base font-bold text-amber-200 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Exact Cost Breakdown for Your Society</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-emerald-800 rounded-xl overflow-hidden">
              <thead className="bg-emerald-900/80 text-amber-300 uppercase font-semibold">
                <tr>
                  <th className="p-3">Component</th>
                  <th className="p-3">Cost in Rupees</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Notes for Committee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/60 bg-emerald-950/40">
                {currentTopic.fullGuide.costBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-emerald-900/30 transition-colors">
                    <td className="p-3 font-semibold text-amber-100">{row.item}</td>
                    <td className="p-3 font-bold text-amber-400">{row.cost}</td>
                    <td className="p-3 text-emerald-300">{row.frequency}</td>
                    <td className="p-3 text-emerald-300/80">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pro Tips Box */}
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
          <span className="text-xs font-bold text-yellow-300 block mb-2">Pro Tips from Society Webmasters:</span>
          <ul className="space-y-1.5">
            {currentTopic.fullGuide.proTips.map((tip, idx) => (
              <li key={idx} className="text-xs text-emerald-200 flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
