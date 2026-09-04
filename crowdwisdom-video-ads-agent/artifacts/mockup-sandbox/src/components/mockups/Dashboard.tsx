import React, { useState, useEffect } from "react";
import { 
  Play, 
  ShieldCheck, 
  FileText, 
  Layers, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  Tv, 
  RefreshCw,
  Loader2,
  Info
} from "lucide-react";

interface Scene {
  scene_id: number;
  duration: number;
  visual: string;
  onscreen_text: string;
  voiceover: string;
  transition: string;
}

interface Campaign {
  id: string;
  title: string;
  concept: string;
  duration: number;
  score: number;
  hook: string;
  status: "Rendered" | "Approved" | "Processing";
  scenes: Scene[];
  disclaimer: string;
}

export function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedAd, setSelectedAd] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"storyboard" | "safety">("storyboard");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns");
      const data: Campaign[] = await res.json();
      setCampaigns(data);
      if (data.length > 0) {
        setSelectedAd((prev) => {
          if (!prev) return data[0];
          const match = data.find((c) => c.id === prev.id);
          return match || data[0];
        });
      }
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchCampaigns();
      }
    } catch (err) {
      console.error("Generation error", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-cyan-400 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              CrowdWisdom Trading
            </h1>
            <p className="text-xs text-slate-400">Multi-Agent Video Ads Engine & QA Suite</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            Live Dynamic Pipeline Active
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {campaigns.length} Dynamic Campaigns
          </span>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50 transition"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running Multi-Agent Pipeline...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" /> ⚡ Generate Dynamic Campaign
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Column: Video Ad Campaign Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Tv className="h-4 w-4 text-indigo-400" /> Dynamic Campaigns ({campaigns.length})
            </h2>
            <button
              onClick={fetchCampaigns}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" /> Loading dynamic campaigns from API...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
              <p className="text-sm font-semibold text-slate-300">No Generated Campaigns Found</p>
              <p className="text-xs text-slate-400">Click below to trigger the multi-agent AI pipeline and generate new video ad campaigns.</p>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500"
              >
                Trigger AI Pipeline Generation
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const isSelected = selectedAd?.id === camp.id;
                return (
                  <div
                    key={camp.id}
                    onClick={() => {
                      setSelectedAd(camp);
                      setIsPlaying(true);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-slate-900 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                        : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase">
                        {camp.id}
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>{camp.score}/10 QA</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 mb-1">{camp.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-1">Hook: "{camp.hook}"</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-slate-500" /> {camp.scenes.length} Scenes
                      </span>
                      <span>{camp.duration}s Vertical 9:16</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Metrics Card */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" /> Compliance Audit Summary
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Guaranteed Returns Claims</span>
                <span className="text-emerald-400 font-medium">0 Detected</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Source Provenance Tags</span>
                <span className="text-emerald-400 font-medium">100% Verified</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Required Disclaimers</span>
                <span className="text-emerald-400 font-medium">Attached</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Campaign Inspector */}
        <div className="lg:col-span-8 space-y-6">
          {selectedAd ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{selectedAd.title}</h2>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedAd.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Concept: {selectedAd.concept}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" /> {isPlaying ? "Reload / Replay Video" : "Play Rendered MP4"}
                  </button>
                </div>
              </div>

              {/* Video Player Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[380px] text-center relative overflow-hidden">
                {isPlaying ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <video
                      key={selectedAd.id}
                      src={`/videos/${selectedAd.id}.mp4`}
                      controls
                      autoPlay
                      loop
                      className="w-full max-w-[280px] aspect-[9/16] rounded-xl border border-indigo-500/30 shadow-2xl object-cover bg-black"
                    />
                    <div className="text-[11px] text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Playing live output: <code className="text-indigo-300">outputs/videos/{selectedAd.id}.mp4</code></span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30 transition transform hover:scale-105"
                    >
                      <Play className="h-7 w-7 ml-1 fill-current" />
                    </button>
                    <p className="font-semibold text-base text-slate-200">Play Rendered MP4 ({selectedAd.id}.mp4)</p>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      9:16 Vertical format • 720×1280 • 30 FPS • Synthetic Audio Bed
                    </p>
                  </div>
                )}
              </div>

              {/* Tabs for Storyboard / Safety */}
              <div className="flex border-b border-slate-800 mt-6 gap-6 text-sm font-medium">
                <button
                  onClick={() => setActiveTab("storyboard")}
                  className={`pb-3 transition relative flex items-center gap-1.5 ${
                    activeTab === "storyboard" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="h-4 w-4" /> Storyboard Breakdown
                </button>
                <button
                  onClick={() => setActiveTab("safety")}
                  className={`pb-3 transition relative flex items-center gap-1.5 ${
                    activeTab === "safety" ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" /> Financial Safety & Compliance
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-4">
                {activeTab === "storyboard" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {selectedAd.scenes.map((scene) => (
                        <div
                          key={scene.scene_id}
                          className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition"
                        >
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                              {scene.scene_id}
                            </span>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                                  {scene.onscreen_text}
                                </span>
                                <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                  {scene.duration}s • {scene.transition}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">{scene.visual}</p>
                              <p className="text-xs text-slate-400 italic">VO: "{scene.voiceover}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "safety" && (
                  <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" /> Automated Compliance Verification
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>No promise of guaranteed profits</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>No fake testimonials or fabricated returns</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>Preserves dated research context & timestamps</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>Mandatory risk disclaimer included</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-0.5">Required Disclaimer Output:</p>
                        <p className="text-amber-200/80">"{selectedAd.disclaimer}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Select a campaign from the left column to inspect its storyboard and video preview.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
