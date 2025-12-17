import { SlideData, SlideLayout } from '../types';

export const getPreMadeSlideDeck = (topic: string): SlideData[] => {
  const t = topic.toLowerCase();

  // 1. SPECIFIC TEMPLATE: AI & TECH
  if (t.includes("ai") || t.includes("future") || t.includes("tech") || t.includes("cyber") || t.includes("robot")) {
    return [
      {
        title: topic,
        subtitle: "Navigating the Technological Frontier",
        content: ["The State of Innovation", "Core Technologies", "Global Impact", "Future Horizon"],
        layout: SlideLayout.TITLE,
        imageKeyword: "futuristic technology",
        animationType: "animate__fadeIn",
        animationSpeed: "animate__slow"
      },
      {
        title: "Technological Evolution",
        content: [
          "Phase 1: Foundation & Infrastructure",
          "Phase 2: Connectivity & The Web",
          "Phase 3: Mobile & Cloud Computing",
          "Phase 4: Artificial Intelligence & Automation"
        ],
        layout: SlideLayout.SECTION_HEADER,
        imageKeyword: "technology timeline"
      },
      {
        title: "Market Growth",
        content: ["300%", "Projected adoption rate by 2030", "Across all major industries"],
        layout: SlideLayout.BIG_NUMBER,
        imageKeyword: "growth graph"
      },
      {
        title: "Core Components",
        content: [
          "Algorithms: The logic driving decisions",
          "Data: The fuel for machine learning",
          "Compute: The processing power required"
        ],
        layout: SlideLayout.THREE_COLUMN,
        imageKeyword: "chip circuit"
      },
      {
        title: "Impact Analysis",
        content: [
          "Efficiency: Automating repetitive tasks",
          "Accuracy: Reducing human error",
          "Innovation: Solving complex problems faster",
          "Ethics: Privacy and bias concerns"
        ],
        layout: SlideLayout.TWO_COLUMN,
        imageKeyword: "smart city"
      },
      {
        title: "The Road Ahead",
        subtitle: "Strategic Considerations",
        content: [
          "Invest in continuous learning and adaptation.",
          "Prioritize ethical implementation.",
          "Foster collaboration between humans and machines."
        ],
        layout: SlideLayout.BULLET_POINTS,
        imageKeyword: "horizon future"
      }
    ];
  }

  // 2. SPECIFIC TEMPLATE: BUSINESS & STARTUPS
  if (t.includes("startup") || t.includes("pitch") || t.includes("marketing") || t.includes("finance") || t.includes("negotiation") || t.includes("leadership")) {
    return [
      {
        title: topic,
        subtitle: "Strategic Blueprint for Success",
        content: ["Market Opportunity", "Our Solution", "Business Model", "Growth Strategy"],
        layout: SlideLayout.TITLE,
        imageKeyword: "corporate meeting",
        animationType: "animate__zoomIn"
      },
      {
        title: "The Problem",
        content: [
          "Current solutions are inefficient and outdated.",
          "Users are frustrated with high costs.",
          "Lack of integration causes data silos."
        ],
        layout: SlideLayout.BULLET_POINTS,
        imageKeyword: "frustrated office worker"
      },
      {
        title: "Our Solution",
        content: [
          "Seamless Integration: Connects with existing tools",
          "Cost Effective: 50% cheaper than competitors",
          "User Friendly: Zero learning curve designed"
        ],
        layout: SlideLayout.THREE_COLUMN,
        imageKeyword: "puzzle solution"
      },
      {
        title: "Traction",
        content: ["10k+", "Active Users in Month 1", "Growing at 20% MoM"],
        layout: SlideLayout.BIG_NUMBER,
        imageKeyword: "rocket launch"
      },
      {
        title: "Competitive Advantage",
        content: [
          "Competitors: Expensive, Slow, Complex",
          "Us: Affordable, Fast, Intuitive",
          "Moat: Proprietary algorithms and data"
        ],
        layout: SlideLayout.COMPARISON,
        imageKeyword: "chess game"
      },
      {
        title: "Join Our Journey",
        content: [
          "We are redefining the landscape of " + topic,
          "Partnership opportunities are open.",
          "Contact us to learn more."
        ],
        layout: SlideLayout.QUOTE,
        imageKeyword: "handshake"
      }
    ];
  }

  // 3. SPECIFIC TEMPLATE: NATURE & WELLNESS
  if (t.includes("health") || t.includes("energy") || t.includes("climate") || t.includes("yoga") || t.includes("nature") || t.includes("food") || t.includes("ocean")) {
    return [
      {
        title: topic,
        subtitle: "Harmony, Health, and Sustainability",
        content: ["Introduction", "The Science", "Benefits", "Daily Practices"],
        layout: SlideLayout.TITLE,
        imageKeyword: "nature landscape",
        animationType: "animate__fadeIn"
      },
      {
        title: "Core Principles",
        content: [
          "Balance: Finding equilibrium in systems",
          "Sustainability: Resources for the future",
          "Wellness: Holistic approach to health"
        ],
        layout: SlideLayout.THREE_COLUMN,
        imageKeyword: "zen stones"
      },
      {
        title: "Global Impact",
        content: ["#1", "Priority for the next decade", "Essential for planetary survival"],
        layout: SlideLayout.BIG_NUMBER,
        imageKeyword: "earth from space"
      },
      {
        title: "Before vs After",
        content: [
          "Before: Stress, Waste, Depletion",
          "After: Vitality, Regeneration, Abundance",
          "Transition: Conscious choices every day"
        ],
        layout: SlideLayout.COMPARISON,
        imageKeyword: "forest growth"
      },
      {
        title: "Visual Journey",
        content: ["Restoration", "Growth", "Vitality"],
        layout: SlideLayout.GALLERY,
        imageKeyword: "waterfall"
      },
      {
        title: "Conclusion",
        content: [
          "Small changes lead to massive impact.",
          "The time to act is now.",
          "Join the movement for a better world."
        ],
        layout: SlideLayout.SECTION_HEADER,
        imageKeyword: "sunrise"
      }
    ];
  }

  // 4. GENERIC TEMPLATE (Smart Fill)
  // This ensures ALL 50 samples have a valid, structured presentation instantly.
  return [
    {
      title: topic,
      subtitle: "A Comprehensive Overview",
      content: ["Introduction", "Key Concepts", "Analysis", "Conclusion"],
      layout: SlideLayout.TITLE,
      imageKeyword: "abstract geometric background",
      animationType: "animate__fadeIn"
    },
    {
      title: "Introduction",
      content: [
        `Welcome to our deep dive into ${topic}.`,
        "We will explore the fundamental aspects, current trends, and future outlook.",
        "Understanding this topic is crucial for modern context."
      ],
      layout: SlideLayout.TWO_COLUMN,
      imageKeyword: "office presentation"
    },
    {
      title: "Key Pillars",
      content: ["3", "Fundamental Pillars of " + topic, "Essential for success"],
      layout: SlideLayout.BIG_NUMBER,
      imageKeyword: "pillars architecture"
    },
     {
      title: "Critical Analysis",
      content: [
        "Strengths: Innovation, Scalability, Efficiency",
        "Weaknesses: Implementation costs, Complexity",
        "Opportunities: Market expansion, New demographics"
      ],
      layout: SlideLayout.THREE_COLUMN,
      imageKeyword: "analytics chart"
    },
    {
      title: "Perspective",
      content: [
        `"The only way to predict the future of ${topic} is to create it."`,
        "— Industry Leader"
      ],
      layout: SlideLayout.QUOTE,
      imageKeyword: "inspirational mountain"
    },
    {
      title: "Summary",
      content: [
        `In conclusion, ${topic} presents significant opportunities.`,
        "Strategic implementation is key.",
        "Questions & Answers"
      ],
      layout: SlideLayout.SECTION_HEADER,
      imageKeyword: "conclusion success"
    }
  ];
};