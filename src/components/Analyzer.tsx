import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Scan, 
  CheckCircle2, 
  AlertCircle,
  Move,
  LayoutTemplate
} from "lucide-react";
import { clsx } from "clsx";

export interface LayoutAnalysisResponse {
  detectedElements: string[];
  spaceAssessment: string;
  limitations: string[];
  suggestedLayouts: {
    name: string;
    description: string;
    furnitureToAdd: {
      item: string;
      position: string;
      reason: string;
    }[];
  }[];
  ergonomicWarnings: string[];
}

// Helper function to read file as base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
}

const processingSteps = [
  "Malha Espacial Ativa...",
  "Detecção de Objetos em Execução...",
  "Executando Lógica de Ergonomia...",
];

export default function Analyzer() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  
  const [analysisResult, setAnalysisResult] = useState<LayoutAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Por favor, selecione um arquivo de imagem válido (.jpg, .png).");
        return;
      }
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
      setError(null);
    }
  };

  const startAnalysis = async () => {
    if (!imageFile) return;

    setIsProcessing(true);
    setAnalysisResult(null);
    setError(null);
    setProcessingStepIndex(0);

    // Simulate animated loading steps
    const stepInterval = setInterval(() => {
      setProcessingStepIndex((prev) => {
        if (prev < processingSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1200);

    try {
      const base64 = await fileToBase64(imageFile);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: imageFile.type })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erro do Servidor backend HTTP: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha do motor detectada. Reiniciando parâmetros.");
    } finally {
      clearInterval(stepInterval);
      setIsProcessing(false);
    }
  };

  const clearSession = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  }

  return (
    <div className="w-full flex flex-col h-full flex-1 min-h-0">
      {!imagePreviewUrl ? (
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mx-auto border border-dashed border-blue-500/30 hover:border-blue-500/70 transition-colors bg-white/[0.02] backdrop-blur-md rounded-[2rem] p-12 text-center cursor-pointer shadow-2xl group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handleFileSelect}
            />
            <div className="mx-auto w-24 h-24 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(37,99,235,0.1)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all">
              <Camera className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-[14px] uppercase tracking-[0.25em] text-blue-400 mb-2 font-bold group-hover:text-blue-300 transition-colors">INICIAR MODO DE ESCANEAMENTO</h3>
            <p className="mt-4 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Faça o upload da foto do ambiente para ativar o Pipeline Visual e o Motor de Layout Ergonômico.
            </p>
            <button className="mt-8 px-10 py-3 rounded-full bg-blue-600 text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors">
              Selecionar Foto
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6 w-full max-w-7xl mx-auto pb-4">
          
          {/* Sidebar: Vision Pipeline / Status */}
          <aside className="w-full lg:w-64 flex flex-col gap-6 shrink-0 custom-scrollbar overflow-y-auto lg:overflow-visible">
            <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-6 relative z-10 shadow-xl overflow-hidden min-h-0 shrink-0">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-4 bg-black/50 py-1 rounded inline-block px-2 border border-blue-500/20">Pipeline Visual</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Malha Espacial</span>
                      <span className="text-blue-400 font-mono text-[10px]">{isProcessing ? "Escaneando..." : "Ativa"}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: isProcessing && processingStepIndex < 2 ? "40%" : "88%" }}
                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Detecção de Objetos</span>
                      <span className="text-blue-400 font-mono text-[10px]">
                        {isProcessing ? "Processando" : analysisResult ? `${analysisResult.detectedElements.length} Itens` : "Aguardando"}
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: isProcessing ? "60%" : analysisResult ? "100%" : "0%" }}
                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Lógica de Ergonomia</span>
                      <span className="text-blue-400 font-mono text-[10px]">
                         {analysisResult ? "Pronto" : "Aguardando"}
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: analysisResult ? "100%" : "0%" }}
                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2 min-h-0 flex-shrink-0">
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 pt-2">Estimativa de Profundidade</h3>
                <div className="flex-1 min-h-[80px] rounded-lg bg-gradient-to-tr from-indigo-950 via-blue-900 to-emerald-900 border border-white/10 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>
                   {isProcessing && (
                     <>
                       <div className="absolute top-1/2 left-4 w-12 h-1 bg-white/20 animate-pulse"></div>
                       <div className="absolute top-1/3 right-8 w-8 h-8 rounded-full border border-white/20"></div>
                     </>
                   )}
                </div>
              </div>

              {error ? (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl custom-scrollbar overflow-y-auto max-h-32">
                   <p className="text-[10px] text-red-300 leading-relaxed">
                    <span className="font-bold">ERROR:</span> {error}
                  </p>
                </div>
              ) : analysisResult?.spaceAssessment ? (
                <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl custom-scrollbar overflow-y-auto shrink-0 max-h-48 relative shadow-inner">
                  <p className="text-[10px] text-blue-300 leading-relaxed">
                    <span className="font-bold text-blue-400 block mb-1">AI NOTICE</span> 
                    {analysisResult.spaceAssessment}
                  </p>
                </div>
              ) : null}

              <button 
                onClick={clearSession}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-[0.1em] text-slate-400 hover:text-white transition-colors mt-auto shrink-0"
              >
                Reiniciar Sessão
              </button>
            </div>
          </aside>

          {/* Main AR Viewport */}
          <main className="flex-1 relative bg-slate-900 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col group min-h-[400px]">
            <div className="absolute inset-0 z-0">
               <img 
                  src={imagePreviewUrl} 
                  alt="Upload" 
                  className={clsx("w-full h-full object-cover opacity-50 mix-blend-luminosity brightness-75 transition-all duration-700", isProcessing ? "grayscale blur-sm scale-105" : "scale-100")}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)] opacity-50" />
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                   <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
                   </pattern>
                   <rect width="100" height="100" fill="url(#grid)" />
                </svg>

                {/* Scanning Overlay Animation */}
                {isProcessing && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-blue-500/20 to-blue-400/40 border-b-2 border-blue-400 shadow-[0_4px_30px_rgba(59,130,246,0.3)] z-10 box-border"
                    />
                  </div>
                )}
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col p-6 pointer-events-none">
               {/* HUD Overlays */}
               {analysisResult && (
                <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto">
                  <div className="text-[10px] text-blue-400 font-bold tracking-[0.2em] mb-1">CALIBRAÇÃO</div>
                  <div className="text-xl font-mono text-white">AUTO <span className="text-[10px] text-slate-500">ESCALA</span></div>
                </div>
               )}

              {/* Empty State / Processing State */}
              {!analysisResult && !isProcessing && (
                <div className="m-auto pointer-events-auto">
                  <button 
                    onClick={startAnalysis}
                    className="px-8 py-3 rounded-full bg-blue-600/90 backdrop-blur border border-blue-500/50 text-white text-xs uppercase font-bold tracking-[0.2em] hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,99,235,0.6)] animate-pulse flex items-center gap-2"
                  >
                    <Scan className="w-4 h-4" /> Iniciar Motor
                  </button>
                </div>
              )}

              {isProcessing && (
                <div className="m-auto pointer-events-auto text-center">
                   <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                     <Scan className="w-10 h-10 text-blue-400 animate-spin" />
                   </div>
                   <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-black/40 px-4 py-2 rounded-full border border-blue-500/20">
                      {processingSteps[processingStepIndex]}
                   </div>
                </div>
              )}
              
              {(analysisResult?.limitations?.length > 0 || analysisResult?.ergonomicWarnings?.length > 0) && (
                <div className="absolute top-6 right-6 p-4 max-w-[260px] bg-black/60 backdrop-blur-xl border border-orange-500/30 rounded-2xl pointer-events-auto shadow-2xl">
                  <div className="flex items-center gap-2 text-[10px] text-orange-400 font-bold tracking-[0.1em] mb-3 uppercase border-b border-orange-500/20 pb-2">
                     <AlertCircle className="w-4 h-4 shrink-0" /> Restrições ERGO
                  </div>
                  <div className="text-[10px] text-orange-200/80 space-y-2 leading-relaxed">
                     {analysisResult.limitations?.map((l: string, i: number) => <p key={`l-${i}`} className="flex gap-2"><span className="text-orange-500/50">•</span> <span>{l}</span></p>)}
                     {analysisResult.ergonomicWarnings?.map((w: string, i: number) => <p key={`w-${i}`} className="flex gap-2"><span className="text-orange-500/50">•</span> <span>{w}</span></p>)}
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-8 py-3 rounded-full border border-emerald-500/20 pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-3 pr-5 border-r border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-400">SUCESSO</span>
                  </div>
                  <div className="flex items-center gap-2 pl-3">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-slate-300 opacity-80">LAYOUTS GERADOS: {analysisResult.suggestedLayouts.length}</span>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar: Recommendations */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0 custom-scrollbar overflow-y-auto lg:overflow-visible">
            <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-5 overflow-y-auto custom-scrollbar flex flex-col shadow-xl min-h-0 relative z-10 shrink-0">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-6 shrink-0 bg-black/50 py-1 rounded inline-block px-2 border border-blue-500/20">Recomendações Inteligentes</h3>
              
              <div className="space-y-4 flex-1">
                {analysisResult ? (
                  analysisResult.suggestedLayouts.map((layout, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer group hover:bg-white/[0.07] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 pointer-events-none transition-colors"></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors relative z-10 uppercase tracking-widest">{layout.name}</span>
                        <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-500/30 relative z-10">ENCAIXE IDEAL</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 relative z-10">{layout.description}</p>
                      
                      <div className="space-y-3 pt-3 border-t border-white/10 relative z-10">
                        {layout.furnitureToAdd.map((item, j) => (
                           <div key={j} className="flex gap-3 text-[10px] p-2 bg-black/30 rounded border border-white/5 group-hover:border-white/10">
                             <div className="mt-0.5">
                               <Move className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                             </div>
                             <div className="flex flex-col gap-1">
                               <span className="text-slate-300 font-semibold uppercase">{item.item}</span>
                               <span className="text-slate-500 leading-snug"><strong className="text-slate-400 opacity-70 font-normal">Pos:</strong> {item.position}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 opacity-30 grayscale h-full flex flex-col items-center justify-center text-center">
                     <LayoutTemplate className="w-8 h-8 text-slate-500 mb-3" />
                     <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 block mb-2">Aguardando Escaneamento...</span>
                     <p className="text-[10px] text-slate-500">Inicie o motor para gerar layouts inteligentes.</p>
                  </div>
                )}
              </div>
            </div>

            {analysisResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-blue-600/90 to-blue-900/90 backdrop-blur border border-blue-400/30 rounded-2xl p-5 flex flex-col justify-between shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
              >
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">Motor de Auto-Escala</div>
                  <div className="text-xl font-light text-white mt-1 tracking-tight">Pronto para Exportar</div>
                </div>
                <button className="w-full mt-5 py-3 bg-black/30 hover:bg-black/50 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all text-white border border-transparent hover:border-white/20">
                  Sincronizar Catálogo
                </button>
              </motion.div>
            )}
          </aside>

        </div>
      )}
    </div>
  );
}
