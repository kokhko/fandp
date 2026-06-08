import React, { useState } from 'react';
import { NavTab } from '../types';
import { Tent, Menu, X, UserPlus, Compass, BookOpen, Image, Lock } from 'lucide-react';

interface NavigationProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openJoinModal: () => void;
}

export default function Navigation({ activeTab, setActiveTab, openJoinModal }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavTab, label: '메인의 숲', icon: Compass },
    { id: 'guide' as NavTab, label: '백패킹 가이드', icon: BookOpen },
    { id: 'gallery' as NavTab, label: '추억 보관소', icon: Image },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/45 backdrop-blur-md text-forest border-b border-wood/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-forest rounded-lg flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200">
              <Tent className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-tight text-forest block">F&P Group</span>
              <span className="text-[9px] text-wood font-bold tracking-widest font-mono block -mt-1 uppercase">Folding & Packing</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-forest text-white shadow-md'
                      : 'text-forest hover:bg-forest/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all duration-205 border cursor-pointer hover:scale-102 active:scale-98 ${
                activeTab === 'admin'
                  ? 'bg-stone-900 border-stone-900 text-white shadow-md font-black animate-pulse'
                  : 'text-stone-750 hover:text-stone-900 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>관리자 로그인</span>
            </button>

            <button
              onClick={openJoinModal}
              className="flex items-center space-x-1.5 bg-forest hover:bg-forest-dark text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-sand" />
              <span>F&P와 함께 떠나기 (즉시 가입)</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-forest hover:text-white hover:bg-forest focus:outline-none cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">메뉴 열기</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-wood/10 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-base font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-forest text-white'
                      : 'text-forest hover:bg-forest/5'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-4 pb-2 px-3 space-y-2.5">
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setIsOpen(false);
                }}
                className={`flex items-center justify-center space-x-2 w-full font-bold py-3 px-4 rounded-xl border transition-all ${
                  activeTab === 'admin'
                    ? 'bg-stone-905 bg-stone-900 border-stone-900 text-white'
                    : 'bg-zinc-50 border-zinc-200 text-stone-800'
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>관리자 로그인 포털</span>
              </button>

              <button
                onClick={() => {
                  openJoinModal();
                  setIsOpen(false);
                }}
                className="flex items-center justify-center space-x-2 w-full bg-forest text-white font-bold py-3.5 px-4 rounded-xl shadow-md active:scale-98 cursor-pointer"
              >
                <UserPlus className="h-5 w-5 text-sand animate-pulse" />
                <span>F&P 즉시 가입하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
