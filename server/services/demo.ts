// Demo mode responses for Study Buddy personalities
// Provides realistic, personality-specific responses when OpenAI API is not available

interface DemoResponse {
  message: string;
  response: string;
  isEducational: boolean;
}

// Simple educational topic detection for demo mode
export function isEducationalDemo(question: string): boolean {
  const educationalKeywords = [
    'math', 'science', 'history', 'geography', 'biology', 'chemistry', 'physics',
    'english', 'literature', 'language', 'art', 'music', 'study', 'homework',
    'exam', 'test', 'learn', 'explain', 'solve', 'calculate', 'essay', 'research',
    'university', 'college', 'grade', 'class', 'subject', 'curriculum', 'education',
    'teach', 'student', 'school', 'academic', 'knowledge', 'skill', 'training',
    'gravity', 'equation', 'formula', 'theory', 'concept', 'analysis', 'write'
  ];
  
  const lowerQuestion = question.toLowerCase();
  return educationalKeywords.some(keyword => lowerQuestion.includes(keyword));
}

export function generateDemoResponse(message: string, buddyType: string = 'general'): DemoResponse {
  const isEducational = isEducationalDemo(message);
  
  // Get topic-aware base response
  const baseResponse = getTopicResponse(message);
  
  // Apply personality styling
  const response = applyPersonalityStyle(baseResponse, buddyType, message);
  
  return {
    message,
    response,
    isEducational
  };
}

function getTopicResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Math topics
  if (lowerMessage.includes('math') || lowerMessage.includes('equation') || lowerMessage.includes('calculate')) {
    return "Mathematics is all about patterns and logical thinking! Let me break this down step by step for you.";
  }
  
  // Science topics
  if (lowerMessage.includes('gravity') || lowerMessage.includes('physics')) {
    return "Gravity is the force that attracts objects toward each other. On Earth, it pulls everything toward the center with an acceleration of 9.8 m/s².";
  }
  
  if (lowerMessage.includes('chemistry') || lowerMessage.includes('chemical')) {
    return "Chemistry is the study of matter and how it changes! It's like cooking but with molecules and reactions.";
  }
  
  if (lowerMessage.includes('biology') || lowerMessage.includes('cell') || lowerMessage.includes('organism')) {
    return "Biology explores the fascinating world of living things - from tiny cells to complex ecosystems.";
  }
  
  // Study help
  if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test')) {
    return "Great study techniques include active recall, spaced repetition, and creating connections between concepts.";
  }
  
  // Writing help
  if (lowerMessage.includes('essay') || lowerMessage.includes('write') || lowerMessage.includes('writing')) {
    return "Good writing starts with a clear outline: introduction, body paragraphs with evidence, and a strong conclusion.";
  }
  
  // History
  if (lowerMessage.includes('history') || lowerMessage.includes('historical')) {
    return "History helps us understand how past events shaped our present world and teaches valuable lessons for the future.";
  }
  
  // General educational response
  if (isEducationalDemo(message)) {
    return "That's a great question! Learning happens best when we connect new ideas to what we already know.";
  }
  
  // Non-educational but helpful
  return "I'm here to help you with any questions you have! What would you like to explore or learn about?";
}

function applyPersonalityStyle(baseResponse: string, buddyType: string, originalMessage: string): string {
  switch (buddyType) {
    case 'funny':
      return applyFunnyStyle(baseResponse, originalMessage);
    
    case 'serious':
      return applySeriousStyle(baseResponse, originalMessage);
    
    case 'motivational':
      return applyMotivationalStyle(baseResponse, originalMessage);
    
    default:
      return baseResponse + "\n\nWould you like me to explain this further or help with something else?";
  }
}

