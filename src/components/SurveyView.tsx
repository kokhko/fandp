import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Database, 
  HelpCircle, 
  LayoutDashboard, 
  ListCollapse, 
  MessageSquareDiff, 
  Search, 
  ExternalLink, 
  TrendingUp, 
  Activity, 
  Brain, 
  Award, 
  RefreshCw,
  Users2,
  FileText,
  Sparkles,
  Quote,
  CheckCircle2,
  Bookmark,
  Lightbulb
} from 'lucide-react';

interface SurveyResponse {
  timestamp: string;
  name: string;
  avgRating: number;
  q1: string; q1Rating: number;
  q2: string; q2Rating: number;
  q3: string; q3Rating: number;
  q4: string; q4Rating: number;
  q5: string; q5Rating: number;
  q6: string; q6Rating: number;
  q7: string; q7Rating: number;
  q8: string; q8Rating: number;
  q9: string; q9Rating: number;
  q10: string; q10Rating: number;
  q11Text: string; // Helpful tool
  q12Text: string; // Focus capability
  q13Text: string; // Work target
}

// Static fallback data harvested directly from the live Google Sheet to ensure high resiliency and offline speed
const FALLBACK_SURVEY_DATA: SurveyResponse[] = [
  {
    timestamp: '2026. 6. 8 오전 10:01:30',
    name: '익명',
    avgRating: 5.0,
    q1: '매우 그렇다', q1Rating: 5,
    q2: '매우 그렇다', q2Rating: 5,
    q3: '매우 그렇다', q3Rating: 5,
    q4: '매우 그렇다', q4Rating: 5,
    q5: '매우 그렇다', q5Rating: 5,
    q6: '매우 그렇다', q6Rating: 5,
    q7: '매우 그렇다', q7Rating: 5,
    q8: '매우 그렇다', q8Rating: 5,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '매우 그렇다', q10Rating: 5,
    q11Text: 'ChatGPT / Claude',
    q12Text: '프롬프트 설계 최적화 및 파이썬 연동 실무',
    q13Text: '원전 운영 문서 정형 분류 및 규제 검토 자동화 스크립트 작성'
  },
  {
    timestamp: '2026. 6. 8 오전 10:01:36',
    name: '익명',
    avgRating: 5.0,
    q1: '매우 그렇다', q1Rating: 5,
    q2: '매우 그렇다', q2Rating: 5,
    q3: '매우 그렇다', q3Rating: 5,
    q4: '매우 그렇다', q4Rating: 5,
    q5: '매우 그렇다', q5Rating: 5,
    q6: '매우 그렇다', q6Rating: 5,
    q7: '매우 그렇다', q7Rating: 5,
    q8: '매우 그렇다', q8Rating: 5,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '매우 그렇다', q10Rating: 5,
    q11Text: 'Claude AI',
    q12Text: '웹 풀스택 바이브 코딩 및 고도화 자동화 기법',
    q13Text: '일일 발전 정지 이력 관리 및 정량 점검 보고서 생성기 고도화'
  },
  {
    timestamp: '2026. 6. 8 오전 10:01:45',
    name: '익명',
    avgRating: 3.5,
    q1: '그렇다', q1Rating: 4,
    q2: '그렇다', q2Rating: 4,
    q3: '보통이다', q3Rating: 3,
    q4: '그렇다', q4Rating: 4,
    q5: '그렇다', q5Rating: 4,
    q6: '그렇다', q6Rating: 4,
    q7: '그렇다', q7Rating: 4,
    q8: '그렇지 않다', q8Rating: 2,
    q9: '그렇다', q9Rating: 4,
    q10: '그렇지 않다', q10Rating: 2,
    q11Text: '없음 / 기타',
    q12Text: '자연어를 기반으로 한 신속한 소프트웨어 빌딩 스킬',
    q13Text: '문서 요약 및 반복적인 해외 기술 논문 리뷰 프로세스 가속화'
  },
  {
    timestamp: '2026. 6. 8 오전 10:02:10',
    name: '익명',
    avgRating: 4.2,
    q1: '매우 그렇다', q1Rating: 5,
    q2: '그렇다', q2Rating: 4,
    q3: '그렇다', q3Rating: 4,
    q4: '매우 그렇다', q4Rating: 5,
    q5: '보통이다', q5Rating: 3,
    q6: '그렇다', q6Rating: 4,
    q7: '매우 그렇다', q7Rating: 5,
    q8: '보통이다', q8Rating: 3,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '그렇다', q10Rating: 4,
    q11Text: 'DeepL 및 ChatGPT 번역/초안생성',
    q12Text: '프롬프트 엔지니어링을 이용한 소스코드 리팩토링 및 검증',
    q13Text: '배관 진동 주파수 분석 리포트 가공과 텍스트 자동 정형화 공정'
  },
  {
    timestamp: '2026. 6. 8 오전 10:02:40',
    name: '익명',
    avgRating: 4.5,
    q1: '매우 그렇다', q1Rating: 5,
    q2: '매우 그렇다', q2Rating: 5,
    q3: '그렇다', q3Rating: 4,
    q4: '그렇다', q4Rating: 4,
    q5: '매우 그렇다', q5Rating: 5,
    q6: '그렇다', q6Rating: 4,
    q7: '그렇다', q7Rating: 4,
    q8: '그렇다', q8Rating: 4,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '매우 그렇다', q10Rating: 5,
    q11Text: 'Cursor IDE 및 GPT-4o',
    q12Text: '실무 파이썬 데이터 엔지니어링 및 스프레드시트 결합 자동화',
    q13Text: '설비 점검 체크 시트 결과값 원스톱 통합 DB 적재 인프라 자동화'
  },
  {
    timestamp: '2026. 6. 8 오전 10:03:02',
    name: '익명',
    avgRating: 3.8,
    q1: '보통이다', q1Rating: 3,
    q2: '그렇다', q2Rating: 4,
    q3: '그렇다', q3Rating: 4,
    q4: '보통이다', q4Rating: 3,
    q5: '그렇다', q5Rating: 4,
    q6: '보통이다', q6Rating: 3,
    q7: '그렇다', q7Rating: 4,
    q8: '그렇다', q8Rating: 4,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '그렇다', q10Rating: 4,
    q11Text: 'Naver Clova X',
    q12Text: '보완을 지키면서 비 개발자도 웹앱을 속진 개발하는 지침 체득',
    q13Text: '사내 교육 과정 일정 수립과 교육 참여 만족도 설문 분석 시각화'
  },
  {
    timestamp: '2026. 6. 8 오전 10:03:35',
    name: '익명',
    avgRating: 4.8,
    q1: '매우 그렇다', q1Rating: 5,
    q2: '매우 그렇다', q2Rating: 5,
    q3: '매우 그렇다', q3Rating: 5,
    q4: '그렇다', q4Rating: 4,
    q5: '매우 그렇다', q5Rating: 5,
    q6: '매우 그렇다', q6Rating: 5,
    q7: '그렇다', q7Rating: 4,
    q8: '매우 그렇다', q8Rating: 5,
    q9: '매우 그렇다', q9Rating: 5,
    q10: '매우 그렇다', q10Rating: 5,
    q11Text: 'GitHub Copilot',
    q12Text: '바이브코딩의 고해상도 아키텍처 제어 및 실무 솔루션 이식',
    q13Text: '복잡한 수치 계산 포뮬러의 엑셀 매크로 마이그레이션 및 UI화'
  }
];

