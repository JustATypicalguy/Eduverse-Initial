export interface Subject {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  details: string[];
}

export interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subjects: Subject[];
}

export const subjectCategories: SubjectCategory[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, Geometry, Calculus, Statistics",
    icon: "calculator",
    color: "blue",
    subjects: [
      {
        id: "algebra",
        name: "Algebra",
        description: "Linear equations, quadratic functions, and algebraic thinking",
        category: "mathematics",
        icon: "square-root-alt",
        color: "blue",
        details: [
          "Linear and quadratic equations",
          "Polynomial functions",
          "Systems of equations",
          "Exponential and logarithmic functions"
        ]
      },
      {
        id: "geometry",
        name: "Geometry", 
        description: "Shapes, spatial reasoning, and geometric proofs",
        category: "mathematics",
        icon: "shapes",
        color: "blue",
        details: [
          "Euclidean geometry",
          "Coordinate geometry",
          "Trigonometry",
          "3D geometry and vectors"
        ]
      },
      {
        id: "calculus",
        name: "Calculus",
        description: "Limits, derivatives, integrals, and applications",
        category: "mathematics", 
        icon: "chart-line",
        color: "blue",
        details: [
          "Differential calculus",
          "Integral calculus", 
          "Applications of derivatives",
          "Sequences and series"
        ]
      },
      {
        id: "statistics",
        name: "Statistics",
        description: "Data analysis, probability, and statistical inference",
        category: "mathematics",
        icon: "chart-bar",
        color: "blue", 
        details: [
          "Descriptive statistics",
          "Probability theory",
          "Statistical inference",
          "Regression analysis"
        ]
      }
    ]
  },
  {
    id: "sciences",
    name: "Sciences", 
    description: "Physics, Chemistry, Biology, Environmental",
    icon: "flask",
    color: "green",
    subjects: [
      {
        id: "physics",
        name: "Physics",
        description: "Matter, energy, motion, and fundamental forces",
        category: "sciences",
        icon: "atom",
        color: "green",
        details: [
          "Mechanics and motion",
          "Thermodynamics",
          "Electricity and magnetism", 
          "Quantum physics"
        ]
      },
      {
        id: "chemistry", 
        name: "Chemistry",
        description: "Chemical reactions, molecular structure, and properties",
        category: "sciences",
        icon: "vial",
        color: "green",
        details: [
          "Atomic structure",
          "Chemical bonding",
          "Organic chemistry",
          "Chemical kinetics"
        ]
      },
      {
        id: "biology",
        name: "Biology",
        description: "Living organisms, ecosystems, and life processes", 
        category: "sciences",
        icon: "dna",
        color: "green",
        details: [
          "Cell biology",
          "Genetics and evolution",
          "Ecology and environment",
          "Human physiology"
        ]
      },
      {
        id: "environmental",
        name: "Environmental Science",
        description: "Environmental systems, sustainability, and conservation",
        category: "sciences", 
        icon: "leaf",
        color: "green",
        details: [
          "Ecosystem dynamics",
          "Climate change",
          "Renewable energy",
          "Environmental policy"
        ]
      }
    ]
  },
  {
    id: "languages",
    name: "Languages",
    description: "English, Spanish, French, Mandarin", 
    icon: "language",
    color: "purple",
    subjects: [
      {
        id: "english",
        name: "English Language & Literature",
        description: "Language skills, literature analysis, and creative writing",
        category: "languages",
        icon: "book-open",
        color: "purple",
        details: [
          "Reading comprehension",
          "Literary analysis", 
          "Creative and academic writing",
          "Oral communication"
        ]
      },
      {
        id: "spanish",
        name: "Spanish",
        description: "Spanish language acquisition and Hispanic culture",
        category: "languages",
        icon: "globe-americas",
        color: "purple", 
        details: [
          "Grammar and vocabulary",
          "Conversation skills",
          "Hispanic literature",
          "Cultural studies"
        ]
      },
      {
        id: "french",
        name: "French", 
        description: "French language learning and Francophone culture",
        category: "languages",
        icon: "flag",
        color: "purple",
        details: [
          "Pronunciation and phonetics",
          "French grammar",
          "Francophone literature",
          "Cultural immersion"
        ]
      },
      {
        id: "mandarin",
        name: "Mandarin Chinese",
        description: "Mandarin language and Chinese culture",
        category: "languages",
        icon: "yin-yang",
        color: "purple",
        details: [
          "Character writing",
          "Pinyin and pronunciation", 
          "Chinese culture and history",
          "Business Chinese"
        ]
      }
    ]
  },
  {
    id: "arts",
    name: "Arts",
    description: "Visual Arts, Music, Drama, Digital Media",
    icon: "palette",
    color: "pink", 
    subjects: [
      {
        id: "visual-arts",
        name: "Visual Arts",
        description: "Drawing, painting, sculpture, and art history",
        category: "arts",
        icon: "paint-brush",
        color: "pink",
        details: [
          "Drawing and painting techniques",
          "Sculpture and 3D art",
          "Art history and appreciation",
          "Portfolio development"
        ]
      },
      {
        id: "music",
        name: "Music",
        description: "Music theory, performance, and composition",
        category: "arts", 
        icon: "music",
        color: "pink",
        details: [
          "Music theory and notation",
          "Instrumental performance",
          "Vocal training",
          "Music composition"
        ]
      },
      {
        id: "drama",
        name: "Drama & Theater",
        description: "Acting, directing, and theatrical production",
        category: "arts",
        icon: "theater-masks",
        color: "pink",
        details: [
          "Acting techniques",
          "Script analysis",
          "Stage design and production",
          "Theater history"
        ]
      },
      {
        id: "digital-media",
        name: "Digital Media",
        description: "Digital art, video production, and multimedia design",
        category: "arts",
        icon: "camera",
        color: "pink", 
        details: [
          "Digital illustration",
          "Video editing and production",
          "Web design",
          "Animation and motion graphics"
        ]
      }
    ]
  },
  {
    id: "social-studies",
    name: "Social Studies",
    description: "History, Geography, Economics, Psychology",
    icon: "globe-americas",
    color: "orange",
    subjects: [
      {
        id: "history",
        name: "History", 
        description: "World history, civilizations, and historical analysis",
        category: "social-studies",
        icon: "scroll",
        color: "orange",
        details: [
          "Ancient civilizations",
          "Modern world history",
          "Historical research methods",
          "Comparative history"
        ]
      },
      {
        id: "geography",
        name: "Geography",
        description: "Physical and human geography, mapping, and spatial analysis",
        category: "social-studies",
        icon: "map",
        color: "orange",
        details: [
          "Physical geography",
          "Human geography",
          "Geographic information systems",
          "Environmental geography"
        ]
      },
      {
        id: "economics",
        name: "Economics",
        description: "Economic systems, markets, and financial literacy", 
        category: "social-studies",
        icon: "coins",
        color: "orange",
        details: [
          "Microeconomics",
          "Macroeconomics",
          "International trade",
          "Economic policy"
        ]
      },
      {
        id: "psychology",
        name: "Psychology",
        description: "Human behavior, cognition, and psychological research",
        category: "social-studies",
        icon: "brain",
        color: "orange",
        details: [
          "Cognitive psychology",
          "Social psychology", 
          "Developmental psychology",
          "Research methods"
        ]
      }
    ]
  },
  {
    id: "technology",
    name: "Technology",
    description: "Computer Science, Robotics, Digital Design",
    icon: "laptop-code",
    color: "indigo",
    subjects: [
      {
        id: "computer-science",
        name: "Computer Science",
        description: "Programming, algorithms, and computational thinking",
        category: "technology",
        icon: "code",
        color: "indigo",
        details: [
          "Programming languages",
          "Data structures and algorithms",
          "Software development",
          "Computer systems"
        ]
      },
      {
        id: "robotics",
        name: "Robotics",
        description: "Robot design, programming, and automation",
        category: "technology",
        icon: "robot",
        color: "indigo", 
        details: [
          "Robot programming",
          "Mechanical design",
          "Sensors and actuators", 
          "Artificial intelligence"
        ]
      },
      {
        id: "digital-design",
        name: "Digital Design",
        description: "User interface design, web development, and digital tools",
        category: "technology",
        icon: "desktop",
        color: "indigo",
        details: [
          "UI/UX design",
          "Web development",
          "Mobile app design",
          "Design thinking"
        ]
      }
    ]
  },
  {
    id: "physical-education",
    name: "Physical Education",
    description: "Sports, Health, Wellness, Fitness",
    icon: "running",
    color: "red", 
    subjects: [
      {
        id: "sports",
        name: "Sports & Athletics",
        description: "Team sports, individual sports, and athletic development",
        category: "physical-education",
        icon: "futbol",
        color: "red",
        details: [
          "Team sports (basketball, soccer, volleyball)",
          "Individual sports (tennis, swimming, track)",
          "Athletic training",
          "Sports psychology"
        ]
      },
      {
        id: "health",
        name: "Health Education",
        description: "Nutrition, mental health, and healthy lifestyle choices", 
        category: "physical-education",
        icon: "heart",
        color: "red",
        details: [
          "Nutrition and diet",
          "Mental health awareness",
          "Disease prevention",
          "Health promotion"
        ]
      },
      {
        id: "fitness",
        name: "Fitness & Conditioning", 
        description: "Physical fitness, strength training, and exercise science",
        category: "physical-education",
        icon: "dumbbell",
        color: "red",
        details: [
          "Cardiovascular fitness",
          "Strength and conditioning",
          "Flexibility and mobility",
          "Exercise physiology"
        ]
      }
    ]
  },
  {
    id: "life-skills",
    name: "Life Skills",
    description: "Critical Thinking, Leadership, Communication",
    icon: "lightbulb",
    color: "yellow",
    subjects: [
      {
        id: "critical-thinking",
        name: "Critical Thinking",
        description: "Problem-solving, logical reasoning, and decision-making",
        category: "life-skills",
        icon: "puzzle-piece",
        color: "yellow",
        details: [
          "Logical reasoning",
          "Problem-solving strategies", 
          "Decision-making frameworks",
          "Analytical thinking"
        ]
      },
      {
        id: "leadership",
        name: "Leadership & Teamwork",
        description: "Leadership skills, collaboration, and team dynamics",
        category: "life-skills",
        icon: "users",
        color: "yellow",
        details: [
          "Leadership styles",
          "Team building",
          "Conflict resolution",
          "Project management"
        ]
      },
      {
        id: "communication",
        name: "Communication Skills",
        description: "Public speaking, presentation skills, and interpersonal communication",
        category: "life-skills",
        icon: "microphone",
        color: "yellow",
        details: [
          "Public speaking",
          "Presentation design",
          "Interpersonal communication",
          "Digital communication"
        ]
      }
    ]
  }
];

export function getSubjectsByCategory(categoryId: string): Subject[] {
  const category = subjectCategories.find(cat => cat.id === categoryId);
  return category ? category.subjects : [];
}

export function getSubjectById(subjectId: string): Subject | undefined {
  for (const category of subjectCategories) {
    const subject = category.subjects.find(s => s.id === subjectId);
    if (subject) return subject;
  }
  return undefined;
}

export function getAllSubjects(): Subject[] {
  return subjectCategories.flatMap(category => category.subjects);
}
