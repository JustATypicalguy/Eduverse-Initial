import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function isEducationalQuestion(question: string): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an educational content filter. Determine if a question is related to education, academic subjects, learning, teaching, curriculum, school programs, study methods, or educational concepts. 
          
          Educational topics include: subjects like math, science, languages, arts, history, geography, literature, technology, physical education, study tips, learning strategies, curriculum information, school programs, academic advice, educational theories, etc.
          
          Non-educational topics include: personal advice, entertainment, shopping, dating, politics, religion, medical advice, legal advice, financial advice, etc.
          
          Respond with JSON in this exact format: { "isEducational": true/false, "reason": "brief explanation" }`
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{"isEducational": false, "reason": "Unable to parse"}');
    return result.isEducational === true;
  } catch (error) {
    console.error("Error checking if question is educational:", error);
    return false;
  }
}

export async function answerEducationalQuestion(question: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Nilo AI, an educational assistant for Nilo. You help with:

          1. Academic subjects and curriculum information
          2. Study tips and learning strategies  
          3. Educational concepts and theories
          4. School programs (IB, IGCSE, etc.)
          5. Subject-specific questions
          6. Learning methodologies

          Provide helpful, accurate, and engaging educational responses. Keep responses concise but informative. If asked about Nilo specifically, mention that it offers:
          - Elementary (PYP), Middle (MYP), and High School (DP) programs
          - IB and IGCSE curricula
          - Subjects across Mathematics, Sciences, Languages, Arts, Social Studies, Technology, Physical Education, and Life Skills
          - Diverse education with students from 45+ countries

          Always maintain a helpful, educational tone.`
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try asking your question again.";
  } catch (error) {
    console.error("Error generating educational response:", error);
    return "I'm experiencing technical difficulties. Please try again later or contact our admissions team for assistance.";
  }
}