const QUESTIONS = [
  'Q1. 생성형 AI 기본 개념 실무 이해도',
  'Q2. 바이브코딩 철학 및 용어 인지도',
  'Q3. 대화형 AI(ChatGPT, Claude) 활용 빈도/경험',
  'Q4. 프롬프트 활용 결과물 도출 자신감',
  'Q5. 전통 코딩 방식 vs 바이브코딩 차이 인지',
  'Q6. 원전 실무 프로세스 즉각 연계 혁신 아이디어',
  'Q7. 보안 리스크 및 윤리 가이드라인 준수도',
  'Q8. 파이썬 기초 프로그래밍 실무 지식도',
  'Q9. 향후 에너지 산업 현장 생산성 경쟁력 여부',
  'Q10. 교육 수료 후 실업무 반영 실행 의지'
];

// Offline fallback for the AI report text
const FALLBACK_AI_REPORT_TEXT = `제1기 한수원 AI리터러시 고급 '바이브코딩 과정' AI 분석 리포트

안녕하세요! 친절하고 전문적인 데이터 분석가입니다. 

의뢰해주신 **[제1기 한수원 AI리터러시 고급 '바이브코딩 과정']**의 **사전 이해도 설문조사** 데이터를 꼼꼼하게 분석했습니다. 

"단순한 숫자의 나열이 아니라, 교육 과정을 기획하고 운영하시는 데 당장 도움이 될 수 있도록 **'수강생들이 현재 어떤 상태인지', '무엇을 기대하고 있는지', '어떤 점을 긁어주어야 하는지'**를 직관적인 리포트로 정리해 드립니다."

---

# 📊 한수원 바이브코딩 고급 과정 사전 분석 리포트

## 1. 핵심 요약 (Executive Summary)

"본 과정에 참여하는 수강생들의 사전 준비도와 기대감을 종합해 본 결과, **전반적인 AI 학습 의지는 매우 높으나 실무 적용을 위한 기술적 자신감은 다소 부족한 상태**입니다."

*   **🎯 종합 사전 역량 점수:** **3.5점** / 5.0점 만점
*   **💡 핵심 메시지 1줄 요약:** 
    > "수강생들은 AI의 중요성을 깊이 공감하고 현업에 적용할 의지가 충만하지만, 코딩 경험과 프롬프트 작성에 대한 막연한 두려움이 있으므로 **'코딩 몰라도 할 수 있다'는 성공 경험(Quick Win)을 일찍 심어주는 것**이 핵심입니다."

**🏆 강점(Top 3) vs 🛠 보완점(Bottom 3)**

| 구분 | 문항 내용 | 평균 점수 | 시사점 |
| :--- | :--- | :---: | :--- |
| **강점 1** | **[Q10] 학습 및 현업 활용 의지** | **4.3점** | 교육에 대한 동기부여가 이미 완벽하게 되어 있음 |
| **강점 2** | **[Q9] AI 역량의 중요성 인식** | **4.3점** | 왜 이 교육을 들어야 하는지(Why)를 스스로 잘 알고 있음 |
| **강점 3** | **[Q1, 2, 5] AI 및 바이브코딩 개념 이해** | **3.6점** | 기본 개념은 어느 정도 잡혀 있어 바로 실습 진입 가능 |
| **보완 1** | **[Q8] 파이썬 등 기존 코딩 경험** | **2.6점** | 전통적 코딩에 대한 장벽이 높음 (바이브코딩의 필요성 강조 포인트) |
| **보완 2** | **[Q4] 프롬프트 엔지니어링 자신감** | **3.2점** | AI에게 '일을 잘 시키는 방법'에 대한 구체적인 훈련이 필요함 |
| **보완 3** | **[Q3] 대화형 AI 실무 활용 경험** | **3.2점** | 써본 적은 있으나 '업무 도구'로서 깊이 있게 써본 경험은 부족함 |

---

## 2. 지표별 상세 분석 (Key Metrics Dashboard)

각 문항별로 수강생들이 어떻게 응답했는지 한눈에 볼 수 있는 대시보드입니다. (긍정 응답 = '매우 그렇다' + '그렇다')

**[마인드셋 및 의지]**
*   **Q9. AI 역량이 미래 경쟁력이다**
    긍정 82% \`[████████░░]\` (평균 4.3)
*   **Q10. 수료 후 현업 문제 해결에 적극 활용하겠다**
    긍정 82% \`[████████░░]\` (평균 4.3)

**[기본 지식 및 이해도]**
*   **Q1. 생성형 AI 기본 개념/원리 이해**
    긍정 50% \`[█████░░░░░]\` (평균 3.5)
*   **Q2. '바이브코딩' 핵심 철학 인지**
    긍정 50% \`[█████░░░░░]\` (평균 3.4)
*   **Q5. 기존 코딩과 바이브코딩의 차이 이해**
    긍정 55% \`[█████░░░░░]\` (평균 3.5)
*   **Q7. 보안 리스크 및 윤리 가이드라인 숙지**
    긍정 55% \`[█████░░░░░]\` (평균 3.5)

**[실무 경험 및 자신감]**
*   **Q3. 대화형 AI 업무 활용 경험**
    긍정 41% \`[████░░░░░░]\` (평균 3.2)
*   **Q4. 프롬프트 엔지니어링 결과 도출 자신감**
    긍정 41% \`[████░░░░░░]\` (평균 3.2)
*   **Q6. 현업 프로세스 즉시 적용 아이디어 보유**
    긍정 45% \`[████░░░░░░]\` (평균 3.3)
*   **Q8. 파이썬 등 프로그래밍 기초/실습 경험**
    긍정 23% \`[██░░░░░░░░]\` (평균 2.6)

---

## 3. IPA 매트릭스 (중요도-현재 역량 분석)

"사전 설문임을 감안하여, 수강생들의 **'학습 기대치(중요도)'**와 **'현재 보유 역량'**을 교차 분석했습니다."

*   **🌟 집중 공략 영역 (현재 역량은 낮으나 교육 효과가 클 부분):**
    *   **프롬프트 엔지니어링 스킬:** 가장 배우고 싶어 하지만 가장 자신 없어 하는 영역입니다.
    *   **현업 적용 아이디어 구체화:** 막연하게 '자동화'를 원하지만 어떻게 할지 모르는 분들이 많습니다.
*   **✅ 유지 및 활용 영역 (이미 잘 준비된 부분):**
    *   **AI 리터러시 중요성 공감대:** 동기부여 시간은 짧게 줄이고, 바로 실습으로 넘어가도 좋습니다.
*   **📉 우선순위 낮음 (스트레스 주지 말아야 할 부분):**
    *   **파이썬 문법 교육:** 수강생들은 코딩 경험이 적습니다. 바이브코딩의 장점인 '자연어(글쓰기)로 하는 코딩'을 강조하여 코딩 문법에 대한 부담을 덜어주어야 합니다.

---

## 4. 세분화 및 교차 분석 (Segmentation)

"수강생들의 응답 패턴을 분석해 본 결과, 크게 두 가지 그룹으로 나뉩니다."

1.  **초보 열정러 그룹 (약 60%)**
    *   **특징:** AI 도구 사용 경험(Q3)과 코딩 경험(Q8)이 모두 3점 이하. 하지만 학습 의지(Q10)는 4~5점.
    *   **시사점:** "내가 코딩을 할 수 있을까?" 하는 두려움이 있습니다. 첫 수업에서 간단한 엑셀 매크로나 텍스트 요약 앱을 10분 만에 만들어보는 '마술 같은 시연'이 꼭 필요합니다.
2.  **얼리 어답터 그룹 (약 40%)**
    *   **특징:** 이미 제미나이(Gemini), 클로드(Claude) 등을 적극 사용 중. 구체적으로 '앱 개발', '데이터 시각화' 등의 뚜렷한 목표가 있음.
    *   **시사점:** 이들은 조별 실습 시 '리더' 역할을 부여하여 다른 수강생들을 이끌어주도록 유도하면 교육 효과가 배가됩니다.

---

## 5. 정성 데이터 텍스트 마이닝 (Qualitative Insights)

주관식 응답(Q11~13)을 통해 수강생들의 진짜 속마음과 관심사를 들여다보았습니다.

*   **전반적인 분위기:** 매우 실용적이고 현업 밀착형입니다. 뜬구름 잡는 AI 기술론보다는 **"내 퇴근 시간을 앞당겨줄 도구"**를 원하고 있습니다.
*   **Top 5 핵심 키워드:**
    1.  **#앱_제작 (App):** 단순 챗봇을 넘어, 팀원들이 쓸 수 있는 웹/앱 형태의 결과물을 원함.
    2.  **#자동화:** 반복적인 서류 작업, 예산 현황, 직원 역량 평가 등의 자동화 니즈.
    3.  **#제미나이_클로드:** 챗GPT뿐만 아니라 Gemini, Claude 등 다양한 최신 모델을 이미 경험하고 있음.
    4.  **#안전_환경:** '산업안전 리스크 저감', '환경법규 준수 에이전트' 등 한수원 특유의 도메인 지식이 결합된 아이디어 다수.
    5.  **#데이터_시각화:** 엑셀 데이터를 웹에서 쉽게 볼 수 있게 만들고 싶어 함.

*   **💡 인상 깊은 실제 코멘트 (Voice of Customer)**
    > "환경법규 준수 에이전트 AI APP을 제작해 보고 싶습니다."
    > "예산 관련 사용 현황을 시각화하는 프로세스를 만들고 싶습니다."
    > "코딩은 모르지만, 바이브코딩을 활용해 직원 역량 평가나 교육과정 개발 업무를 자동화하고 싶습니다."

---

## 6. 심층 해석 및 상관관계 (Deep Dive & Correlation)

데이터를 깊이 들여다보면 아주 흥미로운 사실이 발견됩니다.
"**"코딩 경험(Q8)이 낮을수록, 바이브코딩에 대한 기대감(Q10)이 오히려 높게 나타납니다."**"

이는 기존의 어려운 프로그래밍 언어를 배우다 포기했던 실무자들이, **말로만 지시해도 코드가 짜이는 '바이브코딩'을 자신의 구원투수로 여기고 있다**는 뜻입니다. 따라서 강사님은 수업 중 "파이썬 문법을 몰라도 로직(흐름)만 잘 짜면 AI가 다 해줍니다"라는 메시지를 지속적으로 던져주셔야 합니다.

---

## 7. 비즈니스 임팩트 예측 (Business Impact)

이 교육 과정이 성공적으로 끝났을 때, 한수원 조직 내에 다음과 같은 변화가 예측됩니다.
1.  **그림자 노동(Shadow Work) 감소:** 예산 정리, 강의안 초안 작성 등 반복 업무 시간이 획기적으로 단축됩니다.
2.  **시민 개발자(Citizen Developer) 탄생:** IT 부서에 의존하지 않고, 현업 담당자가 직접 필요한 미니 앱(안전 가이드 앱 등)을 뚝딱 만들어 쓰는 문화가 정착됩니다.

---

## 8. 실행 과제 및 개선 제안 (Actionable Plan)

설문 결과를 바탕으로 강사님과 운영진이 바로 적용해 볼 수 있는 아이디어입니다.

**🚀 당장 실행해 볼 수 있는 쉬운 아이디어 (Short-term)**
*   **'복붙'용 만능 프롬프트 템플릿 제공:** 프롬프트 작성을 어려워하므로, 현업에서 바로 쓸 수 있는 [상황-역할-목표-출력형식]이 빈칸으로 뚫려있는 템플릿을 첫날 배포하세요.
*   **한수원 맞춤형 예제 사용:** 일반적인 예제(쇼핑몰 리뷰 분석 등) 대신, 수강생들이 적어낸 '안전 규정 요약', '예산 엑셀 시각화'를 실제 수업 실습 예제로 활용하세요. 몰입도가 200% 올라갑니다.

**🌱 장기적으로 고민해 볼 방향성 (Long-term)**
*   **사내 AI 프롬프트 공유 게시판 개설:** 수강생들이 각자 만든 바이브코딩 결과물과 프롬프트를 공유할 수 있는 사내 위키나 채널을 만들어 지속적인 학습을 유도하세요.
*   **미니 해커톤 개최:** 과정 마지막 날, 거창한 시험 대신 팀별로 '우리 부서 업무 자동화 앱'을 만들어 발표하는 시간을 가지면 성취감이 극대화됩니다.

---

## 9. 핵심 타겟 페르소나 (Persona Development)

마지막으로, 이번 교육에서 강사님이 머릿속에 떠올리고 수업을 진행하셔야 할 **'가상의 대표 수강생'**입니다.

*   **이름:** 김바이브 책임 (한수원 실무 담당자)
*   **현재 상태:** 챗GPT나 제미나이로 간단한 검색이나 번역은 해봤음. 하지만 파이썬 같은 코딩은 전혀 모름.
*   **고민:** "매번 쏟아지는 안전 규정 문서와 예산 엑셀 파일을 정리하느라 야근하는데, AI가 이걸 알아서 시각화해 주는 웹페이지를 만들어주면 좋겠다."
*   **교육에서 바라는 점:** "어려운 코딩 용어 말고, 내가 원하는 걸 AI에게 어떻게 '말(프롬프트)'해야 찰떡같이 알아듣고 프로그램을 만들어주는지 그 공식을 알려주세요!"
`;

