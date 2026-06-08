import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageSquare, AlertCircle, Sparkles, ClipboardCheck, UserPlus } from 'lucide-react';
import { Registration } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReg: Registration) => void;
}

// Checklist Items declared statically
const CHECKLIST_ITEMS = [
  { id: 'item-1', text: '목적지(오류캠핑장 등) 기상 상황 및 대피로 사전 파악', icon: '🌤️' },
  { id: 'item-2', text: '60L 배낭 하중 분산 상태 및 어깨끈/허리벨트 결함 여부 점검', icon: '🎒' },
  { id: 'item-3', text: '백패킹 텐트(폴대, 팩, 스킨) 및 접이식 캠핑 매트 손상 여부 확인', icon: '⛺' },
  { id: 'item-4', text: '비상 구급약(연고, 밴드, 소독약 등) 및 체온 유지용 은박 담요 준비', icon: '🩹' },
  { id: 'item-5', text: '보조 배터리 완충 및 헤드랜턴 등 조명 기기 정상 작동 확인', icon: '🔦' },
  { id: 'item-6', text: '충분한 식수 및 열량 높은 비상식량(행동식) 구비', icon: '💧' },
  { id: 'item-7', text: '화기 사용 시 안전 수칙 숙지 및 주변 인화 물질 확인', icon: '🔥' }
];

