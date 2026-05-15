import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Setup Gemini client using Server-Side Environment Variable
  const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY || '' 
  });

  // Body parser with 50mb limit for massive base64 images
  app.use(express.json({ limit: '50mb' }));

  // ==========================================
  // API ROUTES
  // ==========================================
  
  // Endpoint compatível com a arquitetura serverless (usado na Vercel também)
  app.post('/api/analyze', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "Nenhuma imagem fornecida" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor" });
      }

      const prompt = `Você é um arquiteto sênior e engenheiro de produto focado em otimização de layout de interiores e ergonomia espacial.
Analise esta imagem fornecida pelo usuário, que é o ambiente que ele quer otimizar.
Aja como a inteligência por trás do nosso aplicativo "RoomLens AI".

Retorne APENAS um JSON válido e estritamente formatado com a seguinte estrutura (responda em Português-BR):
{
  "detectedElements": ["string (ex: porta principal, janela dupla, sofá existente)"],
  "spaceAssessment": "string (avaliação geral de como o espaço atual está, fluxo visual, iluminação)",
  "limitations": ["string (restrições identificadas na foto, ex: porta bloqueia canto esquerdo, teto baixo)"],
  "suggestedLayouts": [
    {
      "name": "string (Nome atraente do layout)",
      "description": "string (A estratégia geral deste layout)",
      "furnitureToAdd": [
        {"item": "string", "position": "string (onde colocar)", "reason": "string (justificativa de usabilidade/ergonomia)"}
      ]
    }
  ] // sugira pelo menos 2 layouts diferentes
  "ergonomicWarnings": ["string (avisos de circulação, ex: Mantenha 80cm livres em frente à porta principal)"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: mimeType || "image/jpeg",
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2, 
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Sem resposta da IA");
      }

      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error("Erro na Análise (Backend):", error);
      res.status(500).json({ error: error.message || "Falha ao analisar a imagem no servidor" });
    }
  });

  // ==========================================
  // VITE MIDDLEWARE (Desenvolvimento / Produção)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Modo de produção: Servir arquivos compilados (dist)
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
