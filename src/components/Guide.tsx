import React, { useState } from 'react';
import { CURATED_GEAR_LIST, SAFETY_GUIDELINES } from '../data';
import { ShieldAlert, Info, ChevronDown, ChevronUp, Backpack, HelpCircle, Leaf, Zap, HardHat } from 'lucide-react';
import { GearItem } from '../types';

export default function Guide() {
  const [expandedGearId, setExpandedGearId] = useState<string | null>('gear-1');

  const toggleGear = (id: string) => {
    if (expandedGearId === id) {
      setExpandedGearId(null);
    } else {
      setExpandedGearId(id);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'backpack': return { label: '배낭 (Pack)', color: 'bg-emerald-100 text-emerald-800' };
      case 'tent': return { label: '주거 (Tent)', color: 'bg-blue-100 text-blue-800' };
      case 'sleeping': return { label: '침장 (Sleep)', color: 'bg-indigo-100 text-indigo-800' };
      case 'cooking': return { label: '취사 (Cook)', color: 'bg-amber-100 text-amber-800' };
      default: return { label: '안전성 (Safe)', color: 'bg-rose-100 text-rose-800' };
    }
  };

  return (
    <div className="bg-sand/10 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Intro Section - About F&P */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-wood/20 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-forest/10 text-forest rounded-xl">
              <Leaf className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest font-display">About F&P</h2>
          </div>
          <p className="text-stone-700 font-bold text-sm sm:text-base leading-relaxed mb-6">
            <strong className="text-forest font-extrabold font-display">Folding and Packing (F&P)</strong>은 복잡한 도심과 원전 건설 현장의 
            치열한 긴장을 내려놓고, 자연 속으로 최소한의 무게만을 가볍게 접고 꾸려 떠나자는 의미로 설립된 <strong className="text-wood">한국수력원자력 F&P 공식 오프캠프/백패킹 동호회</strong>입니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-forest/5 border border-forest/25 space-y-2">
              <h3 className="font-extrabold text-forest text-base flex items-center space-x-1.5 font-display">
                <Zap className="h-4.5 w-4.5" />
                <span>Folding의 미학 (소유의 간소화)</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-semibold">
                튼튼함을 유지하면서 텐트와 폴대, 초경량 매트와 조리 시스템을 가능한 가장 간결한 크기로 접어냅니다. 
                불필요한 과시용 캠핑 장비를 배제하고 오직 나만을 위한 힐링에 집중합니다.
              </p>
            </div>
            
            <div className="p-5 rounded-xl bg-wood/5 border border-wood/25 space-y-2">
              <h3 className="font-extrabold text-[#8b5a2b] text-base flex items-center space-x-1.5 font-display">
                <Leaf className="h-4.5 w-4.5 animate-pulse" />
                <span>Packing의 낭만 (길 위의 자유)</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-semibold">
                60리터 남짓한 등짐 하나에 삶에 꼭 필요한 삼끼 식사와 간이 보금자리를 정성껏 수납합니다. 
                그 배낭을 지고 숲길과 바다를 걷는 순간, 우리는 진정한 해방감을 마주하게 됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Curation Guide - Accordion UI */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-sm border border-wood/20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#8b5a2b]/10 text-wood rounded-xl">
                <Backpack className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">중복 투자 영개화 장비 추천 큐레이션</h2>
                <span className="text-[11px] text-wood font-bold font-sans block mt-0.5">※ 무경험 입문자도 단숨에 핵심 준비 완료!</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-0 inline-flex text-xs font-bold px-3 py-1.5 bg-[#8b5a2b]/10 text-[#8b5a2b] rounded-lg self-start border border-wood/20">
              💡 한수원 복지 포인트 연동 최적화 가격대
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-bold leading-relaxed mb-6 border-b border-wood/20 pb-5">
            전원 아웃도어 동호회 선배들이 겪었던 수백만 원짜리 명품 중복투자 스토리를 모아, 
            가방부터 텐트까지 실제 안전성과 피로도를 점검하여 가성비 No.1 브랜드를 추천합니다. 
            아래 추천 목록을 눌러 상세 세그먼트와 꿀팁을 분석해 보세요!
          </p>

          {/* Accordion List */}
          <div className="space-y-3">
            {CURATED_GEAR_LIST.map((gear: GearItem) => {
              const isExpanded = expandedGearId === gear.id;
              const badge = getCategoryBadge(gear.category);
              return (
                <div 
                  key={gear.id} 
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? 'border-forest bg-forest/5 shadow-md scale-[1.01]' 
                      : 'border-wood/10 bg-white hover:border-wood/35 hover:bg-forest/5'
                  }`}
                >
                  <button
                    onClick={() => toggleGear(gear.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-stone-800 leading-normal focus:outline-none cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center gap-2 pr-4">
                      <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-stone-900 leading-tight">
                        {gear.name}
                      </span>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-forest" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-stone-400" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-forest/10 text-stone-700 text-xs sm:text-sm animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white p-4 rounded-xl border border-wood/20">
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 font-mono block uppercase">스펙 정보</span>
                          <span className="font-extrabold text-stone-800 mt-1 block">{gear.specs}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-stone-400 font-mono block uppercase">추천 구매 가격 모델</span>
                          <span className="font-bold text-forest mt-1 block">{gear.price}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#8b5a2b] uppercase flex items-center space-x-1 font-display">
                          <Info className="h-3.5 w-3.5 text-forest" />
                          <span>추천하는 이유 (Why Recommend)</span>
                        </span>
                        <p className="text-stone-600 font-bold leading-relaxed pl-1">
                          {gear.whyRecommend}
                        </p>
                      </div>

                      <div className="bg-sand/65 p-4 rounded-xl border border-wood/20 space-y-1">
                        <span className="text-xs font-bold text-wood flex items-center space-x-1.5 font-display">
                          <Leaf className="h-4 w-4 text-forest" />
                          <span>F&P 스페셜 피칭/보행 비법 팁</span>
                        </span>
                        <p className="text-stone-700 font-bold leading-relaxed text-xs pl-1">
                          {gear.tip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Guidelines Card - Nuclear Power Division focused! */}
        <div className="bg-white/95 backdrop-blur-sm text-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-t-forest border-x border-b border-zinc-200/80 relative overflow-hidden">
          {/* Subtle Background Icon decoration representing the construction security */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-[0.04] text-zinc-900 pointer-events-none">
            <HardHat className="h-64 w-64" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-zinc-100 pb-4">
              <div className="p-3 bg-forest/10 text-forest rounded-xl">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-zinc-900">{SAFETY_GUIDELINES.title}</h2>
                <p className="text-xs text-zinc-500 font-bold tracking-wide mt-0.5">{SAFETY_GUIDELINES.subtitle}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 font-bold leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
              💡 {SAFETY_GUIDELINES.introduction}
            </p>

            <div className="space-y-4 pt-2">
              {SAFETY_GUIDELINES.rules.map((rule, idx) => (
                <div key={idx} className="flex gap-3 items-start text-xs sm:text-sm leading-relaxed">
                  <div className="bg-forest text-white font-black font-mono h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-[11px] mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-zinc-900 text-sm sm:text-base">{rule.title}</h4>
                    <p className="text-zinc-600 font-bold text-xs sm:text-sm">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-center text-xs text-zinc-600 leading-relaxed font-bold">
              <span className="font-bold underline block mb-1 text-forest">📢 F&P 특별 안전 연락망</span>
              동부 및 동해 전담 구조 협조 기관 번호 기입 완료 / 조난 상황 발생 즉시 카카오톡 그룹 채팅방 및 해양구조대(112), 소방구조대(119) 동시 무선 호출
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
