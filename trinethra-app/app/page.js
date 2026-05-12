"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Play, FileText } from "lucide-react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const loadSample = (index) => {
    // In a real app we might fetch these, but for demo we can just paste the text
    const samples = [
      "Karthik? Haan, he is good. Very sincere boy. Comes on time, leaves on time — actually he stays late most days, I don't ask him to. He's always on the floor. He's not one of those people who sits in the office and sends emails. He's hands-on.\n\nWhat does he do? He helps me with production tracking. Earlier I used to maintain everything in my head — how many pieces came off each machine, what's the rejection rate, what's pending for dispatch. Now Karthik maintains a sheet. Every evening he updates it and sends it to me on WhatsApp. Very useful. I look at it every morning before the shift meeting.\n\nHe also handles a lot of the coordination. When we have quality complaints from Tier 1 — they send an email, sometimes call directly — Karthik takes the first call. He notes down the complaint, talks to the QC team, and gives me a summary. Earlier I used to handle all of this myself. Big relief.\n\nThe new drum brake line — he's been involved from the beginning. He helped set up the machine layout. He did a study on cycle times and suggested we move the deburring station closer to the CNC machines. Good idea. We did it. Saved maybe 10 minutes per batch in material handling.\n\nAny complaints? No, not really. Sometimes he asks too many questions — like he wants to understand everything before doing it. Sometimes in a factory you just need to do it and learn by doing. But this is a minor thing.\n\nOne thing — he doesn't really push back. If I tell him to do something, he does it. Even if it's not the best way. I wish he would tell me sometimes, 'Sir, I think we should do it differently.' But maybe he's still new. He'll get there.\n\nOverall I'm happy. He's become part of the team. The workers on the floor know him. He speaks to them in Marathi — that helps. If you asked them, they would say he's one of us.",
      "Meena. Look, she is smart. No doubt. She understands things quickly. But I have some concerns.\n\nShe spends too much time on her laptop. In a garment factory, the action is on the floor — cutting, stitching, finishing, packing. If you're not on the floor, you're not seeing what's happening. I tell her — go to the floor, talk to the line supervisors, see what's stuck. She goes, but after 30 minutes she's back at her desk typing.\n\nShe made some Excel sheets. Fine. One is an order tracker — which order is at which stage, what's the expected completion date. Another one tracks rejection percentages by line. She showed it to me last week in a meeting. The data was correct, I'll give her that. She found that Line 3 has 14% rejection compared to 6% average on the other lines. Nobody had quantified this before.\n\nBut here's my problem. I showed this to my production manager and he said, 'So? We know Line 3 has issues. The operators are new.' So the data is correct but the people on the floor already know. Meena is telling us what we already know, just in Excel format.\n\nShe also wrote something she calls an 'SOP' for the cutting section. Step-by-step process for how to handle a new order — from fabric receiving to pattern matching to cut-plan approval. I looked at it. It's well-written. But nobody uses it. She pinned it on the wall near the cutting master's station. It's still there. Nobody reads it.\n\nI told her — the problem is not that we don't have a process. The problem is that the cutting master gets 5 phone calls during a changeover and loses focus. An SOP on the wall doesn't solve that. She needs to understand the floor reality, not just write documents.\n\nOn the positive side — she did something useful with the dispatch team. She started tracking which orders are at risk of missing the ship date and sending me a daily email by 11 AM. Before this, I would find out about delays at 4 PM when the container was supposed to leave. Now I know by 11 AM and can push. Two weeks ago we saved a shipment to Decathlon because of this. That was good.\n\nMy worry is that she's building things in Excel that nobody asked for and nobody uses. I need someone who solves problems on the floor, not someone who makes beautiful sheets in the office.\n\nIs she failing? No. She's trying. She's just not connecting her work to what actually matters here. If she learns to do that, she could be very good.",
      "Anil is my right hand. I don't know how we managed before him.\n\nEvery morning he's in my office at 8:15 with the day's plan — what's in production, what's getting dispatched, what needs my attention. He prioritizes. Before Anil, I used to walk into the factory and get hit with 10 problems at once. Now he filters. He tells me — these 3 need your decision, these 7 I'll handle.\n\nHe handles the retailer complaints. If a retailer calls about expired stock or taste issues, Anil takes the call, logs it, coordinates with the production team to pull the batch records, and gets back to the retailer within 24 hours. Our complaint closure time has gone from 5 days to under 2 days since he started.\n\nHe manages the daily production meeting. I used to run it — 45 minutes, no agenda, everyone talks about everything. Anil took it over, made a structure, now it's 20 minutes. He keeps it focused.\n\nHe also coordinates with our distributor in Pune and the one in Aurangabad. He tracks their stock levels, tells dispatch when to send the next shipment. Earlier my dispatch supervisor would wait until the distributor called and said 'we're out of stock.' Now Anil tracks it proactively.\n\nI'll tell you a story. Three weeks ago, we had a power failure at 2 AM. The cold chain broke. Anil wasn't there — it was the night shift. But the night supervisor called him. Anil came to the factory at 3 AM, personally checked the temperature logs, identified which batches were compromised, held them from dispatch, and had the QC reports ready by the time I arrived at 8 AM. No compromised product reached the market. Last year, a similar incident happened and we had to recall 200 cases of paneer from Reliance Fresh. This time — zero impact.\n\nDoes he have areas to improve? I'm sure he does, but honestly I can't think of any right now. He's so helpful. He takes so much off my plate. I feel like I can finally focus on the business instead of firefighting.\n\nMy production manager — Raghav — he's been here 8 years. He's good at running the machines but he doesn't plan. Anil has started doing Raghav's planning for him. Raghav gives Anil the list of orders and Anil creates the production schedule. I know this is not ideal — Raghav should do his own planning. But it works, so I haven't said anything.\n\nOne more thing — Anil writes very well. His reports to me are clear. When I forward them to my accountant or my distributor, they understand. He has a professional quality that we don't usually see at this level.\n\nIf I could keep him for 2 years instead of 6 months, I would."
    ];
    setTranscript(samples[index]);
  };

  const handleAnalyze = async () => {
    if (!transcript) {
      setError("Please enter a transcript.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze transcript");
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-indigo-900 text-white shadow-md py-4 px-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileText size={24} className="text-indigo-100" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Trinethra</h1>
              <p className="text-indigo-300 text-xs uppercase tracking-wider font-semibold">Supervisor Feedback Analyzer</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <FileText size={18} className="mr-2 text-indigo-500" />
                Transcript Input
              </h2>
            </div>
            <div className="flex space-x-2 mb-3">
              <button onClick={() => loadSample(0)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium">Sample 1 (Karthik)</button>
              <button onClick={() => loadSample(1)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium">Sample 2 (Meena)</button>
              <button onClick={() => loadSample(2)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium">Sample 3 (Anil)</button>
            </div>
            <textarea
              className="w-full flex-grow p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none min-h-[400px]"
              placeholder="Paste the supervisor's transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Play size={16} className="mr-2" />
                    Run Analysis
                  </span>
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start border border-red-100">
                <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 h-full min-h-[600px] flex flex-col overflow-hidden">
            {!result && !loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <FileText size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No Analysis Yet</h3>
                <p className="max-w-xs text-sm">Paste a transcript and click "Run Analysis" to generate a draft assessment.</p>
              </div>
            ) : loading ? (
              <div className="flex-grow flex flex-col items-center justify-center text-indigo-500">
                <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-medium animate-pulse text-indigo-600">Processing with Groq LLM...</p>
              </div>
            ) : (
              <div className="overflow-y-auto h-full p-5 space-y-6">
                
                {/* Score Section */}
                <div className="flex items-start space-x-4 bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white border-2 border-indigo-200 rounded-xl w-20 h-20 shadow-sm">
                    <span className="text-3xl font-bold text-indigo-700">{result.score?.value}</span>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">/ 10</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-indigo-900 mb-1">{result.score?.label}</h3>
                    <div className="inline-block bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-medium mb-3">
                      Band: {result.score?.band}
                    </div>
                    <p className="text-sm text-indigo-800 leading-relaxed">{result.score?.justification}</p>
                  </div>
                </div>

                <div className="text-xs text-center text-slate-400 uppercase tracking-widest font-semibold pb-2 border-b border-slate-100">
                  Detailed Findings
                </div>

                {/* Evidence Extraction */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center text-sm">
                    <CheckCircle2 size={16} className="mr-2 text-green-500" />
                    Extracted Evidence
                  </h4>
                  <div className="space-y-3">
                    {result.evidence?.map((ev, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm flex items-start">
                        <div className={`mt-0.5 w-2 h-2 rounded-full mr-3 flex-shrink-0 ${
                          ev.signal === 'positive' ? 'bg-green-500' : 
                          ev.signal === 'negative' ? 'bg-red-500' : 'bg-amber-400'
                        }`} />
                        <div>
                          <p className="italic text-slate-600 mb-2">"{ev.quote}"</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold">{ev.dimension}</span>
                            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold">{ev.signal}</span>
                          </div>
                          <p className="text-slate-700 text-xs">{ev.interpretation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* KPI Mapping */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">KPI Impact Identified</h4>
                    <div className="space-y-2">
                      {result.kpiMapping?.length > 0 ? result.kpiMapping.map((kpi, i) => (
                        <div key={i} className="border border-slate-100 bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-sm text-indigo-600">{kpi.kpi}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                              kpi.systemOrPersonal === 'system' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {kpi.systemOrPersonal}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{kpi.evidence}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-500 italic">No direct KPI impact mentioned.</p>
                      )}
                    </div>
                  </div>

                  {/* Gaps */}
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-3 text-sm">Detected Information Gaps</h4>
                    <div className="space-y-2">
                      {result.gaps?.length > 0 ? result.gaps.map((gap, i) => (
                        <div key={i} className="border-l-2 border-red-400 bg-red-50 p-3 rounded-r-lg">
                          <span className="block font-semibold text-xs text-red-700 uppercase mb-1">{gap.dimension}</span>
                          <p className="text-xs text-slate-700">{gap.detail}</p>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-500 italic">No significant gaps detected.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Follow Up Questions */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 text-sm bg-slate-100 px-3 py-2 rounded-md">
                    Suggested Follow-up Questions
                  </h4>
                  <ul className="space-y-3">
                    {result.followUpQuestions?.map((q, i) => (
                      <li key={i} className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-slate-800 mb-1">Q: {q.question}</p>
                        <p className="text-xs text-slate-500">
                          <span className="font-semibold">Target Gap:</span> {q.targetGap} | <span className="font-semibold">Looking for:</span> {q.lookingFor}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