function applyFunnyStyle(response: string, message: string): string {
  const funnyIntros = [
    "🎉 Awesome question! ",
    "🤔 Ooh, I love this one! ",
    "✨ Great thinking! ",
    "🚀 Let's dive in! "
  ];
  
  const funnyClosers = [
    "\n\n😄 See what I did there? Learning can be fun when you find the right angle!",
    "\n\n🎯 Pretty cool, right? Want to explore this more or should we tackle something else fun?",
    "\n\n🌟 That's the beauty of learning - it's like unwrapping presents for your brain!",
    "\n\n😊 Hope that made it click! Got any other brain teasers for me?"
  ];
  
  // Add some humor based on topic
  if (message.toLowerCase().includes('gravity')) {
    return funnyIntros[0] + "Gravity is like that friend who's always pulling you down... but in a good way! 😂 " + response + 
           "\n\nFun fact: If you drop a hammer and a feather on the moon, they'll fall at the same rate! No air resistance to slow down the feather - it's like they're racing and it's actually a tie! 🔨🪶" +
           funnyClosers[0];
  }
  
  if (message.toLowerCase().includes('math')) {
    return funnyIntros[1] + response + 
           "\n\nMath jokes are the best because they're always... calculated! 🤓 Get it? But seriously, math is everywhere - even in pizza! 🍕 (Thank you, geometry!)" +
           funnyClosers[1];
  }
  
  return funnyIntros[Math.floor(Math.random() * funnyIntros.length)] + response + 
         funnyClosers[Math.floor(Math.random() * funnyClosers.length)];
}

function applySeriousStyle(response: string, message: string): string {
  const academicIntros = [
    "This is an excellent academic inquiry. ",
    "Allow me to provide a comprehensive analysis. ",
    "This topic requires careful examination. ",
    "Let us approach this systematically. "
  ];
  
  const academicClosers = [
    "\n\nFor further study, I recommend exploring the underlying principles and practical applications of this concept.",
    "\n\nThis foundational knowledge will serve as a cornerstone for more advanced topics in this field.",
    "\n\nConsider reviewing additional scholarly resources to deepen your understanding of this subject matter.",
    "\n\nShould you require clarification on any specific aspect, please do not hesitate to inquire."
  ];
  
  // Add academic depth based on topic
  if (message.toLowerCase().includes('gravity')) {
    return academicIntros[0] + response + 
           "\n\nThis fundamental force, first comprehensively described by Sir Isaac Newton in his Principia Mathematica (1687), governs planetary motion, tidal forces, and the structure of the universe itself. Einstein's General Theory of Relativity later refined our understanding, describing gravity not as a force, but as the curvature of spacetime." +
           academicClosers[0];
  }
  
  return academicIntros[Math.floor(Math.random() * academicIntros.length)] + response + 
         academicClosers[Math.floor(Math.random() * academicClosers.length)];
}

function applyMotivationalStyle(response: string, message: string): string {
  const motivationalIntros = [
    "💪 You're asking all the right questions! ",
    "🌟 I love your curiosity - that's the mindset of a champion! ",
    "🔥 What an awesome question! You're really thinking like a scholar! ",
    "✨ Your eagerness to learn is inspiring! "
  ];
  
  const motivationalClosers = [
    "\n\n🎯 Remember: every expert was once a beginner, and every pro was once an amateur! You've got this!",
    "\n\n🚀 Keep that curiosity burning bright - it's your superpower for success!",
    "\n\n⭐ You're building knowledge brick by brick, and that foundation will take you anywhere you want to go!",
    "\n\n💫 Believe in yourself! Every question you ask makes you stronger and smarter!"
  ];
  
  // Add motivation based on topic
  if (message.toLowerCase().includes('struggling') || message.toLowerCase().includes('difficult') || message.toLowerCase().includes('hard')) {
    return "🤗 Hey there, champion! I hear you're finding this challenging, and you know what? That means you're growing! " + response +
           "\n\n💪 Challenges are just opportunities in disguise. Every struggle is making you stronger and more capable. Think about how proud you'll feel when you master this! You've overcome difficulties before, and you'll absolutely conquer this one too!" +
           motivationalClosers[3];
  }
  
  return motivationalIntros[Math.floor(Math.random() * motivationalIntros.length)] + response + 
         motivationalClosers[Math.floor(Math.random() * motivationalClosers.length)];
}