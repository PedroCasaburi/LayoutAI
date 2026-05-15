import { motion } from "motion/react";
import { 
  Cpu, 
  Layers, 
  LayoutTemplate, 
  ShoppingCart, 
  Sparkles, 
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const sections = [
  {
    id: "architecture",
    icon: <Cpu className="w-6 h-6 text-blue-500" />,
    title: "1. Arquitetura do Sistema",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>A arquitetura focará na execução leve (Edge/Mobile) combinada com inteligência pesada na nuvem.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong className="text-white">Client-Side (App/PWA):</strong> React Native ou PWA com WebGL. Responsável por capturar imagens, desenhar bounding boxes no modo 2D interativo e renderizar a UI.</li>
          <li><strong className="text-white">Edge ML:</strong> Modelos leves usando TensorFlow.js ou On-Device ML (CoreML/NNAPI) apenas para primeira triagem (detecção rápida de ambiente).</li>
          <li><strong className="text-white">Core Backend (Nuvem):</strong> Python (FastAPI/gRPC) hospedando o <em className="text-blue-400">Pipeline Visual</em> (estimativa de profundidade e instância-segmentação robusta) via GPUs.</li>
          <li><strong className="text-white">Layout Engine (LLM + Heurística):</strong> Integração com Google Gemini Vision para entendimento contextual do ambiente aliado a um motor de regras estrito em TypeScript para garantir a ergonomia física.</li>
          <li><strong className="text-white">Database:</strong> PostgreSQL + pgvector para armazenamento do catálogo de móveis com busca de similaridade e dimensões geométricas.</li>
        </ul>
      </div>
    )
  },
  {
    id: "pipeline",
    icon: <Layers className="w-6 h-6 text-emerald-500" />,
    title: "2. Pipeline Visual",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>Como transformamos uma foto numa tela de layout inteligente:</p>
        <ol className="list-decimal pl-5 space-y-2 font-mono">
          <li><strong>Captura:</strong> Foto RBG do smartphone (ou frame estático).</li>
          <li><strong>Segmentação Semântica:</strong> Mask2Former identifica chão, parede, teto e móveis.</li>
          <li><strong>Depth Estimation:</strong> Depth Anything V2 gera um mapa relativo Z-index.</li>
          <li><strong>Recuperação de Escala:</strong> Uso de âncoras universais (altura porta 2.10m).</li>
          <li><strong>Calculo Vazio:</strong> Construção do "NavMesh" (malha de navegação) do ambiente.</li>
          <li><strong>Projecção:</strong> Desenha overlays Wireframes em perspectiva forçada.</li>
        </ol>
      </div>
    )
  },
  {
    id: "intelligence",
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    title: "3. Inteligência de Layout",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>Em vez de exigir que o usuário arraste móveis no AR, o motor FAZ o layout e sugere aprovação.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Regras codificadas que um designer usaria (ex: conforto em camas, passagens).</li>
          <li>O sistema gera 3 arquétipos estruturais de design:
            <br/> - <em className="text-blue-300">"Sensação de Amplitude"</em>
            <br/> - <em className="text-blue-300">"Foco em Convivência"</em>
          </li>
          <li>Validação negativa: O motor bloqueia fisicamente arranjos não ergonômicos.</li>
        </ul>
      </div>
    )
  },
  {
    id: "catalog",
    icon: <ShoppingCart className="w-6 h-6 text-indigo-400" />,
    title: "4. Integração de Catálogo",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>A base de dados é fundamentalmente geométrica, além de estética.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Modelagem com <code>bounding_box_3d</code> explícito para filtragem milimétrica.</li>
          <li>Filtro Algorítmico impede que armários maiores que a parede de destino sejam mostrados.</li>
          <li>Visualização via <code>.glTF</code> otimizados.</li>
        </ul>
      </div>
    )
  },
  {
    id: "ux",
    icon: <LayoutTemplate className="w-6 h-6 text-rose-500" />,
    title: "5. Experiência de Usuário (UX) Simplificada",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>Ferramentas AR atuais parecem CADs para arquitetos. Focaremos no usuário humano.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Workflow Auto:</strong> 1-Click Scan Mode. Motor processa geometria na nuvem.</li>
          <li><strong>Cards Estáticos:</strong> Match de catálogo por swiping, limitando fadiga 3D.</li>
          <li><strong>Wireframing First:</strong> Caixas guias semi-transparentes em vez de renders pesados.</li>
        </ul>
      </div>
    )
  },
  {
    id: "limitations",
    icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
    title: "6. Limitações e Contornos",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed border border-white/5 bg-white/5 rounded-xl p-4">
        <ul className="list-disc pl-4 space-y-2 text-orange-200/90">
          <li>Escala Monocular sem LiDAR exige âncoras heurísticas.</li>
          <li>Oclusão de câmera pede modo panorama simulado.</li>
          <li>Necessidade de avisos sobre baixa luminosidade afetando precisão.</li>
        </ul>
      </div>
    )
  },
  {
    id: "roadmap",
    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
    title: "7. Roadmap Evolutivo",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed relative border-l border-white/20 ml-2 pl-4">
        <div className="relative">
          <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[21px] top-1.5 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <h4 className="font-bold text-white uppercase tracking-wider">v1.0 - Core Engine MESH (Atual)</h4>
          <p className="mt-1">Pipeline de Inteligência Estática + Visão de Profundidade.</p>
        </div>
        <div className="relative">
          <div className="absolute w-2 h-2 bg-slate-700 rounded-full -left-[21px] top-1.5"></div>
          <h4 className="font-bold text-slate-300 uppercase tracking-wider">v2.0 - Sincronização LiDAR ao Vivo</h4>
          <p className="mt-1 text-slate-500">Aceleração via sensores profundidade nativos.</p>
        </div>
        <div className="relative">
          <div className="absolute w-2 h-2 bg-slate-700 rounded-full -left-[21px] top-1.5"></div>
          <h4 className="font-bold text-slate-300 uppercase tracking-wider">v3.0 - IA Generativa de Substituição</h4>
          <p className="mt-1 text-slate-500">Eraser Inteligente para móveis velhos do catálogo original.</p>
        </div>
      </div>
    )
  }
];

export default function Architecture() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-0 sm:p-4">
      <div className="flex flex-col space-y-2 mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-light tracking-tight text-white font-sans uppercase tracking-[0.1em]">
          Engine <span className="font-bold text-blue-500">Strategy</span>
        </h2>
        <p className="text-[11px] sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          The theoretical framework powering the <strong>"1-Click"</strong> semantic optimization tool, built to bypass complex manual drag-and-drop CAD mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-black/40 border border-white/5 hover:border-blue-500/30 transition-colors rounded-2xl p-6 shadow-xl flex flex-col gap-4"
          >
            <div className="flex items-center space-x-3 border-b border-white/5 pb-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                {section.icon}
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-widest leading-tight">
                {section.title}
              </h3>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
