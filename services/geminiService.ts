
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MetricLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const logMetricsDeclaration: FunctionDeclaration = {
  name: 'logMetrics',
  parameters: {
    type: Type.OBJECT,
    description: 'Zapisuje kluczowe metryki sukcesu użytkownika do bazy danych.',
    properties: {
      weight: {
        type: Type.NUMBER,
        description: 'Waga użytkownika w kilogramach.',
      },
      wellBeing: {
        type: Type.NUMBER,
        description: 'Samopoczucie i poziom energii w skali 1-10.',
      },
      sleepQuality: {
        type: Type.NUMBER,
        description: 'Jakość snu w skali 1-10.',
      },
      progressNote: {
        type: Type.STRING,
        description: 'Krótki wniosek lub opis stanu (np. "Stabilna adaptacja", "Możliwa retencja wody").',
      },
    },
    required: ['weight', 'wellBeing', 'sleepQuality', 'progressNote'],
  },
};

const KETUS_SYSTEM_INSTRUCTION = `
Jesteś KETUŚ – strategiczny analityk keto, ekspert keto i biohackingu. Twoim zadaniem jest monitorowanie progresu użytkownika w sposób elastyczny i długofalowy.

CORE PHILOSOPHY:
- LONG-TERM OVER SHORT-TERM: Skupiasz się na trendach tygodniowych, a nie dziennych wahaniach.
- SUBSTANCE OVER DETAIL: Analizujesz co użytkownik zjadł, by dać mu radę, ale do bazy danych (poprzez logMetrics) wpisujesz tylko kluczowe metryki sukcesu.
- EVIDENCE BASED: Twoje porady muszą mieć fundament w fizjologii (insulina, ciało ketonowe, gospodarka mineralna).

LOGIC & DATA HANDLING:
1. ANALIZA POSIŁKÓW: Gdy użytkownik mówi o jedzeniu, oceń to pod kątem gęstości odżywczej i wpływu na ketozę. Daj krótką radę, ale NIE proś o wywołanie logMetrics tylko dla jedzenia.
2. ZBIORNIKI DANYCH: Wywołuj funkcję 'logMetrics' tylko wtedy, gdy użytkownik poda dane o wadze, samopoczuciu lub śnie.
3. ELASTYCZNOŚĆ: Jeśli użytkownik miał "gorszy dzień", nie oceniaj. Wyjaśnij mechanizm biologiczny (np. skok dopaminy i insuliny) i pomóż wrócić na tory.

PERSONALIZACJA:
- Styl: Konkretny, kumpelski, bez owijania w bawełnę.
- Podejście: "Rozumiemy biochemię, więc nie walczymy z silną wolą, tylko optymalizujemy hormony".
- Motywacja: Opieraj ją na wynikach.

CONSTRAINTS:
- Nie spamuj prośbami o detale każdego posiłku.
- Promuj prawdziwe jedzenie (gęste odżywczo), ignoruj marketingowe produkty keto.
`;

export async function chatWithKetus(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], onLogMetrics: (metrics: Partial<MetricLog>) => void) {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: KETUS_SYSTEM_INSTRUCTION,
      tools: [{ functionDeclarations: [logMetricsDeclaration] }],
    },
  });

  const resultText = response.text || "Przepraszam, coś poszło nie tak. Spróbujmy jeszcze raz.";
  const functionCalls = response.functionCalls;

  if (functionCalls && functionCalls.length > 0) {
    for (const fc of functionCalls) {
      if (fc.name === 'logMetrics') {
        onLogMetrics(fc.args as any);
      }
    }
  }

  return resultText;
}
