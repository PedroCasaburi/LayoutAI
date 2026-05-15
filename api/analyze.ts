// ////////////////////////////////////////////////////////
// VERCEL SERVERLESS FUNCTION - /api/analyze.ts
// ////////////////////////////////////////////////////////
// Este arquivo foi criado como referência para implantação 
// direta como uma Serverless Function na Vercel.
//
// O projeto local usa server.ts (Express), mas na Vercel
// as requests para /api/analyze cairão diretamente neste arquivo.
// ////////////////////////////////////////////////////////

import { GoogleGenAI } from '@google/genai';

// Instância segura rodando no servidor Vercel
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || '' 
});

// Aumenta o limite do body-parser nativo da Vercel para imagens Base64
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada nas Environment Variables da Vercel" });
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
    return res.status(200).json(data);

  } catch (error: any) {
    console.error("Erro na Serverless Function (Vercel):", error);
    return res.status(500).json({ error: error.message || "Falha ao analisar a imagem no servidor" });
  }
}
