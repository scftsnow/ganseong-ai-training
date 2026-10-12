// Approved teaching copy: Sentinel_cd1be5697b888191a4e1502d09249047.
// All motion labels below are implementation metadata, never extra teaching copy.
export const DURATION = 5;
export const MINDSETS = [
  {
    "title": "첫 아이디어가 중요합니다.",
    "explanation": "생활 속에서 떠오른 참신한 생각을 흘려보내지 말고, 귀찮음과 불편함을 당연하다고 여기지 말고, 현 상태 개선을 위한 첫 아이디어를 상상해 보세요.",
    "id": "idea",
    "breaks": [
      1,
      2
    ],
    "times": [
      0.16,
      0.92,
      1.92
    ],
    "actions": [
      {
        "t": 0.25,
        "kind": "soft",
        "name": "obstacles-emerge"
      },
      {
        "t": 1.05,
        "kind": "spark",
        "name": "first-idea-ignites"
      },
      {
        "t": 2.25,
        "kind": "bloom",
        "name": "idea-takes-shape"
      },
      {
        "t": 3.45,
        "kind": "air",
        "name": "reading-handoff"
      }
    ]
  },
  {
    "title": "첫 아이디어 구상 외에는 무엇이든 AI와 함께 하세요.",
    "explanation": "그 아이디어에 대해 AI와 의논하고, 조사, 계획, 제작, 수정 등 모든 것을 시켜 보세요. 만드는 방법은, AI에게 개념과 흐름 정도만 대충 배우세요.",
    "id": "together",
    "breaks": [
      4,
      6
    ],
    "times": [
      0.12,
      0.38,
      0.63,
      0.88,
      1.18,
      1.5,
      1.85,
      2.18
    ],
    "actions": [
      {
        "t": 0.72,
        "kind": "air",
        "name": "idea-handoff"
      },
      {
        "t": 1.4,
        "kind": "soft",
        "name": "research"
      },
      {
        "t": 1.72,
        "kind": "soft",
        "name": "plan"
      },
      {
        "t": 2.05,
        "kind": "soft",
        "name": "make"
      },
      {
        "t": 2.4,
        "kind": "bloom",
        "name": "revise-and-assemble"
      }
    ]
  },
  {
    "title": "AI가 나에게 질문하게 하세요. 모르는 것이 생기면 무엇이든 물어보세요.",
    "explanation": "머리 아픈 세부 구상을 하지 말고, AI가 나에게 질문하며 나의 아이디어를 구체화하도록 만드세요. 무엇이든 이해가 되지 않으면 무엇이든 질문하고 쉽게(초보자 수준, 비유적으로) 알려달라고 하세요.",
    "id": "questions",
    "breaks": [
      2,
      4,
      7
    ],
    "times": [
      0.12,
      0.37,
      0.62,
      0.87,
      1.22,
      1.47,
      1.72,
      2.06,
      2.38
    ],
    "actions": [
      {
        "t": 0.64,
        "kind": "question",
        "name": "ai-asks"
      },
      {
        "t": 1.62,
        "kind": "question",
        "name": "person-asks-back"
      },
      {
        "t": 2.55,
        "kind": "bloom",
        "name": "shared-understanding"
      }
    ]
  },
  {
    "title": "AI 환각을 막기 위해, 인터넷 조사를 시키고, 감독하세요.",
    "explanation": "AI의 감은 정확하지 않아요. 관련 사례와 더 나은 방법을 인터넷에서 조사하게 하세요. 작업 중 내 의도와 다르거나 의심가는 부분이 있다면, 모든 것을 모른 채 맡기지 말고 의심하세요.",
    "id": "supervise",
    "breaks": [
      4,
      7
    ],
    "times": [
      0.14,
      0.39,
      0.64,
      0.89,
      1.22,
      1.54,
      1.88,
      2.3
    ],
    "actions": [
      {
        "t": 0.6,
        "kind": "air",
        "name": "open-research-space"
      },
      {
        "t": 1.42,
        "kind": "soft",
        "name": "collect-sources"
      },
      {
        "t": 2.05,
        "kind": "scan",
        "name": "supervisor-inspects"
      },
      {
        "t": 2.72,
        "kind": "bloom",
        "name": "verified-shield"
      }
    ]
  }
];