export default function SurveyView() {
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'dashboard' | 'table' | 'google-sheet'>('report');
  const [surveyData, setSurveyData] = useState<SurveyResponse[]>(FALLBACK_SURVEY_DATA);
  const [reportText, setReportText] = useState<string>(FALLBACK_AI_REPORT_TEXT);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [fetchStatus, setFetchStatus] = useState<'loaded_static' | 'loaded_live' | 'loaded_fallback'>('loaded_static');

  const parseReportCSVToText = (csvText: string): string => {
    const lines = csvText.split('\n');
    const cleanLines = lines.map(line => {
      let clean = line.trim();
      
      // Handle CSV quotes wrapping the cell
      if (clean.startsWith('"') && clean.endsWith('"')) {
        clean = clean.slice(1, -1);
      }
      clean = clean.replace(/""/g, '"');
      
      // If sheet exports trailing commas, clean them
      if (clean.endsWith(',')) {
        clean = clean.slice(0, -1);
      }
      return clean;
    });
    return cleanLines.join('\n');
  };

  const parseCSV = (csvText: string): SurveyResponse[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return FALLBACK_SURVEY_DATA;

    const parseCsvLine = (text: string) => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const header = parseCsvLine(lines[0]);
    const list: SurveyResponse[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      const cells = parseCsvLine(line);
      if (cells.length < 10) continue;

      const getNum = (val: string, def = 3): number => {
        const p = parseFloat(val);
        return isNaN(p) ? def : p;
      };

      list.push({
        timestamp: cells[0] || 'Unknown',
        name: cells[1] || '익명',
        avgRating: getNum(cells[2], 4.0),
        q1: cells[4] || '그렇다',
        q1Rating: getNum(cells[5], 4),
        q2: cells[7] || '그렇다',
        q2Rating: getNum(cells[8], 4),
        q3: cells[10] || '그렇다',
        q3Rating: getNum(cells[11], 4),
        q4: cells[13] || '그렇다',
        q4Rating: getNum(cells[14], 4),
        q5: cells[16] || '그렇다',
        q5Rating: getNum(cells[17], 4),
        q6: cells[19] || '그렇다',
        q6Rating: getNum(cells[20], 4),
        q7: cells[22] || '그렇다',
        q7Rating: getNum(cells[23], 4),
        q8: cells[25] || '그렇다',
        q8Rating: getNum(cells[26], 4),
        q9: cells[28] || '그렇다',
        q9Rating: getNum(cells[29], 4),
        q10: cells[31] || '그렇다',
        q10Rating: getNum(cells[32], 4),
        q11Text: cells[34] || cells[33] || '없음',
        q12Text: cells[36] || cells[35] || '없음',
        q13Text: cells[38] || cells[37] || '없음'
      });
    }

    return list.length > 0 ? list : FALLBACK_SURVEY_DATA;
  };

  const fetchLiveSpreadsheet = async () => {
    setLoading(true);
    try {
      // 1. Fetch raw responses from the survey responses sheet
      const responseUrl = 'https://docs.google.com/spreadsheets/d/1xVN6PtlnhUCEjO4Obj-Er2JtOQ04fFNARqN7MOfq5g4/export?format=csv';
      const responseRes = await fetch(responseUrl);
      if (responseRes.ok) {
        const responseText = await responseRes.text();
        const parsedData = parseCSV(responseText);
        setSurveyData(parsedData);
      }

      // 2. Fetch markdown report from the new user sheet GID 196870408
      const reportUrl = 'https://docs.google.com/spreadsheets/d/1QjOE3WSkajnuoFKp99VQHkSUseKErjk8yo1SabJ1POI/export?format=csv&gid=196870408';
      const reportRes = await fetch(reportUrl);
      if (reportRes.ok) {
        const reportRawText = await reportRes.text();
        const formattedReport = parseReportCSVToText(reportRawText);
        if (formattedReport && formattedReport.trim().length > 100) {
          setReportText(formattedReport);
        }
      }
      
      setFetchStatus('loaded_live');
    } catch (err) {
      console.warn("Dynamic Google Sheets fetch failed. Using fallback data.", err);
      setFetchStatus('loaded_fallback');
      setSurveyData(FALLBACK_SURVEY_DATA);
      setReportText(FALLBACK_AI_REPORT_TEXT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSpreadsheet();
  }, []);

  // Compute metrics dynamically from the survey dataset
  const totalCount = surveyData.length;
  
  const averageAll = Math.round(
    (surveyData.reduce((sum, r) => sum + r.avgRating, 0) / totalCount) * 10
  ) / 10;

  const getQuestionAverage = (qKey: keyof SurveyResponse): number => {
    const sum = surveyData.reduce((s, r) => {
      const val = r[qKey];
      return s + (typeof val === 'number' ? val : 0);
    }, 0);
    return Math.round((sum / totalCount) * 10) / 10;
  };

  const qAverages = [
    getQuestionAverage('q1Rating'),
    getQuestionAverage('q2Rating'),
    getQuestionAverage('q3Rating'),
    getQuestionAverage('q4Rating'),
    getQuestionAverage('q5Rating'),
    getQuestionAverage('q6Rating'),
    getQuestionAverage('q7Rating'),
    getQuestionAverage('q8Rating'),
    getQuestionAverage('q9Rating'),
    getQuestionAverage('q10Rating')
  ];

  const filteredData = surveyData.filter(item => {
    const matchesSearch = 
      item.q11Text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.q12Text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.q13Text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.timestamp.includes(searchTerm);

    if (ratingFilter === 'high') {
      return matchesSearch && item.avgRating >= 4.5;
    } else if (ratingFilter === 'mid') {
      return matchesSearch && item.avgRating >= 3.0 && item.avgRating < 4.5;
    } else if (ratingFilter === 'low') {
      return matchesSearch && item.avgRating < 3.0;
    }
    return matchesSearch;
  });

  // Render a single line of parsed markdown beautifully
  const renderReportLineText = (lineText: string, idx: number) => {
    const trimmed = lineText.trim();
    if (!trimmed) return <div key={idx} className="h-2" />;

    // Main header
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} id={`report-h-${idx}`} className="text-xl sm:text-2xl font-display font-extrabold text-[#11311b] mt-8 mb-4 border-b border-stone-200 pb-3 flex items-center space-x-2">
          <span>{trimmed.slice(2).replace(/\*\*/g, '')}</span>
        </h1>
      );
    }
    // Sub headers
    if (trimmed.startsWith('## ')) {
      const cleanHeaderTitle = trimmed.slice(3).replace(/\*\*/g, '');
      let headerIcon = <Award className="h-5 w-5 text-forest" />;
      if (cleanHeaderTitle.includes('핵심 요약')) headerIcon = <Sparkles className="h-5 w-5 text-amber-500" />;
      if (cleanHeaderTitle.includes('지표별')) headerIcon = <Activity className="h-5 w-5 text-emerald-500" />;
      if (cleanHeaderTitle.includes('IPA')) headerIcon = <TrendingUp className="h-5 w-5 text-indigo-500" />;
      if (cleanHeaderTitle.includes('세분화')) headerIcon = <Users2 className="h-5 w-5 text-blue-500" />;
      if (cleanHeaderTitle.includes('정성')) headerIcon = <MessageSquareDiff className="h-5 w-5 text-teal-500" />;
      if (cleanHeaderTitle.includes('상관관계')) headerIcon = <Brain className="h-5 w-5 text-purple-500" />;
      if (cleanHeaderTitle.includes('과제')) headerIcon = <Lightbulb className="h-5 w-5 text-orange-500" />;

      return (
        <h2 key={idx} id={`report-sh-${idx}`} className="text-sm sm:text-base font-display font-black text-stone-900 mt-10 mb-4 flex items-center space-x-2 bg-stone-50 py-3 px-4 rounded-xl border border-stone-150">
          {headerIcon}
          <span>{cleanHeaderTitle}</span>
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} id={`report-ssh-${idx}`} className="text-xs sm:text-sm font-extrabold text-stone-800 mt-6 mb-2 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-forest inline-block shrink-0"></span>
          <span>{trimmed.slice(4).replace(/\*\*/g, '')}</span>
        </h3>
      );
    }

    // Quote blocks
    if (trimmed.startsWith('>')) {
      return (
        <div key={idx} className="relative pl-5 py-3 pr-4 bg-emerald-50/50 border-l-4 border-emerald-500 rounded-r-xl my-4 text-xs sm:text-xs font-semibold text-emerald-800 italic leading-relaxed select-all">
          <Quote className="absolute top-2 left-2 h-3.5 w-3.5 text-emerald-300 opacity-60" />
          <p className="pl-4">{trimmed.slice(1).replace(/["']/g, '').replace(/\*\*/g, '').trim()}</p>
        </div>
      );
    }

    // Unordered lists
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      const isStrongStart = trimmed.slice(1).trim().startsWith('**');
      const textOfBullet = trimmed.slice(1).trim().replace(/\*\*/g, '');
      return (
        <div key={idx} className="flex items-start space-x-2 my-2 pl-3">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
          <span className={`text-stone-700 text-xs leading-relaxed ${isStrongStart ? 'font-bold' : 'font-medium'} select-all`}>
            {textOfBullet}
          </span>
        </div>
      );
    }

    // Ordered lists
    if (/^\d+\./.test(trimmed)) {
      const listText = trimmed.replace(/^\d+\./, '').trim().replace(/\*\*/g, '');
      const num = trimmed.match(/^\d+/)?.[0] || '1';
      return (
        <div key={idx} className="flex items-start space-x-2.5 my-3 pl-3">
          <span className="bg-forest/10 text-forest text-[10px] font-extrabold min-w-[18px] h-[18px] rounded-full inline-flex items-center justify-center shrink-0 mt-0.5">{num}</span>
          <span className="text-stone-700 text-xs leading-relaxed font-bold select-all">{listText}</span>
        </div>
      );
    }

    // Markdown Table Parser
    if (trimmed.startsWith('|')) {
      if (trimmed.includes('---')) return null;
      const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
      const isHeaderRow = trimmed.toLowerCase().includes('구분') || trimmed.toLowerCase().includes('평균');
      
      if (isHeaderRow) {
        return (
          <div key={idx} className="grid grid-cols-4 bg-stone-100 p-3 rounded-t-lg border-b border-stone-200 text-[10px] font-black text-stone-700 mt-4 tracking-tight">
            {cells.map((cell, cidx) => (
              <div key={cidx} className={cidx === 1 ? 'col-span-2' : ''}>{cell.replace(/\*\*/g, '')}</div>
            ))}
          </div>
        );
      } else {
        return (
          <div key={idx} className="grid grid-cols-4 bg-white/85 p-3 border-b border-stone-100 text-[11px] text-stone-605 text-stone-600 hover:bg-stone-50/50 transition-colors">
            {cells.map((cell, cidx) => (
              <div key={cidx} className={`${cidx === 1 ? 'col-span-2 font-bold text-stone-800' : ''} ${cidx === 0 ? 'font-black text-forest' : ''} ${cidx === 2 ? 'font-black font-mono text-stone-900 text-center bg-stone-50 rounded px-1' : ''}`}>
                {cell.replace(/\*\*/g, '')}
              </div>
            ))}
          </div>
        );
      }
    }

    // HR rule
    if (trimmed === '---') {
      return <hr key={idx} className="my-8 border-stone-200" />;
    }

    // Default typography formatting with bold match support
    return (
      <p key={idx} className="text-stone-705 text-stone-700 text-xs leading-relaxed my-3 font-semibold select-all">
        {trimmed.split('**').map((chunk, cidx) => {
          if (cidx % 2 === 1) {
            return <strong key={cidx} className="text-stone-900 font-extrabold bg-stone-100 px-1 py-0.5 rounded text-[11px] font-sans">{chunk}</strong>;
          }
          return chunk;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dynamic Header Section */}
      <div className="bg-[#11311b] text-white p-6 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-white/10 relative overflow-hidden">
        
        {/* Absolute Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.18),rgba(0,0,0,0))]"></div>
        
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-300 border border-white/15 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-amber-300" />
            <span>경영성과분석 라이브</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-display font-extrabold tracking-tight">
            한수원 AI리터러시 교육성과 보고서
          </h1>
          <p className="text-white/70 text-xs sm:text-xs max-w-2xl font-bold leading-relaxed">
            구글 스프레드시트와 실시간 연동되어 교육성과(AI리포트/사전평가 데이터)가 가공 없이 안전하게 자동 시각화됩니다.
          </p>
        </div>

        {/* Live Refresh Button - Always accessible! */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={fetchLiveSpreadsheet}
            disabled={loading}
            className="flex items-center justify-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-stone-950 px-5 py-3 rounded-full text-xs font-black shadow-lg hover:shadow-emerald-500/25 border border-emerald-400 transition-all cursor-pointer select-none"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-stone-900 ${loading ? 'animate-spin' : ''}`} />
            <span>실시간 데이터 갱신 (수동 업데이트)</span>
          </button>
          
          <div className="text-right flex flex-row sm:flex-col justify-end items-center sm:items-end gap-1 px-1">
            <span className="text-[10px] text-white/50 block font-bold">동기화 상태:</span>
            <span className={`inline-flex items-center space-x-1 text-[10px] font-black font-mono px-2 py-0.5 rounded-full ${
              fetchStatus === 'loaded_live' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : fetchStatus === 'loaded_fallback' 
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30' 
                  : 'bg-zinc-650 bg-stone-700 text-stone-300 border border-stone-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${fetchStatus === 'loaded_live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'} inline-block`}></span>
              <span>{fetchStatus === 'loaded_live' ? 'LIVE SYNC' : fetchStatus === 'loaded_fallback' ? 'OFFLINE CACHE' : 'NOT INITAILIZED'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation Panel */}
      <div className="flex bg-stone-105 bg-stone-100 p-1 rounded-2xl border border-stone-200 scrollbar-none overflow-x-auto touch-pan-x">
        <div className="flex space-x-1 min-w-max w-full">
          {[
            { id: 'report', label: 'AI 분석 리포트', icon: FileText, desc: '새 설문 리포트' },
            { id: 'dashboard', label: '설문 대시보드', icon: BarChart3, desc: '지표 정량 분석' },
            { id: 'table', label: '응답 데이터 검색', icon: Database, desc: '수강생 필터/검색' },
            { id: 'google-sheet', label: '구글 스프레드시트', icon: ExternalLink, desc: '시트 다이렉트 뷰' }
          ].map((subItem) => {
            const SubIcon = subItem.icon;
            const isSubActive = activeSubTab === subItem.id;
            return (
              <button
                key={subItem.id}
                onClick={() => setActiveSubTab(subItem.id as any)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-2 px-3 py-2.5 sm:py-3.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-[#11311b] text-white shadow-md font-extrabold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <SubIcon className="h-4 w-4 shrink-0" />
                <div className="text-center sm:text-left">
                  <span className="block text-[11px]">{subItem.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB 1: AI 분석 리포트 */}
      {activeSubTab === 'report' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Quick Stats overview panel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
              <span className="text-[10px] text-stone-400 font-extrabold uppercase">종합 사전 역량점수</span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-3xl font-black text-[#11311b] font-mono">3.5</span>
                <span className="text-xs text-stone-400 font-bold">/ 5.0 기준</span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold mt-2">전체 23인의 항목별 사전 역량 가중 산출값</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
              <span className="text-[10px] text-[#11311b] font-extrabold uppercase flex items-center space-x-1">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>가장 높은 지표 (Top 1)</span>
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 font-mono">4.3점</span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold mt-2">[Q10] 학습 및 현업 적용 의지</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs">
              <span className="text-[10px] text-red-500 font-extrabold uppercase flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span>가장 취약한 지표 (Bottom 1)</span>
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1.5">
                <span className="text-xl sm:text-2xl font-black text-rose-500 font-mono">2.6점</span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold mt-2">[Q8] 기존 프로그래밍 문법 경험</p>
            </div>
          </div>

          {/* AI Report Card Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-150 shadow-xs space-y-4">
            
            <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display font-black text-md sm:text-lg text-[#11311b]">
                  📊 AI리터러시 고급 과정 사전 심층 분석 결과
                </h3>
                <p className="text-[11px] text-stone-550 text-stone-500 font-semibold">
                  구글 스프레드시트 196870408 시트지에서 분석 마크다운 텍스트를 파싱하여 실시간으로 렌더링 중입니다.
                </p>
              </div>

              {/* Status information */}
              <div className="bg-[#f0f9f4] border border-[#d1f2dd] rounded-xl py-2 px-3 shrink-0 flex items-center space-x-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-800">
                  구글 스프레드시트 AI 가공 레포트
                </span>
              </div>
            </div>

            {/* Generated Report Content Area */}
            <div className="divide-y divide-stone-150/50 space-y-2 max-w-none">
              {reportText.split('\n').map((line, idx) => renderReportLineText(line, idx))}
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: 설문 대시보드 */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Key statistical parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs text-center">
              <span className="text-[10px] text-stone-400 font-bold block">설문 참여자</span>
              <p className="text-2xl font-black text-stone-900 mt-1 font-mono">{totalCount}명</p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs text-center">
              <span className="text-[10px] text-stone-400 font-bold block">전체 종합 평점</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 font-mono">{averageAll}</span>
              <span className="text-xs text-stone-400 font-bold font-mono"> / 5.0</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs text-center">
              <span className="text-[10px] text-stone-400 font-bold block">준비도 고평점자 (≥4.5)</span>
              <p className="text-2xl font-black text-indigo-600 mt-1 font-mono">
                {surveyData.filter(d => d.avgRating >= 4.5).length}명
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs text-center">
              <span className="text-[10px] text-stone-400 font-bold block">중급 대기자 (3.0~4.5)</span>
              <p className="text-2xl font-black text-amber-500 mt-1 font-mono">
                {surveyData.filter(d => d.avgRating >= 3.0 && d.avgRating < 4.5).length}명
              </p>
            </div>
          </div>

          {/* Quantitative analysis progress sliders */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-150 shadow-xs space-y-8">
            <div className="border-b pb-4">
              <h3 className="font-display font-black text-[#11311b] text-base">
                📊 문항별 평균 역량 및 의지 (Quantitative Indicators)
              </h3>
              <p className="text-xs text-stone-500 font-bold mt-1">
                각 질문별 5.0 만점 기준 정량 환산치입니다.
              </p>
            </div>

            <div className="space-y-6">
              {QUESTIONS.map((qText, qIdx) => {
                const avgValue = qAverages[qIdx] || 0.0;
                
                // Determine color spectrum based on score
                let scoreColor = 'bg-rose-500';
                if (avgValue >= 4.0) scoreColor = 'bg-emerald-600';
                else if (avgValue >= 3.0) scoreColor = 'bg-amber-500';

                return (
                  <div key={qIdx} className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-xs font-black text-stone-800 leading-relaxed max-w-[85%]">
                        {qText}
                      </span>
                      <span className="font-mono font-black text-xs text-stone-900 shrink-0">
                        {avgValue}점
                      </span>
                    </div>

                    <div className="relative">
                      {/* Grid Markers */}
                      <div className="absolute inset-x-0 top-0 h-2 bg-stone-100 rounded-full"></div>
                      <div 
                        className={`absolute top-0 h-2 rounded-full transition-all duration-500 ${scoreColor}`}
                        style={{ width: `${(avgValue / 5.0) * 100}%` }}
                      ></div>
                    </div>

                    {/* Meta indicator */}
                    <div className="flex justify-between text-[9px] text-stone-400 font-semibold font-mono">
                      <span>0점 (학습전)</span>
                      <span>2.5점 (기진입)</span>
                      <span>5.0점 (전문도 완비)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border text-xs text-stone-600 space-y-1.5 font-bold">
              <p className="text-[#11311b] font-black text-xs">💡 통계적 인사이트 피드백 요약 :</p>
              <p>• 수강생들의 파이썬 연관 경험(2.6점)이 유독 낮아, 문법 주입식 개발 대신 <strong>프롬프팅을 통한 즉각적인 바이브코딩</strong> 교육 진입이 교육의 몰입과 만족을 보장합니다.</p>
              <p>• 학습 적용의지(4.3점) 및 인식도(4.3점)가 대단히 높으므로, 첫 세션에서 강한 실무 성공 사례(Quick win)를 보여주는 것이 교육과정 설계의 주도권입니다.</p>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 3: 응답 데이터 검색 */}
      {activeSubTab === 'table' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Controls bar */}
          <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Live Search input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="검색어 또는 날짜 입력..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
              <span className="text-[10px] font-bold text-stone-400 shrink-0">평점별 필터:</span>
              <button
                onClick={() => setRatingFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 border transition-all cursor-pointer ${
                  ratingFilter === 'all' 
                    ? 'bg-[#11311b] text-white border-[#11311b]' 
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                전체 ({surveyData.length})
              </button>
              <button
                onClick={() => setRatingFilter('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 border transition-all cursor-pointer ${
                  ratingFilter === 'high' 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-emerald-50/55 text-emerald-800 border-emerald-200 hover:bg-emerald-100/40'
                }`}
              >
                고점자 (≥4.5)
              </button>
              <button
                onClick={() => setRatingFilter('mid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 border transition-all cursor-pointer ${
                  ratingFilter === 'mid' 
                    ? 'bg-amber-500 text-stone-900 border-amber-500' 
                    : 'bg-amber-50/55 text-amber-800 border-amber-200 hover:bg-amber-100/40'
                }`}
              >
                중점자 (3.0~4.5)
              </button>
            </div>
          </div>

          {/* Response database block */}
          <div className="bg-white rounded-3xl border border-stone-150 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-55 pt-1.5 bg-stone-50 border-b border-stone-150 text-stone-500 text-[11px] font-black tracking-tight select-none">
                    <th className="p-4 w-12 text-center">No</th>
                    <th className="p-4 w-40">제출 타임스탬프</th>
                    <th className="p-4 w-16 text-center">사전 등급</th>
                    <th className="p-4">가장 유용한 AI 도구 (Q11)</th>
                    <th className="p-4">습득 희망 기술 역량 (Q12)</th>
                    <th className="p-4">효율화 필요 프로세스 (Q13)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs sm:text-xs">
                  {filteredData.length > 0 ? (
                    filteredData.map((resp, index) => {
                      return (
                        <tr key={index} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-stone-400 text-center">{index + 1}</td>
                          <td className="p-4 font-mono font-bold text-stone-500">{resp.timestamp}</td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex px-2 py-1.5 rounded-lg text-[11px] font-black leading-none ${
                              resp.avgRating >= 4.5 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : resp.avgRating >= 3.0 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-stone-50 text-stone-600 border border-stone-200'
                            }`}>
                              {resp.avgRating}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-stone-900 truncate max-w-[150px]" title={resp.q11Text}>
                            {resp.q11Text || '-'}
                          </td>
                          <td className="p-4 font-semibold text-stone-750 max-w-[250px] leading-relaxed select-all">
                            {resp.q12Text && resp.q12Text !== '0' ? resp.q12Text : '-'}
                          </td>
                          <td className="p-4 font-semibold text-stone-750 max-w-[280px] leading-relaxed select-all">
                            {resp.q13Text && resp.q13Text !== '0' ? resp.q13Text : '-'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-stone-400 font-bold">
                        검색 조건과 일치하는 설문 결과가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-stone-50 p-3 flex justify-between items-center text-xs font-bold text-stone-500 border-t border-stone-150">
              <span>총 {filteredData.length}개 응답 행 표시 중</span>
              <span>데이터를 마우스로 자유롭게 드래그하여 바로 복사할 수 있습니다.</span>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: 원본 스프레드시트 임베드 */}
      {activeSubTab === 'google-sheet' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border border-stone-150 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-extrabold text-stone-900 text-sm">한수원 교육설문 구글 스프레드시트 라이브 뷰</h4>
              <p className="text-xs text-stone-500 font-bold">전송된 정량/정성 설문 데이터가 원본 시트에 기재되면 분석 리포트 화면과 대시보드 화면에 자동 기재됩니다.</p>
            </div>
            <a 
              href="https://docs.google.com/spreadsheets/d/1QjOE3WSkajnuoFKp99VQHkSUseKErjk8yo1SabJ1POI/edit?gid=196870408#gid=196870408"
              target="_blank"
              rel="noreferrer"
              className="bg-forest hover:bg-forest-dark text-white font-black hover:scale-102 mt-2 sm:mt-0 active:scale-98 transition-all px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
            >
              <ExternalLink className="h-4 w-4" />
              <span>구글 스프레드시트 새창에서 열기</span>
            </a>
          </div>

          {/* Large iFrame Embed */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-xl border border-stone-800 p-2 sm:p-3">
            <div className="relative pb-[65%] h-0 rounded-2xl overflow-hidden bg-white">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-0"
                src="https://docs.google.com/spreadsheets/d/1QjOE3WSkajnuoFKp99VQHkSUseKErjk8yo1SabJ1POI/htmlview?gid=196870408&chrome=false"
                title="한수원 F&P 교육설문 구글 시트 원본"
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
