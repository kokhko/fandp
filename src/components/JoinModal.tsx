import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';
import { Registration } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReg: Registration) => void;
}

export default function JoinModal({ isOpen, onClose, onSuccess }: JoinModalProps) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<Registration | null>(null);

  if (!isOpen) return null;

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

    // SMS API Integration Guide Point (Aligo & CoolSMS SDK simulation)
    /*
      ========================================================================
      [SMS 송신 자동화 백엔드 API / SDK 연동 설계 가이드]
      
      본 프론트엔드는 가입 승인 즉시, 사전 세팅된 SMS 발송 라이브러리/엔드포인트를 호출합니다.

      1. CoolSMS 연동 예시 (NodeJS / tsx):
         import coolsms from 'coolsms-node-sdk';
         const messageService = new coolsms('YOUR_API_KEY', 'YOUR_API_SECRET');
         
         const sendWelcomeSMS = async (to: string, userName: string) => {
           try {
             const res = await messageService.sendOne({
               to: to.replace(/-/g, ''), // 하이픈 제거 필수
               from: '02-XXX-XXXX', // 한수원 F&P 담당자 승인 발신번호
               text: `[F&P 아웃도어] ${userName} 회원님, 가입을 진심으로 환영합니다!\n\n캠핑과 백패킹의 설렘을 나누는 한수원 공식 단톡방에 지금 접속해보세요!\n\n■ 공식 단톡방 링크: https://open.kakao.com/o/gFP_khnp_backpack\n■ 패밀리 암호: packing2026\n\n중복 투자를 막아줄 '1초 맞춤 초보자 장비 추천 가이드'도 홈페이지에서 바로 확인해보세요!`
             });
             console.log('문자 발송 성공:', res);
           } catch (e) {
             console.error('문자 발송 실패:', e);
           }
         };

      2. Aligo (알리고) REST API 연동 예시 (Server Side Express):
         import axios from 'axios';
         import qs from 'qs';

         const sendAligoSMS = async (to: string, userName: string) => {
           const data = {
             key: process.env.ALIGO_API_KEY,      // .env 내 Aligo API 키
             user_id: process.env.ALIGO_USER_ID, // 알리고 가입 계정 ID
             sender: '010XXXXYYYY',              // 승인된 발신용 번호
             receiver: to,
             msg: `[F&P] ${userName}님, 가입 환영! 단톡방 주소: open.kakao.com/o/... 암호: FPforest26`
           };
           await axios.post('https://apis.aligo.in/send/', qs.stringify(data));
         };
      ========================================================================
    */

    // Save to local storage for persistence mocking
    const savedRegs = JSON.parse(localStorage.getItem('fp_registrations') || '[]');
    savedRegs.push(newRegistration);
    localStorage.setItem('fp_registrations', JSON.stringify(savedRegs));

    setSubmittedData(newRegistration);
    setIsSubmitted(true);
    onSuccess(newRegistration);
  };

  const handleReset = () => {
    setName('');
    setDepartment('');
    phoneRegexHelper_reset();
    setExperience('beginner');
    setError('');
    setIsSubmitted(false);
    setSubmittedData(null);
    onClose();
  };

  const phoneRegexHelper_reset = () => {
    setPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div className="relative bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-wood/25 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-forest text-white border-b border-wood/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-sand animate-pulse" />
            <h3 className="font-extrabold text-lg tracking-tight font-display">F&P 멤버 가입하기</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-sand-light hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content container with scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-sm text-stone-600 mb-4 font-bold leading-relaxed">
                  한수원 F&P 선후배 임직원들과 동캠퍼들이 만든 최고의 힐링 동호회!<br/>
                  단 10초 만에 가입을 확인하고 전용 웰컴 문자와 공식 단톡방 비밀번호를 받아가세요.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start space-x-2 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-200 text-xs sm:text-sm font-bold">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-wood/25 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-sm bg-stone-50 font-bold text-stone-900"
                />
              </div>

              {/* Department Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">소속 부서</label>
                <input
                  type="text"
                  placeholder="예: F&P 건설기술실 발전건축부"
                  value={department}
                  onChange={(e) => { setDepartment(e.target.value); setError(''); }}
                  className="w-full px-4 py-2.5 rounded-xl border border-wood/25 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-sm bg-stone-50 font-bold text-stone-900"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700 flex justify-between">
                  <span>휴대폰 번호 <span className="text-[10px] text-wood font-medium font-semibold">(실시간 웰컴 문자 발송용)</span></span>
                </label>
                <input
                  type="text"
                  maxLength={13}
                  placeholder="010-XXXX-XXXX"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-wood/25 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-sm bg-stone-50 text-stone-900 font-mono font-bold"
                />
              </div>

              {/* Experience Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">백패킹 / 야외 캠핑 경험</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-wood/25 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-sm bg-stone-50 cursor-pointer text-stone-900 font-bold"
                >
                  <option value="beginner">백린이 (경험 0-1회, 장비 없음, 캠핑 분위기만 좋아함)</option>
                  <option value="intermediate">아웃도어 중급자 (1년 내 기어 장만, 산/강 캠핑 경험)</option>
                  <option value="expert">백패킹 고수 (가을/겨울 영하 기온 실외 백패킹 유경험자)</option>
                </select>
              </div>

              {/* Guidelines Small terms */}
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-[11px] leading-relaxed text-zinc-650 font-bold">
                <p className="font-extrabold text-forest mb-1">💡 F&P 동호회 안전 서약</p>
                본인은 가입함과 동시에 캠핑 및 아웃도어 환경에서 LNT 수칙(흔적 남기지 않기)을 자발적으로 이행하고, 
                허가되지 않은 야간 취사를 하지 않는 등 원전 임직원 명예와 산림 안전 문화를 적극 지켜나갈 것을 약속합니다.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-forest hover:bg-forest-dark text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm"
              >
                가입 완료 및 웰컴 메시지 전송
              </button>
            </form>
          ) : (
            // Success State
            <div className="text-center py-6 px-2 space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-2">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-2xl font-extrabold text-stone-900 font-display">가입 신청 완료! 🎉</h4>
                <p className="text-sm text-green-800 font-bold bg-green-50/70 inline-block px-4 py-2 rounded-full border border-green-100">
                  웰컴 문자 발송 API 연동 트리거 성공!
                </p>
                <div className="text-xs text-amber-800 font-bold bg-amber-50 p-2 text-center rounded-xl border border-amber-200 max-w-sm mx-auto mt-2">
                  ⚠️ 최종 관리자 승인 대기 상태입니다. 메인 화면의 '최종 관리자 승인 데스크'에서 승인 처리가 완료되어야 갤러리 글 작성이 가능해집니다.
                </div>
              </div>

              <div className="bg-sand/15 p-4 rounded-xl border border-wood/25 text-left space-y-3.5 text-sm">
                <div>
                  <span className="text-xs font-bold text-wood block font-mono">수신 대상자</span>
                  <span className="text-base font-extrabold text-stone-900">{submittedData?.name} 회원님 ({submittedData?.department})</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-wood block font-mono">가상 전송 문자 메시지 프리뷰 (Aligo API 등 활용)</span>
                  <div className="mt-1.5 bg-white p-3.5 rounded-xl border border-wood/10 text-xs font-mono text-stone-700 leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap select-all font-semibold">
                    {`[F&P 아웃도어] 안녕하세요, ${submittedData?.name}님!
F&P 백패킹·캠핑 동호회 가입이 성공했습니다.

■ 한수원 패밀리 단톡방 링크:
https://open.kakao.com/o/gFP_khnp_backpack
■ 입장 참여 암호: 2026packing

동료 임직원들과 소통하며 중복투자 없는 안전한 가이드도 함께 즐겨보세요!`}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3">
                <a
                  href="https://open.kakao.com/o/gFP_khnp_backpack"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-[#FEE500] hover:bg-[#FDD200] text-[#191919] font-black py-3.5 px-4 rounded-xl shadow-sm text-xs sm:text-sm cursor-pointer"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>공식 카카오 단톡방 참여</span>
                </a>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-forest hover:bg-forest-dark text-white font-extrabold py-3.5 px-4 rounded-xl shadow-sm text-xs sm:text-sm cursor-pointer"
                >
                  확인 완료 (메인으로)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
