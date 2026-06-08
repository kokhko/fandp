/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { NavTab, GalleryItem, Registration } from './types';
import { INITIAL_GALLERY_ITEMS } from './data';

// Components
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Guide from './components/Guide';
import Gallery from './components/Gallery';
import Carousel from './components/Carousel';
import JoinModal from './components/JoinModal';
import SurveyView from './components/SurveyView';

// Lucide icons
import { 
  Tent, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Heart, 
  UserCheck, 
  Flame, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  Check, 
  X, 
  UserX,
  AlertCircle,
  Lock,
  Music,
  Pause,
  Play,
  Square,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState<'local' | 'fallback'>('fallback');
  const [audioVolume, setAudioVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Sync play/pause state of the HTMLAudioElement
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          setIsPlaying(false);
          console.log('Autoplay restriction: User gesture required to initiate audio.', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audioSource]);

  // Sync volume level and mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : audioVolume;
  }, [audioVolume, isMuted]);

  // Handle standard user gesture listener to automatically start playback
  useEffect(() => {
    const handleGesture = () => {
      setIsPlaying(true);
      // Immediately clean up event listeners to avoid redundant calls
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('mousedown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('mousedown', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('keydown', handleGesture);

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('mousedown', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, []);

  const handleToggleBgm = () => {
    setIsPlaying(prev => !prev);
  };

  const handleStopBgm = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  // Registration list state (mocking local persistence)
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  
  // Gallery items state (mocking base64 image persistence and like updates)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Admin portal authentication states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');

  // Admin filter state
  const [adminFilter, setAdminFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Load persistence and seed initial registrations
  useEffect(() => {
    const savedRegs = localStorage.getItem('fp_registrations');
    if (savedRegs) {
      setRegistrations(JSON.parse(savedRegs));
    } else {
      const initialRegs: Registration[] = [
        {
          id: 'seed-1',
          name: '윤기영',
          department: 'F&P 본사 기획팀',
          phoneNumber: '010-1234-5678',
          experience: 'intermediate',
          createdAt: '2026-05-10',
          status: 'approved'
        },
        {
          id: 'seed-2',
          name: '최선임',
          department: 'F&P 기계기술부',
          phoneNumber: '010-9876-5432',
          experience: 'expert',
          createdAt: '2026-05-20',
          status: 'approved'
        },
        {
          id: 'seed-3',
          name: '김건설',
          department: 'F&P 본사 기획팀',
          phoneNumber: '010-2444-1111',
          experience: 'beginner',
          createdAt: '2026-05-15',
          status: 'approved'
        },
        {
          id: 'seed-4',
          name: '박안전',
          department: 'F&P 건설안전실',
          phoneNumber: '010-5555-6666',
          experience: 'expert',
          createdAt: '2026-05-24',
          status: 'approved'
        }
      ];
      setRegistrations(initialRegs);
      localStorage.setItem('fp_registrations', JSON.stringify(initialRegs));
    }

    const savedGallery = localStorage.getItem('fp_gallery_items');
    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    } else {
      setGalleryItems(INITIAL_GALLERY_ITEMS);
      localStorage.setItem('fp_gallery_items', JSON.stringify(INITIAL_GALLERY_ITEMS));
    }
  }, []);

  const handleNewRegistration = (newReg: Registration) => {
    const regWithStatus = {
      ...newReg,
      status: newReg.status || 'pending'
    };
    setRegistrations(prev => {
      const updated = [...prev.filter(r => r.id !== regWithStatus.id), regWithStatus];
      localStorage.setItem('fp_registrations', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateRegistrationStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setRegistrations(prev => {
      const updated = prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg);
      localStorage.setItem('fp_registrations', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNewGalleryItem = (newItem: GalleryItem) => {
    setGalleryItems(prev => {
      // If it exists in state already (like update trigger), replace it; otherwise prepend.
      const index = prev.findIndex(item => item.id === newItem.id);
      let updated;
      if (index !== -1) {
        updated = [...prev];
        updated[index] = newItem;
      } else {
        updated = [newItem, ...prev];
      }
      localStorage.setItem('fp_gallery_items', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-sand text-stone-800 font-sans selection:bg-forest selection:text-white">
      {/* Dynamic Header Navbar */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openJoinModal={() => setIsJoinModalOpen(true)} 
      />

      {/* Main Routed Body */}
      {activeTab === 'home' && (
        <div className="animate-fade-in animate-duration-300">
          {/* Majestic Hero Cover */}
          <Hero 
            onCtaClick={() => setIsJoinModalOpen(true)} 
            registeredCount={registrations.length}
          />

          {/* YouTube Video Section */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 p-2 sm:p-3">
              <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src="https://www.youtube.com/embed/vrfdAJb650M"
                  title="F&P 아웃도어 백패킹 가이드 동영상"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                ></iframe>
              </div>
              <div className="p-3 sm:px-6 text-center">
                <p className="text-stone-300 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>동호회 활동 생생한 현장 스케치 영상 감상하기</span>
                </p>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-forest tracking-tight">
                왜 "F&P"와 백패킹인가요?
              </h2>
              <div className="h-1.5 w-16 bg-wood mx-auto rounded-full" />
              <p className="text-stone-600 font-bold text-sm sm:text-base leading-relaxed">
                가까운 경주 바닷가 풍경부터 해발 1000m의 고지대 침장 힐링까지,<br className="hidden sm:block"/>
                안전을 중점으로 설계된 정직하고 유쾌한 동호회 스케줄을 제공합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature Item 1 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-wood/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 text-forest rounded-xl w-fit">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-stone-900 font-display">1초 영원 가성비 장비 컨설팅</h3>
                  <p className="text-stone-600 text-sm font-semibold leading-relaxed">
                    초보자들이 가장 흔히 저지르는 수백만 원단위의 불필요한 이중 투자를 막아드립니다. 
                    동호회 내 선배들이 보유한 배낭과 매트를 직접 등판 핏팅하며 가장 경제적인 조합을 제안합니다.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('guide')}
                  className="mt-6 text-xs font-bold text-forest hover:text-forest-dark flex items-center space-x-1 cursor-pointer self-start transition-colors"
                >
                  <span>가이드 및 큐레이션 보기 &rarr;</span>
                </button>
              </div>

              {/* Feature Item 2 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-wood/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 text-wood rounded-xl w-fit">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-stone-900 font-display">체력 맞춤형 코스 배정</h3>
                  <p className="text-stone-600 text-sm font-semibold leading-relaxed">
                    주중 건설 현장의 피로도를 감안하여, 금요일 퇴근 후 바로 피칭할 수 있는 
                    근교 소나무 숲 야영장(예: 오류캠핑장 등)부터 주말 가벼운 산악 하이킹 코스까지 단계별 트립을 운영합니다.
                  </p>
                </div>
                <button 
                  onClick={() => setIsJoinModalOpen(true)}
                  className="mt-6 text-xs font-bold text-wood hover:text-wood-dark flex items-center space-x-1 cursor-pointer self-start transition-colors"
                >
                  <span>지금 F&P 가입 세우기 &rarr;</span>
                </button>
              </div>

              {/* Feature Item 3 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-wood/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-55 text-blue-900 rounded-xl w-fit bg-blue-50">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-stone-900 font-display">F&P다운 '안심 안전'</h3>
                  <p className="text-stone-600 text-sm font-semibold leading-relaxed">
                    철저한 LNT 쓰레기 제로 정책, 수색 안전거리 준수, 고지대 저체온 예방 매뉴얼 작동. 
                    안전을 최우선으로 여기는 한수원의 건설 문화에 걸맞게 단 한 건의 안전사고 없이 하이킹을 성사시킵니다.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('guide')}
                  className="mt-6 text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center space-x-1 cursor-pointer self-start transition-colors"
                >
                  <span>안전 방침 매뉴얼 정독 &rarr;</span>
                </button>
              </div>

            </div>
          </section>

          {/* Testimonial / Story Card Grid */}
          <section className="bg-sand/10 py-16 border-t border-b border-wood/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">회원님들의 리얼 한 줄 스냅스토리</h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-bold">먼저 백패킹을 접하고 떠나본 F&P 회원들의 솔직한 보이스입니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Story Card 1 */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm border border-wood/20 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-forest/10 rounded-full flex items-center justify-center text-forest font-black font-mono">
                      Y2
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-850 text-sm sm:text-base">윤기영 선임</h4>
                      <p className="text-[10px] sm:text-xs text-[#8b5a2b] font-mono font-bold">F&P 본사 기획팀</p>
                    </div>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm font-bold leading-relaxed italic">
                    "주말 마다 캠핑 짐 카트에 가득 싣던 테트리스 지옥에서 승리했습니다. 
                    배낭 하나에 모든 집을 수납하여 어깨에 메는 직관적인 Folding & Packing을 마주하니, 
                    자유도가 백배는 상승했네요. 강력 추천합니다!"
                  </p>
                </div>

                {/* Story Card 2 */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-sm border border-wood/20 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-wood/10 rounded-full flex items-center justify-center text-wood font-black font-mono">
                      C1
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-850 text-sm sm:text-base">최선임 회원</h4>
                      <p className="text-[10px] sm:text-xs text-[#8b5a2b] font-mono font-bold">F&P 기계기술부</p>
                    </div>
                  </div>
                  <p className="text-stone-600 text-xs sm:text-sm font-bold leading-relaxed italic">
                    "아코디언 UI 가이드를 보고 중복투자가 확실히 영개화됐습니다. 
                    산 속에서 텐트 하나 가볍게 피치하고 오류캠핑장 시원한 동해 바닷바람 소리를 맞이하는 
                    순간의 여운은 백패킹을 해본 자만이 논할 수 있습니다. 가입도 너무 쉽고 편해요."
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Automatic Rolling Carousel Section */}
          <Carousel 
            items={galleryItems} 
            onViewAllClick={() => setActiveTab('gallery')} 
          />
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="animate-fade-in">
          <Guide />
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="animate-fade-in">
          <Gallery 
            items={galleryItems} 
            onAddItem={handleNewGalleryItem} 
            openJoinModal={() => setIsJoinModalOpen(true)}
            registrations={registrations}
          />
        </div>
      )}

      {activeTab === 'survey' && (
        <div className="animate-fade-in">
          <SurveyView />
        </div>
      )}

      {activeTab === 'admin' && (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[75vh] flex flex-col justify-center">
          {!isAdminLoggedIn ? (
            /* Admin Password Prompt card with nature backdrop border styling */
            <div className="max-w-md w-full mx-auto bg-[#faf9f6] rounded-2xl p-8 border border-[#e5e5db] shadow-xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-stone-900 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-display font-black text-2xl text-stone-900 tracking-tight">F&P 관리 데스크 로그인</h3>
                <p className="text-xs text-stone-500 font-bold">임직원 가입 승인 및 회원 권한 관리를 위한 전문 패널입니다.</p>
              </div>

              {adminLoginError && (
                <div className="flex items-start space-x-2 bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-200 text-xs font-bold">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                setAdminLoginError('');
                
                if (adminId.trim() === 'admin' && adminPw === 'admin123') {
                  setIsAdminLoggedIn(true);
                  setAdminId('');
                  setAdminPw('');
                } else {
                  setAdminLoginError('아이디 또는 비밀번호가 올바르지 않습니다. (대소문자 확인)');
                }
              }} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">관리자 아이디 (Admin ID)</label>
                  <input
                    type="text"
                    placeholder="아이디 입력 (admin)"
                    value={adminId}
                    onChange={(e) => { setAdminId(e.target.value); setAdminLoginError(''); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-xs bg-white font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">비밀번호 (Password)</label>
                  <input
                    type="password"
                    placeholder="비밀번호 입력 (admin123)"
                    value={adminPw}
                    onChange={(e) => { setAdminPw(e.target.value); setAdminLoginError(''); }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-forest text-xs bg-white font-bold text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-forest hover:bg-forest-dark text-white font-black py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer text-xs uppercase tracking-wider"
                >
                  로그인하기 (인증 요청)
                </button>
              </form>

              <div className="bg-[#f3f2eb] p-4 rounded-xl border border-[#e5e5db] text-[11px] leading-relaxed text-stone-605 text-stone-600 space-y-1 font-bold">
                <p className="text-stone-850 font-black text-xs">💡 실시간 체험 테스트 계정 안내</p>
                <div className="mt-1 font-mono space-y-0.5 text-stone-700 font-semibold">
                  <p>• 아이디: <strong className="text-forest bg-forest/5 px-1 py-0.5 rounded text-xs select-all font-mono">admin</strong></p>
                  <p>• 비밀번호: <strong className="text-forest bg-forest/5 px-1 py-0.5 rounded text-xs select-all font-mono">admin123</strong></p>
                </div>
              </div>
            </div>
          ) : (
            /* Logged In Admin Workspace Panel */
            <div className="w-full bg-zinc-900 text-white rounded-2xl p-6 sm:p-10 border border-zinc-805 border-zinc-800 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-zinc-800 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    <h3 className="font-display font-black text-2xl text-white tracking-tight">F&P 최종 관리자 승인 포털</h3>
                  </div>
                  <p className="text-xs text-zinc-450 text-zinc-400 font-bold">임직원 가입 신청 건에 대한 가입 심사 및 실시간 카카오톡/SMS 자동 승인 문자 발송 권한을 관리합니다.</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setAdminFilter('all');
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all self-start md:self-center border border-zinc-700 cursor-pointer"
                >
                  로그아웃 (나가기)
                </button>
              </div>

              {/* Grid of basic stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-850 p-4 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 font-bold block">전체 가입자</span>
                  <p className="text-2xl font-black text-white font-mono mt-1">{registrations.length}명</p>
                </div>
                <div className="bg-zinc-850 p-4 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 font-bold block">대기 중인 건</span>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {registrations.filter(r => r.status === 'pending' || !r.status).length}건
                  </p>
                </div>
                <div className="bg-zinc-850 p-4 rounded-xl border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-400 font-bold block">승인 완료된 건</span>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {registrations.filter(r => r.status === 'approved').length}건
                  </p>
                </div>
              </div>

              {/* Main Admin Desk List */}
              <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-850 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-850">
                  <h4 className="font-extrabold text-xs text-zinc-350">신청 명단 가입 심사</h4>
                  
                  {/* Filter tabs */}
                  <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px] font-bold">
                    <button 
                      onClick={() => setAdminFilter('all')}
                      className={`px-2.5 py-1 rounded transition-colors ${adminFilter === 'all' ? 'bg-forest text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
                    >
                      전체 ({registrations.length})
                    </button>
                    <button 
                      onClick={() => setAdminFilter('pending')}
                      className={`px-2.5 py-1 rounded transition-colors ${adminFilter === 'pending' ? 'bg-amber-500 text-stone-950 font-black' : 'text-zinc-500 hover:text-zinc-200'}`}
                    >
                      대기 ({registrations.filter(r => r.status === 'pending' || !r.status).length})
                    </button>
                    <button 
                      onClick={() => setAdminFilter('approved')}
                      className={`px-2.5 py-1 rounded transition-colors ${adminFilter === 'approved' ? 'bg-emerald-400 text-stone-950 font-black' : 'text-zinc-500 hover:text-zinc-200'}`}
                    >
                      승인 ({registrations.filter(r => r.status === 'approved').length})
                    </button>
                  </div>
                </div>

                {/* List Container */}
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {registrations
                    .filter(reg => {
                      if (adminFilter === 'all') return true;
                      if (adminFilter === 'pending') return reg.status === 'pending' || !reg.status;
                      if (adminFilter === 'approved') return reg.status === 'approved';
                      if (adminFilter === 'rejected') return reg.status === 'rejected';
                      return true;
                    })
                    .sort((a, b) => b.id.localeCompare(a.id))
                    .map((reg) => {
                      const isPending = reg.status === 'pending' || !reg.status;
                      const isApproved = reg.status === 'approved';
                      const isRejected = reg.status === 'rejected';

                      return (
                        <div 
                          key={reg.id} 
                          className="bg-zinc-900/60 hover:bg-zinc-850/80 p-4 rounded-xl border border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all"
                        >
                          <div className="space-y-1 text-left">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-sm text-white font-mono">{reg.name}</span>
                              <span className="text-[10px] font-bold text-zinc-400 font-mono">({reg.phoneNumber})</span>
                              
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                reg.experience === 'expert' ? 'bg-purple-900/45 text-purple-300' : 
                                reg.experience === 'intermediate' ? 'bg-blue-900/45 text-blue-300' : 
                                'bg-zinc-700/60 text-zinc-300'
                              }`}>
                                {reg.experience === 'expert' ? '고수' : reg.experience === 'intermediate' ? '중급' : '백린이'}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-semibold">{reg.department} • 가입신청일: {reg.createdAt}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0 font-bold">
                            {isPending && (
                              <>
                                <span className="text-[10px] font-black px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1 animate-pulse">
                                  <Clock className="h-3 w-3" />
                                  <span>승인 대기</span>
                                </span>
                                <button
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'approved')}
                                  className="bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer shadow hover:scale-[1.03] active:scale-95"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>승인</span>
                                </button>
                                <button
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'rejected')}
                                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-extrabold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer hover:scale-[1.03] active:scale-95"
                                >
                                  <span>반려</span>
                                </button>
                              </>
                            )}

                            {isApproved && (
                              <span className="text-[10px] font-black px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1 font-mono">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                <span>정회원 승인완료 (SNS 자동전송 완료)</span>
                              </span>
                            )}

                            {isRejected && (
                              <span className="text-[10px] font-black px-2 py-1 rounded bg-red-950/40 text-red-400 border border-red-900/30 flex items-center space-x-1 font-mono">
                                <X className="h-3.5 w-3.5 text-red-400" />
                                <span>승인반려됨</span>
                                <button
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'approved')}
                                  className="ml-2 bg-[#2c1d1d] hover:bg-[#3d2525] text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-semibold"
                                >
                                  재확인 후 승인
                                </button>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {registrations.filter(reg => {
                    if (adminFilter === 'all') return true;
                    if (adminFilter === 'pending') return reg.status === 'pending' || !reg.status;
                    if (adminFilter === 'approved') return reg.status === 'approved';
                    return true;
                  }).length === 0 && (
                    <div className="p-10 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 font-bold text-xs">
                      선택한 조건에 부합하는 가입 신청 내역이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Styled Earthy Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 px-4 shadow-sm border-t border-stone-900 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="space-y-3.5">
            <div className="flex justify-center md:justify-start items-center space-x-2">
              <Tent className="h-5 w-5 text-sand" />
              <span className="font-display font-bold text-white tracking-widest uppercase">Folding & Packing</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
              우리는 자연을 향한 정직한 예의(LNT)를 중요시하며, 아웃도어 환경에서 
              동료와 자신의 몸을 가장 안전하게 지키고 힐러하는 한수원 임직원 백패킹 컬처입니다.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-white tracking-wide uppercase block">안심 산림 가이드 링크</span>
            <div className="flex flex-col space-y-1.5 text-xs text-stone-500">
              <span className="hover:text-sand cursor-pointer transition-colors" onClick={() => setActiveTab('guide')}>경량 최적 아코디언 장비 리스트</span>
              <span className="hover:text-sand cursor-pointer transition-colors" onClick={() => setActiveTab('guide')}>야외 비상 수칙 매뉴얼</span>
              <span className="hover:text-sand cursor-pointer transition-colors" onClick={() => setActiveTab('gallery')}>캠핑 사진 아카이브 피드</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-white tracking-wide uppercase block">KHNP F&P 소통 허브</span>
            <p className="text-xs text-stone-500 leading-relaxed">
              본사 소재지: 경상북도 경주시 문무대왕면 불국로 1655 / 한국수력원자력 F&P 대표 동호회<br />
              © 2026 F&P Folding and Packing Group. All rights reserved. Registered for KHNP Family.
            </p>
          </div>

        </div>

        {/* Dynamic BGM interactive player bar with local file playback + CC fallback */}
        <audio
          ref={audioRef}
          src={audioSource === 'local' ? '/assets/bgm.mp3' : 'https://www.soundjay.com/free-music/sounds/ambient-mellow-01.mp3'}
          loop
          preload="auto"
          onError={() => {
            if (audioSource === 'local') {
              console.warn('Local assets/bgm.mp3 not found, switching to CC Forest ambient soundscapes.');
              setAudioSource('fallback');
            }
          }}
        />
        <div className="mt-10 pt-8 border-t border-stone-900 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Track and animation info */}
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-full transition-all duration-300 ${isPlaying ? 'bg-wood/20 text-wood animate-pulse shadow-md' : 'bg-stone-900 text-stone-500'}`}>
              <Music className={`h-5 w-5 ${isPlaying ? 'rotate-12 duration-500' : ''}`} />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <span>F&P 자연 치유 배경음악 (BGM)</span>
                {isPlaying && (
                  <span className="flex space-x-1.5 items-end h-3 ml-2">
                    <span className="bg-wood w-0.5 h-1.5 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="bg-wood w-0.5 h-3 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    <span className="bg-wood w-0.5 h-2 animate-bounce" style={{ animationDelay: '0.5s' }}></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {audioSource === 'local' 
                  ? '동호회 업로드 오디오 재생 (bgm.mp3)' 
                  : '감성 자연사운드: 울릉도 소나무 숲 동해 바다 숲의 아침 소리'}
              </p>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 bg-stone-900/60 p-2 px-4 rounded-xl sm:rounded-full border border-stone-800">
            {/* Play/Pause toggle button */}
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-full cursor-pointer transition-all duration-200 outline-none ${
                isPlaying 
                  ? 'bg-wood hover:bg-wood-dark text-white scale-105 shadow-md shadow-wood/20' 
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-750 hover:text-white'
              }`}
              title={isPlaying ? "음악 일시정지" : "음악 재생"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5 fill-current" />}
            </button>

            {/* Stop button */}
            <button
              onClick={handleStopBgm}
              className="p-2 rounded-full cursor-pointer bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-white transition-all outline-none"
              title="음악 완전 정지"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>

            {/* Divider */}
            <span className="h-4 w-px bg-stone-800 hidden sm:inline"></span>

            {/* Mute and Unmute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded hover:bg-stone-850 text-stone-400 hover:text-white transition-colors cursor-pointer outline-none"
              title={isMuted ? "소리 켜기" : "소리 끄기"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-stone-300" />}
            </button>

            {/* volume range slider slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioVolume}
              onChange={(e) => {
                setAudioVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-wood outline-none focus:ring-1 focus:ring-wood"
              title="배경음악 볼륨 조절"
            />

            {/* Source switch */}
            <div className="flex items-center space-x-1.5 pl-1.5 border-l border-stone-800">
              <span className="text-[9px] text-stone-600 font-bold hidden sm:inline">음악소스:</span>
              <select
                value={audioSource}
                onChange={(e) => setAudioSource(e.target.value as 'local' | 'fallback')}
                className="bg-stone-950 text-stone-400 text-[10px] font-bold py-1 px-2 rounded border border-stone-800 focus:outline-none focus:border-wood"
                title="음악 선택"
              >
                <option value="local">bgm.mp3 (수동 업로드)</option>
                <option value="fallback">자연의 숲 & 파도소리 (추천)</option>
              </select>
            </div>
          </div>

          <div className="text-[10px] text-stone-600 text-center md:text-right leading-tight select-none">
            ※ 브라우저 정책에 따라, 홈페이지 접속 후<br /> 아무 데나 클릭하시면 감동적인 배경음악이 시작됩니다.
          </div>
        </div>
      </footer>

      {/* Global Signup Form Trigger */}
      <JoinModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
        onSuccess={handleNewRegistration}
      />
    </div>
  );
}
