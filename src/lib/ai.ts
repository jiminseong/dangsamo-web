import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function analyzeFree(input: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    당신은 소비자를 보호하는 "광고 리스크 점검" 전문가입니다.
    사용자가 입력한 상품명 또는 URL에 대해 과장 광고 위험성을 분석하세요.
    
    입력: ${input}
    
    출력 형식: 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 생략하세요.
    {
      "riskScore": 0-100 (정수, 높을수록 위험),
      "shortReasons": ["이유1", "이유2"] (최대 2개, 짧고 친근한 한국어)
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch {
    console.error("AI Response Parsing Error:", text);
    return { riskScore: 50, shortReasons: ["분석 중 오류가 발생했습니다."] };
  }
}

export async function analyzePaid(input: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
    당신은 소비자를 보호하는 "광고 리스크 점검" 전문가입니다.
    사용자가 입력한 상품명 또는 URL에 대해 과장 광고 위험성을 상세히 분석하세요.
    
    입력: ${input}
    
    출력 형식: 반드시 아래 JSON 형식으로만 응답하세요. 다른 설명은 생략하세요.
    {
      "riskScore": 0-100 (정수),
      "signals": [{"type":"의심 신호 종류", "reason":"구체적 이유"}],
      "implications": ["사용자에게 미치는 영향1", "영향2"],
      "nextActions": ["권장 행동1", "권장 행동2"]
    }
    
    모든 문구는 "귀엽고 단정한" 톤으로, 생활 밀착형 단어(리스크 점검, 체크, 확인 등)를 사용하세요. 
    "AI가 분석합니다" 같은 표현은 피하세요.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch {
    console.error("AI Response Parsing Error:", text);
    return {
      riskScore: 50,
      signals: [],
      implications: ["상세 분석 중 오류가 발생했습니다."],
      nextActions: ["잠시 후 다시 시도해주세요."],
    };
  }
}
