import { GoogleGenAI, Type } from "@google/genai";
import { GradeLevel, LessonContent, QuizQuestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const aiService = {
  async simplifyContent(text: string, grade: GradeLevel): Promise<Partial<LessonContent>> {
    const prompt = `
      Agis comme un professeur expert pour enfants. 
      Simplifie le contenu suivant pour un élève de niveau ${grade}.
      Le contenu doit être engageant, facile à comprendre, et pédagogique.
      
      Structure de la réponse souhaitée (JSON):
      {
        "title": "Titre accrocheur",
        "simplifiedText": "Texte simplifié et amusant",
        "keywords": ["mot1", "mot2", "mot3"],
        "summary": "Résumé en 2-3 phrases"
      }

      Contenu : ${text.substring(0, 5000)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              simplifiedText: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              summary: { type: Type.STRING }
            },
            required: ["title", "simplifiedText", "keywords", "summary"]
          }
        }
      });

      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("AI Simplification Error:", error);
      throw error;
    }
  },

  async generateQuiz(text: string, grade: GradeLevel): Promise<QuizQuestion[]> {
    const prompt = `
      Génère un mini-quiz de 3 questions QCM basées sur ce cours pour un élève de ${grade}.
      Chaque question doit avoir 3 options et une seule bonne réponse (index 0, 1 ou 2).
      Utilise un ton encourageant.

      Structure souhaitée (JSON):
      [
        {
          "question": "Texte de la question",
          "options": ["Option A", "Option B", "Option C"],
          "correctAnswer": 0
        }
      ]

      Cours : ${text.substring(0, 3000)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("AI Quiz Generation Error:", error);
      throw error;
    }
  }
};
