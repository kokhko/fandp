import React, { useState, useRef } from 'react';
import { GalleryItem, Registration } from '../types';
import { Image, Upload, Search, ShieldCheck, HelpCircle, Heart, CheckCircle, Flame, Plus, X, FolderLock } from 'lucide-react';

interface GalleryProps {
  items: GalleryItem[];
  onAddItem: (newItem: GalleryItem) => void;
  openJoinModal: () => void;
  registrations?: Registration[];
}

export default function Gallery({ items, onAddItem, openJoinModal, registrations = [] }: GalleryProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [division, setDivision] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [formError, setFormError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filteredItems = items.filter(item => {
    // Search query matches
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.division.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'public') return item.isPublic;
    if (activeFilter === 'private') return !item.isPublic;
    return true;
  });

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('이미지 파일(*.png, *.jpg, *.jpeg, *.webp)만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
        setFormError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !author.trim() || !division.trim()) {
      setFormError('모든 필드값을 채워주세요.');
      return;
    }

    // Verify if the author is a registered and approved member!
    const trimmedAuthor = author.trim();
    const registeredUser = registrations.find(r => r.name.toLowerCase() === trimmedAuthor.toLowerCase());
    
    if (!registeredUser) {
      setFormError(`게시물 등록 실패: '${trimmedAuthor}' 이름으로 가입된 회원 정보를 찾을 수 없습니다. 메인 화면 하단에서 회원가입 완료 후 관리자 승인을 획득해 주세요.`);
      return;
    }

    if (registeredUser.status !== 'approved') {
      setFormError(`게시물 등록 실패: '${trimmedAuthor}' 회원님은 현재 승인 대기 상태(또는 반려)입니다. 메인 화면 하단의 '최종 관리자 승인 데스크'에서 [승인] 버튼을 먼저 클릭한 뒤 다시 시도해 주세요.`);
      return;
    }

    if (!imagePreview) {
      setFormError('사진을 등록해 주세요. 드래그 앤 드롭 또는 수동 첨부가 가능합니다.');
      return;
    }

    const newItem: GalleryItem = {
      id: String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      division: division.trim(),
      imageUrl: imagePreview,
      isPublic: isPublic,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1 // Default start point
    };

    onAddItem(newItem);

    // Reset Form
    setTitle('');
    setDescription('');
    setAuthor('');
    setDivision('');
    setImagePreview(null);
    setIsPublic(true);
    setFormError('');
    setIsUploading(false);
  };

  const handleLike = (id: string) => {
    // In-memory like helper via window.localStorage modification mapping
    const existing = JSON.parse(localStorage.getItem('fp_custom_likes') || '{}');
    if (existing[id]) return; // already liked
    existing[id] = true;
    localStorage.setItem('fp_custom_likes', JSON.stringify(existing));
    
    // Find item and increment in code too (we can mutate safety copy triggers)
    onAddItem({ ...items.find(i => i.id === id)!, likes: (items.find(i => i.id === id)?.likes || 0) + 1 });
  };

  return (
    <div className="bg-sand/10 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-zinc-800 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 -translate-y-8 translate-x-8 opacity-10 blur-sm pointer-events-none text-white">
            <Image className="h-72 w-72" />
          </div>
          <div className="relative z-10 space-y-2 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">추억 보관소 (<span className="text-forest">F&P Gallery</span>)</h2>
            <p className="text-sm text-zinc-300 leading-relaxed font-semibold">
              맑은 바람의 기운을 담았던 F&P 회원님들의 힐링 아웃도어 전경입니다.<br className="hidden sm:block" />
              가입하신 모든 회원들의 개별 스마트폰 사진을 LNT를 준수하며 안전하게 게재 및 업로드할 수 있습니다.
            </p>
          </div>
          <div className="relative z-10 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsUploading(!isUploading)}
              className="flex items-center space-x-1.5 bg-forest hover:bg-forest-light text-white font-extrabold px-6 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer transform hover:scale-[1.02] duration-300"
            >
              {isUploading ? <X className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
              <span>{isUploading ? "업로드 창 밀봉" : "소중한 추억 주입 (사진 등록)"}</span>
            </button>
          </div>
        </div>

        {/* Upload Form Expansion Box */}
        {isUploading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-md border border-wood/25 mb-8 animate-fade-in">
            <h3 className="font-extrabold text-lg text-forest mb-4 flex items-center space-x-2 border-b border-wood/10 pb-3">
              <Upload className="h-5 w-5 text-forest" />
              <span>새로운 백패킹 추억 업로드</span>
            </h3>

            {formError && (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-xl border border-red-200 text-xs sm:text-sm mb-4 font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer min-h-[220px] ${
                    dragOver 
                      ? 'border-forest bg-forest/5' 
                      : 'border-wood/30 hover:border-forest hover:bg-forest/5'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-full max-h-[200px] overflow-hidden rounded-xl">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                        className="absolute right-2 top-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/90 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-3.5 bg-sand/20 rounded-full inline-block text-[#8b5a2b]">
                        <Upload className="h-7 w-7 animate-bounce" />
                      </div>
                      <p className="text-sm font-bold text-stone-700">여기에 캠핑 사진을 끌어다 놓으세요</p>
                      <p className="text-xs text-stone-500 font-bold">또는 가볍게 클릭하여 기기 폴더 탐색</p>
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">올린이 성명</label>
                      <input 
                        type="text" 
                        placeholder="김건설"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-wood/20 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-forest text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">소속 부서</label>
                      <input 
                        type="text" 
                        placeholder="건설기술부 선임회원"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-wood/20 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-forest text-stone-900"
                      />
                    </div>
                  </div>

                  {/* Approved members quick check & select list */}
                  <div className="bg-[#faf9f6] p-3.5 rounded-xl border border-zinc-200 text-xs text-stone-600 font-semibold space-y-2.5">
                    <p className="text-[11px] text-zinc-650 font-extrabold flex items-center space-x-1.5">
                      <ShieldCheck className="h-4.5 w-4.5 text-forest" />
                      <span>F&P 정회원 전용 업로드 인증 데스크</span>
                    </p>
                    {registrations.filter(r => r.status === 'approved').length > 0 ? (
                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-450 font-bold block">승인 완료된 회원 명단 (클릭 시 자동 입력):</span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {registrations.filter(r => r.status === 'approved').map(r => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => {
                                setAuthor(r.name);
                                setDivision(r.department);
                              }}
                              className="bg-forest/10 hover:bg-forest/20 text-forest text-[11px] px-2.5 py-1 rounded-full border border-forest/20 transition-all font-bold hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center space-x-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                              <span>{r.name} ({r.department.split(' ')[0] || r.department})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-red-600 font-bold leading-normal">
                        현재 승인완료된 정회원이 존재하지 않습니다. 메인 화면 하단 회원가입 신청 양식에서 가입 후 '최종 관리자 승인 데스크'에서 승인 처리를 완료해 주세요.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">스냅백 사진 제목</label>
                    <input 
                      type="text" 
                      placeholder="예: 오류캠핑장 오션뷰 썬라이즈 피칭 완료"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-wood/20 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">스토리 및 비화 설명</label>
                    <textarea 
                      rows={3}
                      placeholder="백패킹 당시 즐거웠던 에피소드나 숨겨진 텐트 조망 장소를 공유해 주세요."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 rounded-xl border border-wood/20 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest resize-none"
                    />
                  </div>

                  {/* Public Toggle Checkbox */}
                  <div className="flex items-center space-x-2.5 bg-sand/50 border border-wood/20 p-3.5 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="isPublicCheckbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="h-4.5 w-4.5 rounded text-forest focus:ring-forest border-wood/30 cursor-pointer"
                    />
                    <label htmlFor="isPublicCheckbox" className="text-xs text-stone-700 font-bold cursor-pointer">
                      <span>사진 전체 공유하기</span>{' '}
                      <span className="text-[10px] text-[#8b5a2b] font-semibold">(체크 해제 시 로그인된 F&P 정회원 전용 피드로만 표시됩니다)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Submit */}
              <div className="flex justify-end pt-3 border-t border-wood/10 text-sm">
                <button
                  type="submit"
                  className="bg-forest hover:bg-forest-dark text-white font-extrabold py-3.5 px-7 rounded-xl shadow-md active:scale-97 transition-all cursor-pointer"
                >
                  캠핑 추억 완벽 기록 완료
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search toolbar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-5 shadow-sm border border-wood/20 mb-7 flex flex-col md:flex-row gap-4 justify-between items-center text-sm">
          {/* Tab lists */}
          <div className="flex bg-sand p-1.5 rounded-xl w-full md:w-auto shrink-0 border border-wood/10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm ${
                activeFilter === 'all' 
                  ? 'bg-white text-forest shadow-md' 
                  : 'text-stone-500 hover:text-forest'
              }`}
            >
              전체 보기
            </button>
            <button
              onClick={() => setActiveFilter('public')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm flex items-center justify-center space-x-1 ${
                activeFilter === 'public' 
                  ? 'bg-white text-forest shadow-md' 
                  : 'text-stone-500 hover:text-forest'
              }`}
            >
              <Flame className="h-4 w-4" />
              <span>전체 공유 [{items.filter(i => i.isPublic).length}]</span>
            </button>
            <button
              onClick={() => setActiveFilter('private')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-bold transition-all text-xs sm:text-sm flex items-center justify-center space-x-1 ${
                activeFilter === 'private' 
                  ? 'bg-white text-wood shadow-md' 
                  : 'text-stone-500 hover:text-wood'
              }`}
            >
              <FolderLock className="h-3.5 w-3.5" />
              <span>회원 전용 [{items.filter(i => !i.isPublic).length}]</span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-forest" />
            <input
              type="text"
              placeholder="스팟 명칭, 올린 사람, 부서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-wood/20 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-forest text-xs sm:text-sm bg-gray-50/50"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item: GalleryItem) => {
              const itemLikeKey = `fp_liked_${item.id}`;
              return (
                <div 
                  key={item.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm border border-wood/15 flex flex-col justify-between group hover:shadow-xl hover:border-wood/35 transition-all duration-300"
                >
                  {/* Card media wrapper */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-stone-150">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Public vs Private Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {item.isPublic ? (
                        <span className="bg-forest/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                          <Flame className="h-3 w-3 text-sand" />
                          <span>전체 공유</span>
                        </span>
                      ) : (
                        <span className="bg-wood/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                          <FolderLock className="h-3 w-3 text-sand" />
                          <span>회원 전용</span>
                        </span>
                      )}
                    </div>

                    {/* Date badge */}
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] px-2.5 py-1 rounded-full">
                      {item.createdAt}
                    </span>
                  </div>

                  {/* Context of the post */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-wood tracking-wide font-mono uppercase bg-sand/20 px-2 py-0.5 rounded">
                          {item.division}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          {item.author} 회원
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug group-hover:text-forest transition-colors font-display">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-bold leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Reactions & Access restrictions */}
                    <div className="flex items-center justify-between border-t border-wood/10 pt-3 text-sm">
                      <button 
                        onClick={() => handleLike(item.id)}
                        className="inline-flex items-center space-x-1 text-stone-500 hover:text-red-500 transition-colors cursor-pointer group/like"
                      >
                        <Heart className="h-4.5 w-4.5 text-stone-300 group-hover/like:text-red-500 group-hover/like:scale-110 active:scale-95 transition-all fill-transparent group-hover/like:fill-red-500" />
                        <span className="text-xs font-extrabold font-mono text-stone-700">{item.likes}</span>
                      </button>

                      {!item.isPublic && (
                        <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-forest bg-forest/10 px-2.5 py-1.5 rounded-lg border border-forest/20">
                          <ShieldCheck className="h-3.5 w-3.5 text-forest" />
                          <span>회원 가입 완료 전용</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 text-center border border-wood/20 space-y-3.5">
            <div className="inline-flex items-center justify-center p-4 bg-sand/15 text-[#8b5a2b] rounded-full">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-stone-700 font-bold text-lg">해당 필터에 부합하는 게시글이 존재하지 않습니다.</p>
            <p className="text-sm text-stone-500 font-semibold">다른 검색어로 다시 탐색을 하시거나, 직접 소중한 캠프 레코드를 등재해 보세요.</p>
          </div>
        )}

      </div>
    </div>
  );
}
