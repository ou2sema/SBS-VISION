import React from 'react';
import { 
  Building2, 
  Warehouse, 
  Home, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight, 
  Shield 
} from 'lucide-react';
import { INDUSTRY_SOLUTIONS } from '../../data/solutionsData';
import { CustomerWebsiteRoute } from '../../types/customerWebsite';

interface SolutionsViewProps {
  onSelectSolution: (solution: any) => void;
  onRequestService: () => void;
  setCurrentRoute: (route: CustomerWebsiteRoute) => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  onRequestService,
  setCurrentRoute,
}) => {
  const getSolutionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return Building2;
      case 'Warehouse': return Warehouse;
      case 'Home': return Home;
      case 'ShoppingBag': return ShoppingBag;
      default: return Building2;
    }
  };

  return (
    <div className="py-16 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-blue-400 tracking-widest uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Sector-Specific Engineering
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Engineered Industry Solutions
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every building archetype presents unique radio frequency, cabling distance, and physical security challenges. We tailor our hardware selection and architecture to your operational reality.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {INDUSTRY_SOLUTIONS.map((sol) => {
            const Icon = getSolutionIcon(sol.icon);

            return (
              <div
                key={sol.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all shadow-xl"
              >
                <div className="space-y-4">
                  
                  {/* Title Header */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{sol.title}</h2>
                      <p className="text-xs text-blue-300 font-semibold mt-0.5">{sol.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sol.description}
                  </p>

                  {/* Challenges Solved */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Specific Architectural Challenges Solved:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sol.challengesSolved.map((c, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="text-slate-300 text-[11px]">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Case Study Highlight */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                      Field Execution Proof:
                    </span>
                    <p className="text-slate-300 italic text-[11px]">
                      "{sol.caseStudyHighlight}"
                    </p>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Custom on-site survey available</span>
                  <button
                    onClick={onRequestService}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md flex items-center space-x-1.5 transition-all"
                  >
                    <span>Request Site Survey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
