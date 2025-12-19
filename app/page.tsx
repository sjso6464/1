'use client';

import { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { countries, CountryConfig } from '@/lib/countryData';
import {
  generateName,
  generateBirthday,
  generatePhone,
  generatePassword,
  generateEmail,
  getCountryConfig,
  getAllDomains
} from '@/lib/generator';

interface UserInfo {
  firstName: string;
  lastName: string;
  birthday: string;
  phone: string;
  password: string;
  email: string;
}

const ICON_PATHS: Record<string, React.ReactElement> = {
  check: <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>,
  chevronRight: <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>,
  close: <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>,
  refresh: <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>,
  search: <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>,
  inbox: <path d="M19 3H4.99c-1.11 0-1.98.89-1.98 2L3 19c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H4.99V5H19v10z"/>,
  copy: <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>,
  globe: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
};

const Icon = memo(({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">{ICON_PATHS[name]}</svg>
));
Icon.displayName = 'Icon';

const InfoRow = memo(({ label, value, onCopy, isCopied, showBorder = true }: {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied: boolean;
  showBorder?: boolean;
}) => (
  <div className={`${showBorder ? 'border-b border-gray-200' : ''}`}>
    <button
      onClick={onCopy}
      className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-50 transition-colors duration-150 touch-manipulation"
    >
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end overflow-hidden">
        <div className="relative w-full flex justify-end">
          <span 
            className={`text-sm font-medium text-gray-900 truncate transition-all duration-150 ${
              isCopied ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {value || '---'}
          </span>
          <div 
            className={`absolute right-0 flex items-center gap-1.5 transition-all duration-150 ${
              isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <Icon name="check" className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600 whitespace-nowrap">已复制</span>
          </div>
        </div>
      </div>
    </button>
  </div>
));
InfoRow.displayName = 'InfoRow';

const Modal = memo(({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] animate-fb-fade-in" 
        onClick={onClose} 
      />
      <div 
        className="relative w-full max-w-md bg-white/95 backdrop-blur-[2px] rounded-xl shadow-2xl max-h-[80vh] flex flex-col animate-fb-scale-fade"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150 touch-manipulation"
          >
            <Icon name="close" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
});
Modal.displayName = 'Modal';

const ListItem = memo(({ label, isSelected, onClick }: { 
  label: string; 
  isSelected: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-150 touch-manipulation ${
      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
  >
    <span className={`text-sm transition-all duration-150 ${isSelected ? 'font-semibold text-blue-600' : 'text-gray-900'}`}>
      {label}
    </span>
    {isSelected && (
      <Icon name="check" className="w-5 h-5 text-blue-600" />
    )}
  </button>
));
ListItem.displayName = 'ListItem';

const CountryList = memo(({ countries, selectedCode, onSelect }: { 
  countries: CountryConfig[]; 
  selectedCode: string; 
  onSelect: (c: CountryConfig) => void;
}) => (
  <div className="divide-y divide-gray-200">
    {countries.map((country) => (
      <ListItem 
        key={country.code}
        label={country.name} 
        isSelected={selectedCode === country.code} 
        onClick={() => onSelect(country)} 
      />
    ))}
  </div>
));
CountryList.displayName = 'CountryList';

const DomainList = memo(({ allDomains, selectedDomain, onSelect }: { 
  allDomains: string[]; 
  selectedDomain: string; 
  onSelect: (d: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(50);
  
  const filteredDomains = useMemo(() => {
    if (!searchQuery) return allDomains;
    return allDomains.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allDomains, searchQuery]);

  const displayedDomains = useMemo(() => {
    return filteredDomains.slice(0, displayCount);
  }, [filteredDomains, displayCount]);

  useEffect(() => {
    setDisplayCount(50);
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 shrink-0">
        <div className="relative">
          <Icon name="search" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="搜索域名" 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:bg-gray-200 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150" 
          />
        </div>
      </div>
      <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
        {!searchQuery && (
          <ListItem 
            label="随机域名" 
            isSelected={selectedDomain === 'random'} 
            onClick={() => onSelect('random')} 
          />
        )}
        {displayedDomains.map((domain) => (
          <ListItem 
            key={domain}
            label={domain} 
            isSelected={selectedDomain === domain} 
            onClick={() => onSelect(domain)} 
          />
        ))}
        {displayCount < filteredDomains.length && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 text-center py-3">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 50, filteredDomains.length))}
              className="text-blue-600 text-sm font-semibold hover:text-blue-700 touch-manipulation transition-all duration-150"
            >
              加载更多
            </button>
          </div>
        )}
        {filteredDomains.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            无匹配结果
          </div>
        )}
      </div>
    </div>
  );
});
DomainList.displayName = 'DomainList';

export default function FacebookStyleGenerator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(countries[0]);
  const [selectedDomain, setSelectedDomain] = useState<string>('random');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '', lastName: '', birthday: '', phone: '', password: '', email: ''
  });
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [ipInfo, setIpInfo] = useState({ ip: '...', country: 'US' });
  const [isInitialized, setIsInitialized] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);
  
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    // 立即显示反馈，不等待复制完成
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopiedField(label);
    
    try {
      await navigator.clipboard.writeText(text);
      copyTimerRef.current = setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error(e);
      // 如果复制失败，仍然显示反馈但快速消失
      copyTimerRef.current = setTimeout(() => setCopiedField(null), 1000);
    }
  }, []);

  const generate = useCallback(() => {
    setIsGenerating(true);
    setCopiedField(null);
    
    setTimeout(() => {
      try {
        const { firstName, lastName } = generateName(selectedCountry.code);
        const birthday = generateBirthday();
        const phone = generatePhone(selectedCountry);
        const password = generatePassword();
        const customDomain = selectedDomain === 'random' ? undefined : selectedDomain;
        const email = generateEmail(firstName, lastName, customDomain);
        setUserInfo({ firstName, lastName, birthday, phone, password, email });
      } catch (error) { 
        console.error(error); 
      }
      setIsGenerating(false);
    }, 250);
  }, [selectedCountry, selectedDomain]);
  
  const handleInboxClick = useCallback(() => {
    const emailName = userInfo.email.split('@')[0];
    window.open(`https://yopmail.net/?login=${emailName}`, '_blank');
  }, [userInfo.email]);

  useEffect(() => {
    let isMounted = true;
    const initializeApp = async () => {
      try {
        const response = await fetch('/api/ip-info');
        const data = await response.json();
        if (!isMounted) return;
        setIpInfo({ ip: data.ip || '未知', country: data.country || 'US' });
        if (data.country && data.accurate) {
          const detectedCountry = getCountryConfig(data.country);
          if (detectedCountry) setSelectedCountry(detectedCountry);
        }
        setIsInitialized(true);
      } catch (error) { 
        if (isMounted) { 
          setIpInfo({ ip: '检测失败', country: 'US' }); 
          setIsInitialized(true); 
        } 
      }
    };
    initializeApp();
    return () => { isMounted = false; };
  }, []);

  // 预加载背景图片
  useEffect(() => {
    const img = new Image();
    img.src = 'https://www.loliapi.com/acg/';
    img.onload = () => setBgLoaded(true);
    img.onerror = () => setBgLoaded(true); // 加载失败也显示，避免一直等待
  }, []);

  useEffect(() => {
    if (isInitialized && !userInfo.firstName) {
      generate();
    }
  }, [isInitialized, userInfo.firstName, generate]);

  useEffect(() => {
    if (isInitialized && userInfo.firstName) generate();
  }, [selectedCountry.code]);

  const allDomains = useMemo(() => getAllDomains(), []);
  const displayDomain = selectedDomain === 'random' ? '随机' : selectedDomain;

  const handleCountrySelect = useCallback((country: CountryConfig) => {
    setSelectedCountry(country); 
    setShowCountryModal(false);
  }, []);

  const handleDomainSelect = useCallback((domain: string) => {
    setSelectedDomain(domain);
    setShowDomainModal(false);
    
    // 如果已经生成了邮箱，只更换后缀
    if (userInfo.email) {
      const emailPrefix = userInfo.email.split('@')[0];
      const customDomain = domain === 'random' ? undefined : domain;
      const newEmail = customDomain 
        ? `${emailPrefix}@${customDomain}`
        : generateEmail(userInfo.firstName, userInfo.lastName);
      
      setUserInfo(prev => ({ ...prev, email: newEmail }));
    }
  }, [userInfo.email, userInfo.firstName, userInfo.lastName]);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* 背景图片 */}
      <div 
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          bgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(https://www.loliapi.com/acg/)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold text-blue-600">脸书小助手</h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-fb-pulse" />
            <span className="text-xs font-medium text-gray-600">{ipInfo.ip}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-4 relative z-10">
        {!isInitialized ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-fb-spin" />
          </div>
        ) : (
          <>
            {/* Info Card */}
            <div className={`bg-white/90 backdrop-blur-[2px] rounded-lg shadow-lg transition-all duration-250 ${
              isGenerating ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'
            }`}>
              <InfoRow label="姓氏" value={userInfo.lastName} onCopy={() => copyToClipboard(userInfo.lastName, '姓氏')} isCopied={copiedField === '姓氏'} />
              <InfoRow label="名字" value={userInfo.firstName} onCopy={() => copyToClipboard(userInfo.firstName, '名字')} isCopied={copiedField === '名字'} />
              <InfoRow label="生日" value={userInfo.birthday} onCopy={() => copyToClipboard(userInfo.birthday, '生日')} isCopied={copiedField === '生日'} />
              <InfoRow label="手机号" value={userInfo.phone} onCopy={() => copyToClipboard(userInfo.phone, '手机号')} isCopied={copiedField === '手机号'} />
              <InfoRow label="密码" value={userInfo.password} onCopy={() => copyToClipboard(userInfo.password, '密码')} isCopied={copiedField === '密码'} />
              
              <div className="p-4 space-y-3">
                <button
                  onClick={() => copyToClipboard(userInfo.email, '邮箱')}
                  className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded transition-colors duration-150 touch-manipulation"
                >
                  <span className="text-sm font-semibold text-gray-500">邮箱</span>
                  <div className="flex items-center gap-2 min-w-0 flex-1 justify-end overflow-hidden">
                    <div className="relative w-full flex justify-end">
                      <span 
                        className={`text-sm font-medium text-gray-900 truncate transition-all duration-150 ${
                          copiedField === '邮箱' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                      >
                        {userInfo.email}
                      </span>
                      <div 
                        className={`absolute right-0 flex items-center gap-1.5 transition-all duration-150 ${
                          copiedField === '邮箱' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                      >
                        <Icon name="check" className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600 whitespace-nowrap">已复制</span>
                      </div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleInboxClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-150 touch-manipulation"
                >
                  <Icon name="inbox" className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-semibold text-gray-700">查看收件箱</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={isGenerating}
              className={`w-full py-3 bg-blue-600/90 backdrop-blur-[2px] hover:bg-blue-700 rounded-lg shadow-lg transition-all duration-150 flex items-center justify-center gap-2 touch-manipulation ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Icon name="refresh" className={`w-5 h-5 text-white transition-transform duration-600 ${
                isGenerating ? 'animate-fb-spin' : ''
              }`} />
              <span className="text-base font-semibold text-white">
                {isGenerating ? '生成中...' : '生成新身份'}
              </span>
            </button>

            {/* Settings */}
            <div className="bg-white/90 backdrop-blur-[2px] rounded-lg shadow-lg divide-y divide-gray-200">
              <button
                onClick={() => setShowCountryModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-150 touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <Icon name="globe" className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">地区</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedCountry.name}</span>
                  <Icon name="chevronRight" className="w-5 h-5 text-gray-400" />
                </div>
              </button>
              
              <button
                onClick={() => setShowDomainModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-150 touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <Icon name="inbox" className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">邮箱域名</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{displayDomain}</span>
                  <Icon name="chevronRight" className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center py-6 space-y-3">
              <a 
                href="https://t.me/fang180" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-150"
              >
                加入 Telegram 频道
              </a>
              <p className="text-xs text-gray-500">
                支持 {countries.length} 个国家 • {allDomains.length} 个域名
              </p>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <Modal isOpen={showCountryModal} onClose={() => setShowCountryModal(false)} title="选择地区">
        <CountryList countries={countries} selectedCode={selectedCountry.code} onSelect={handleCountrySelect} />
      </Modal>

      <Modal isOpen={showDomainModal} onClose={() => setShowDomainModal(false)} title="选择域名">
        <DomainList allDomains={allDomains} selectedDomain={selectedDomain} onSelect={handleDomainSelect} />
      </Modal>

      <style jsx global>{`
        /* Facebook 官方字体系统 - 完整版 */
        
        /* 全局字体设置 - 完全匹配 Facebook */
        * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 
                       'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        body {
          /* Facebook 在不同平台的字体优先级 */
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                       'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 
                       'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 
                       'Noto Color Emoji';
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Facebook 字重系统（精确匹配） */
        .font-normal {
          font-weight: 400;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .font-semibold {
          font-weight: 600;
        }
        
        .font-bold {
          font-weight: 700;
        }
        
        /* Facebook 文字尺寸系统 */
        .text-xs {
          font-size: 12px;
          line-height: 16px;
        }
        
        .text-sm {
          font-size: 13px;
          line-height: 16px;
        }
        
        .text-base {
          font-size: 15px;
          line-height: 20px;
        }
        
        .text-lg {
          font-size: 17px;
          line-height: 20px;
        }
        
        .text-xl {
          font-size: 20px;
          line-height: 24px;
        }
        
        /* Facebook 颜色系统 */
        :root {
          --fb-blue: #1877f2;
          --fb-blue-hover: #166fe5;
          --fb-blue-active: #0a5dcb;
          --fb-text-primary: #050505;
          --fb-text-secondary: #65676b;
          --fb-text-tertiary: #8a8d91;
          --fb-border: #ced0d4;
          --fb-background: #f0f2f5;
          --fb-background-hover: #e4e6eb;
        }
        
        /* 优化的动画 - 专为移动端优化 */
        
        /* 淡入动画 - 150ms（更快） */
        @keyframes fb-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* 缩放淡入 - 150ms */
        @keyframes fb-scale-fade {
          from { 
            opacity: 0;
            transform: scale(0.96);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* 旋转动画 - 匀速 */
        @keyframes fb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* 脉冲动画 - 慢速 */
        @keyframes fb-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .animate-fb-fade-in {
          animation: fb-fade-in 150ms ease-out;
        }
        
        .animate-fb-scale-fade {
          animation: fb-scale-fade 150ms cubic-bezier(0.08, 0.52, 0.52, 1);
        }
        
        .animate-fb-spin {
          animation: fb-spin 600ms linear infinite;
        }
        
        .animate-fb-pulse {
          animation: fb-pulse 2s ease-in-out infinite;
        }
        
        /* 优化的过渡时长 */
        .duration-150 {
          transition-duration: 150ms;
        }
        
        .duration-200 {
          transition-duration: 200ms;
        }
        
        .duration-250 {
          transition-duration: 250ms;
        }
        
        .duration-600 {
          transition-duration: 600ms;
        }
        
        /* 移动端点击优化 */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* 硬件加速 */
        button {
          will-change: transform;
          transform: translateZ(0);
        }
      `}</style>
    </div>
  );
}