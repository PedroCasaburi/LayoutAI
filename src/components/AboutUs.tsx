import { motion } from "motion/react";
import { Users, Target, Rocket } from "lucide-react";

const sections = [
  {
    id: "mission",
    icon: <Target className="w-6 h-6 text-blue-500" />,
    title: "Nossa Missão",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>
          Acreditamos que design de interiores não deve ser um quebra-cabeça 3D complexo. Nossa missão é democratizar a ergonomia espacial através de inteligência artificial de ponta.
        </p>
        <p>
          A maioria das ferramentas exige que você saiba exatamente o que quer e onde colocar. Nós queremos que você apenas nos mostre o seu espaço, e nós fazemos o resto. O <strong className="text-white">RoomLens AI</strong> existe para transformar o estresse de decorar em uma experiência mágica de um clique.
        </p>
      </div>
    )
  },
  {
    id: "vision",
    icon: <Rocket className="w-6 h-6 text-emerald-500" />,
    title: "Nossa Visão",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>
          Visualizamos um futuro onde qualquer pessoa, com apenas um smartphone, pode ter acesso ao nível de excelência de um arquiteto e designer de interiores sênior. 
        </p>
        <p>
          Queremos redefinir a relação entre humanos e seus espaços, garantindo que cada ambiente não apenas pareça bonito, mas funcione perfeitamente de acordo com princípios ergonômicos comprovados e fluxos de movimento naturais.
        </p>
      </div>
    )
  },
  {
    id: "team",
    icon: <Users className="w-6 h-6 text-purple-500" />,
    title: "Quem Somos",
    content: (
      <div className="space-y-4 text-[10px] sm:text-xs text-slate-400 leading-relaxed">
        <p>
          Somos uma equipe de designers, engenheiros de visão computacional e entusiastas da IA que se cansaram de arrastar modelos 3D mal otimizados em telas pequenas.
        </p>
        <p>
          Construímos o motor que gostaríamos de usar quando nos mudamos de apartamento: algo inteligente, espacialmente ciente e focado na usabilidade, integrando os mais recentes avanços em LLMs multimodais e estimativa de profundidade.
        </p>
      </div>
    )
  }
];

export default function AboutUs() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-0 sm:p-4">
      <div className="flex flex-col space-y-2 mb-8 border-b border-white/10 pb-6">
        <h2 className="text-2xl font-light tracking-tight text-white font-sans uppercase tracking-[0.1em]">
          About <span className="font-bold text-blue-500">Us</span>
        </h2>
        <p className="text-[11px] sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          The story and philosophy behind the <strong>RoomLens AI</strong> project. Understanding the spatial awareness revolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
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