export default function JoinModal({ isOpen, onClose, onSuccess }: JoinModalProps) {
  // Tabs state: starts at 'checklist' as requested by the user
  const [activeTab, setActiveTab] = useState<'checklist' | 'register'>('checklist');

  // Checklist state
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(() => {
    return CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {});
  });

  // original registration form states
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Registration | null>(null);

  // Auto-reset state when modal closes / opens
  useEffect(() => {
    if (!isOpen) {
      // Just keep active tab as is or reset on close
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle checklist item
  const handleToggleChecklist = (id: string) => {
    setChecklistState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reset checklist State
  const handleResetChecklist = () => {
    setChecklistState(
      CHECKLIST_ITEMS.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
    );
  };

  // Calculations for Checklist
  const totalItems = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const percentage = Math.round((completedCount / totalItems) * 100);

  // Auto hyphen helper for Korean phone numbers
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    let formattedVal = rawVal;
    if (rawVal.length > 3 && rawVal.length <= 7) {
      formattedVal = `${rawVal.slice(0, 3)}-${rawVal.slice(3)}`;
    } else if (rawVal.length > 7) {
      formattedVal = `${rawVal.slice(0, 3)}-${rawVal.slice(3, 7)}-${rawVal.slice(7, 11)}`;
    }
    setPhone(formattedVal);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('성함을 입력해 주세요.');
      return;
    }
    if (name.trim().length < 2) {
      setError('올바른 성함을 두 글자 이상 입력해 주세요.');
      return;
    }
    if (!department.trim()) {
      setError('소속 부서를 입력해 주세요 (예: F&P 본사 기획팀).');
      return;
    }
    
    // Validate phone pattern (Korean standard 010-XXXX-XXXX)
    const phoneRegex = /^010-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      setError('올바른 휴대폰 번호를 입력해 주세요 (010-XXXX-XXXX).');
      return;
    }

    const newRegistration: Registration = {
      id: String(Date.now()),
      name: name.trim(),
      department: department.trim(),
      phoneNumber: phone,
      experience,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    // Save to local storage for persistence
    const savedRegs = JSON.parse(localStorage.getItem('fp_registrations') || '[]');
    savedRegs.push(newRegistration);
    localStorage.setItem('fp_registrations', JSON.stringify(savedRegs));

    setSubmittedData(newRegistration);
    setIsSubmitted(true);
    onSuccess(newRegistration);
  };

  const handleResetModalAll = () => {
    setName('');
    setDepartment('');
    setPhone('');
    setExperience('beginner');
    setError('');
    setIsSubmitted(false);
    setSubmittedData(null);
    handleResetChecklist();
    setActiveTab('checklist');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="relative bg-stone-50 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-500" />
            <h3 className="font-extrabold text-lg tracking-tight font-display text-stone-100">
              F&P 백패킹 포털
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex bg-stone-100 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ClipboardCheck className="h-4 w-4" />
            <span>🏕️ 안전점검 체크리스트</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>✍️ F&P 멤버 가입 신청</span>
          </button>
        </div>

        {/* Modal Content Container */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {/* Tab 1: Checklist */}
          {activeTab === 'checklist' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Emerald Checklist Header Card */}
              <div className="bg-emerald-600 px-6 py-6 text-white text-center rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10">
                  <ClipboardCheck className="h-32 w-32 rotate-12" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 flex items-center justify-center gap-2">
                  🏕️ 백패킹 안전점검
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                  안전하고 즐거운 백패킹을 위한 필수 확인 사항
                </p>
              </div>

              {/* Progress calculation UI */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs sm:text-sm font-bold text-stone-700">
                    진행률 {percentage}%
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600">
                    {completedCount} / {totalItems} 완료
                  </span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden border border-stone-200/50">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Checklist items rendering exactly replicating the provided HTML layout */}
              <div className="space-y-2.5">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checklistState[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`group flex items-center p-3.5 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none ${
                        isChecked 
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900' 
                          : 'border-stone-200/60 bg-white hover:border-emerald-100 hover:bg-stone-50'
                      }`}
                    >
                      <div className="relative flex items-center cursor-pointer w-full">
                        {/* Custom Green Checkbox */}
                        <div className={`flex-shrink-0 w-5.5 h-5.5 rounded-md border-2 mr-3.5 flex items-center justify-center transition-all ${
                          isChecked 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-stone-300 bg-white group-hover:border-emerald-400'
                        }`}>
                          <svg className={`w-3.5 h-3.5 text-white transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>

                        {/* Icon and Text */}
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-xl shrink-0">{item.icon}</span>
                          <span className={`text-xs sm:text-sm transition-all duration-200 leading-snug font-bold ${
                            isChecked 
                              ? 'text-stone-400 line-through decoration-stone-400' 
                              : 'text-stone-700 font-bold'
                          }`}>
                            {item.text}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion messages with animated scale-in when all items are checked */}
              {completedCount === totalItems ? (
                <div className="p-4 sm:p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center animate-fade-in space-y-3.5">
                  <div>
                    <p className="text-emerald-800 font-extrabold text-base sm:text-lg flex items-center justify-center gap-1.5">
                      ✅ 모든 점검이 완료되었습니다!
                    </p>
                    <p className="text-emerald-600 mt-1 text-xs font-bold leading-relaxed">
                      LNT(흔적안남기기) 수칙을 지키는 당신은 멋진 백패커입니다.
                      안전하게 다녀오세요!
                    </p>
                  </div>
                  
                  {/* CTA to fill the form in Tab 2 */}
                  {!isSubmitted && (
                    <button
                      onClick={() => setActiveTab('register')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>서약하고 멤버 가입 신청 바로가기</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 text-[11px] leading-relaxed text-stone-500 font-bold text-center">
                  💡 필수 항목 7가지를 점검해 보면서 아름다운 동행을 계획하세요!
                </div>
              )}

              {/* Reset button exactly replicating template behavior */}
              <div className="text-center pt-2">
                <button 
                  onClick={handleResetChecklist} 
                  className="text-xs text-stone-400 hover:text-stone-600 underline transition-colors cursor-pointer"
                >
                  모든 항목 초기화
                </button>
              </div>

            </div>
          )}

          {/* Tab 2: Regular Registration */}
          {activeTab === 'register' && (
            <div className="animate-fade-in">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 text-stone-600 text-xs sm:text-sm font-semibold leading-relaxed">
                    한수원 F&P 선후배 임직원들과 동캠퍼들이 만든 최고의 아웃도어 동호회!<br/>
                    단 10초 만에 가입을 신청하고 카카오 공식 단톡방 암호를 받아가세요.
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="flex items-start space-x-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs sm:text-sm font-bold">
                      <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Name Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">이름</label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white font-bold text-stone-900"
                    />
                  </div>

                  {/* Department Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">소속 부서</label>
                    <input
                      type="text"
                      placeholder="예: F&P 건설기술실 발전건축부"
                      value={department}
                      onChange={(e) => { setDepartment(e.target.value); setError(''); }}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white font-bold text-stone-900"
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700 flex justify-between">
                      <span>휴대폰 번호 <span className="text-[10px] text-stone-500 font-semibold">(실시간 가입 웰컴 문자 발송)</span></span>
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      placeholder="010-XXXX-XXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full px-4 py-2 rounded-xl border border-stone-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white text-stone-900 font-mono font-bold"
                    />
                  </div>

                  {/* Experience Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">백패킹 / 야외 캠핑 경험</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm bg-white cursor-pointer text-stone-900 font-bold"
                    >
                      <option value="beginner">백린이 (경험 0-1회, 장비 없음, 분위기 선호)</option>
                      <option value="intermediate">아웃도어 중급자 (1년 내 기어 준비, 숲/강 캠핑 경험)</option>
                      <option value="expert">백패킹 고수 (겨울철 극동기 텐트 취침 유경험자)</option>
                    </select>
                  </div>

                  {/* LNT Terms */}
                  <div className="bg-stone-100 p-3.5 rounded-xl border border-stone-200 text-[11px] leading-relaxed text-stone-600 font-bold">
                    <p className="font-extrabold text-emerald-700 mb-1">💡 F&P 안전 서약 문화</p>
                    동호회 가입함과 동시에 산림과 해변 보호구역의 LNT 수칙(흔적 남기지 않기)을 약속하며, 원전 임직원 명예와 아웃도어 매너를 적극 지켜나갑니다.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-stone-900 hover:bg-stone-950 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer text-sm"
                  >
                    가입 완료하고 웰컴 문자 프리뷰 확인
                  </button>
                </form>
              ) : (
                // Sign Up Success State
                <div className="text-center py-4 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xl font-extrabold text-stone-900 font-display">가입 신청 완료! 🎉</h4>
                    <p className="text-xs text-emerald-800 font-bold bg-emerald-50/70 inline-block px-4 py-1.5 rounded-full border border-emerald-100">
                      가입 완료 SMS API 테스트 성공!
                    </p>
                    <div className="text-xs text-amber-800 font-bold bg-amber-50 p-3 text-center rounded-xl border border-amber-200 max-w-sm mx-auto mt-2 leading-relaxed">
                      ⚠️ 관리자 승인 대기 상태입니다. 메인 하단의 '최종 관리자 승인 데스크'에서 승인 완료 처리가 될 시 갤러리/기본 글쓰기 권한이 바로 전용 승인 처리됩니다.
                    </div>
                  </div>

                  <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 text-left space-y-3.5 text-xs sm:text-sm">
                    <div>
                      <span className="text-xs font-bold text-stone-500 block font-mono">가입 대상 임직원</span>
                      <span className="text-sm font-extrabold text-stone-900">{submittedData?.name} 회원님 ({submittedData?.department})</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-500 block font-mono">가상 전송 구동 문자 메시지 프리뷰 (Aligo API 연계)</span>
                      <div className="mt-1.5 bg-white p-3 rounded-xl border border-stone-200 text-xs font-mono text-stone-600 leading-relaxed max-h-[120px] overflow-y-auto whitespace-pre-wrap select-all font-semibold">
                        {`[F&P 아웃도어] 안녕하세요, ${submittedData?.name}님!
F&P 백패킹·캠핑 동호회 가입이 성공했습니다.

■ 한수원 패밀리 단톡방 링크:
https://open.kakao.com/o/gFP_khnp_backpack
■ 입장 참여 암호: 2026packing

동료 임직원들과 소통하며 중복투자 없는 안전한 가이드도 함께 즐겨보세요!`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-3">
                    <a
                      href="https://open.kakao.com/o/gFP_khnp_backpack"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-1.5 bg-[#FEE500] hover:bg-[#FDD200] text-[#191919] font-black py-3 px-4 rounded-xl shadow-xs text-xs sm:text-sm cursor-pointer"
                    >
                      <MessageSquare className="h-4.5 w-4.5" />
                      <span>공식 카카오 단톡방 즉시 이동</span>
                    </a>
                    <button
                      onClick={handleResetModalAll}
                      className="flex-1 bg-stone-950 hover:bg-black text-white font-extrabold py-3 px-4 rounded-xl shadow-xs text-xs sm:text-sm cursor-pointer"
                    >
                      확인 완료 (메인으로)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
