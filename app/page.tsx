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
  <div className={`${showBorder ? 'border-b border-[#CED0D4]' : ''}`}>
    <button
      onClick={onCopy}
      className="w-full flex items-center justify-between py-3 px-4 hover:bg-[#F2F3F5] active:bg-[#E4E6EB] transition-colors duration-200 touch-manipulation relative overflow-hidden group"
    >
      <span className="text-sm font-semibold text-[#65676B]">{label}</span>
      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end overflow-hidden">
        <div className="relative w-full flex justify-end">
          <span
            className={`text-sm font-medium text-[#050505] truncate transition-all duration-200 ${
              isCopied ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
            }`}
          >
            {value || '---'}
          </span>
          <div
            className={`absolute right-0 flex items-center gap-1.5 transition-all duration-200 ${
              isCopied ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
            }`}
          >
            <Icon name="check" className="w-4 h-4 text-[#1877F2]" />
            <span className="text-sm font-semibold text-[#1877F2] whitespace-nowrap">已复制</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[#E4E6EB] opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-meta-fade-in">
      <div
        className="absolute inset-0 bg-white/80"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md bg-white rounded-lg shadow-meta-modal max-h-[80vh] flex flex-col animate-meta-slide-up"
        style={{
          boxShadow: '0 12px 28px 0 rgba(0,0,0,.2), 0 2px 4px 0 rgba(0,0,0,.1)'
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#CED0D4]">
          <h2 className="text-lg font-bold text-[#050505]">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-[#F2F3F5] active:bg-[#E4E6EB] rounded-full transition-colors duration-200 touch-manipulation"
          >
            <Icon name="close" className="w-5 h-5 text-[#65676B]" />
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
    className={`w-full flex items-center justify-between px-4 py-3 transition-all duration-200 touch-manipulation relative overflow-hidden group ${
      isSelected ? 'bg-[#E7F3FF]' : 'hover:bg-[#F2F3F5] active:bg-[#E4E6EB]'
    }`}
  >
    <span className={`text-sm transition-all duration-200 ${isSelected ? 'font-bold text-[#1877F2]' : 'font-normal text-[#050505]'}`}>
      {label}
    </span>
    {isSelected && (
      <Icon name="check" className="w-5 h-5 text-[#1877F2]" />
    )}
    <div className="absolute inset-0 bg-[#E4E6EB] opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
  </button>
));
ListItem.displayName = 'ListItem';

const CountryList = memo(({ countries, selectedCode, onSelect }: {
  countries: CountryConfig[];
  selectedCode: string;
  onSelect: (c: CountryConfig) => void;
}) => (
  <div className="divide-y divide-[#CED0D4]">
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
      <div className="p-4 border-b border-[#CED0D4] shrink-0">
        <div className="relative">
          <Icon name="search" className="w-5 h-5 text-[#8A8D91] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索域名"
            className="w-full pl-10 pr-4 py-2.5 bg-[#F0F2F5] rounded-full text-sm outline-none border border-transparent focus:border-[#1877F2] focus:bg-white transition-all duration-200 placeholder-[#8A8D91] text-[#050505]"
          />
        </div>
      </div>
      <div className="divide-y divide-[#CED0D4] overflow-y-auto flex-1">
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
          <div className="sticky bottom-0 bg-white border-t border-[#CED0D4] text-center py-3">
            <button
              onClick={() => setDisplayCount(prev => Math.min(prev + 50, filteredDomains.length))}
              className="text-[#1877F2] text-sm font-bold hover:underline touch-manipulation transition-all duration-200"
            >
              加载更多
            </button>
          </div>
        )}
        {filteredDomains.length === 0 && (
          <div className="text-center py-12 text-[#8A8D91] text-sm">
            无匹配结果
          </div>
        )}
      </div>
    </div>
  );
});
DomainList.displayName = 'DomainList';

export default function MetaStyleGenerator() {
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

  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopiedField(label);

    try {
      await navigator.clipboard.writeText(text);
      copyTimerRef.current = setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      console.error(e);
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
    }, 300);
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
    <div className="min-h-screen bg-[#F0F2F5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#CED0D4]" style={{ boxShadow: '0 2px 4px rgba(0,0,0,.1)' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold text-[#1877F2]">脸书小助手</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E7F3FF] rounded-full">
            <div className="w-2 h-2 rounded-full bg-[#42B72A] animate-meta-pulse" />
            <span className="text-xs font-semibold text-[#050505]">{ipInfo.ip}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4 space-y-3 relative z-10">
        {!isInitialized ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#E4E6EB] border-t-[#1877F2] rounded-full animate-meta-spin" />
          </div>
        ) : (
          <>
            {/* Info Card */}
            <div
              className={`bg-white rounded-lg transition-all duration-300 ${
                isGenerating ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'
              }`}
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, .1)' }}
            >
              <InfoRow label="姓氏" value={userInfo.lastName} onCopy={() => copyToClipboard(userInfo.lastName, '姓氏')} isCopied={copiedField === '姓氏'} />
              <InfoRow label="名字" value={userInfo.firstName} onCopy={() => copyToClipboard(userInfo.firstName, '名字')} isCopied={copiedField === '名字'} />
              <InfoRow label="生日" value={userInfo.birthday} onCopy={() => copyToClipboard(userInfo.birthday, '生日')} isCopied={copiedField === '生日'} />
              <InfoRow label="手机号" value={userInfo.phone} onCopy={() => copyToClipboard(userInfo.phone, '手机号')} isCopied={copiedField === '手机号'} />
              <InfoRow label="密码" value={userInfo.password} onCopy={() => copyToClipboard(userInfo.password, '密码')} isCopied={copiedField === '密码'} />

              <div className="p-4 space-y-3">
                <button
                  onClick={() => copyToClipboard(userInfo.email, '邮箱')}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-[#F2F3F5] active:bg-[#E4E6EB] rounded-md transition-colors duration-200 touch-manipulation relative overflow-hidden group"
                >
                  <span className="text-sm font-semibold text-[#65676B]">邮箱</span>
                  <div className="flex items-center gap-2 min-w-0 flex-1 justify-end overflow-hidden">
                    <div className="relative w-full flex justify-end">
                      <span
                        className={`text-sm font-medium text-[#050505] truncate transition-all duration-200 ${
                          copiedField === '邮箱' ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
                        }`}
                      >
                        {userInfo.email}
                      </span>
                      <div
                        className={`absolute right-0 flex items-center gap-1.5 transition-all duration-200 ${
                          copiedField === '邮箱' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
                        }`}
                      >
                        <Icon name="check" className="w-4 h-4 text-[#1877F2]" />
                        <span className="text-sm font-semibold text-[#1877F2] whitespace-nowrap">已复制</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[#E4E6EB] opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </button>

                <button
                  onClick={handleInboxClick}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E4E6EB] hover:bg-[#D8DADF] active:bg-[#CED0D4] rounded-md transition-all duration-200 touch-manipulation font-semibold text-sm text-[#050505]"
                >
                  <Icon name="inbox" className="w-4 h-4 text-[#050505]" />
                  <span>查看收件箱</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={isGenerating}
              className={`w-full py-3 bg-[#1877F2] hover:bg-[#166FE5] active:bg-[#1567D3] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation font-bold text-base text-white ${
                isGenerating ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, .1)' }}
            >
              <Icon name="refresh" className={`w-5 h-5 text-white transition-transform duration-500 ${
                isGenerating ? 'animate-meta-spin' : ''
              }`} />
              <span>{isGenerating ? '生成中...' : '生成新身份'}</span>
            </button>

            {/* Settings */}
            <div className="bg-white rounded-lg divide-y divide-[#CED0D4]" style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, .1)' }}>
              <button
                onClick={() => setShowCountryModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F2F3F5] active:bg-[#E4E6EB] transition-all duration-200 touch-manipulation relative overflow-hidden group first:rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon name="globe" className="w-5 h-5 text-[#65676B]" />
                  <span className="text-sm font-semibold text-[#050505]">地区</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#65676B] font-normal">{selectedCountry.name}</span>
                  <Icon name="chevronRight" className="w-5 h-5 text-[#8A8D91]" />
                </div>
                <div className="absolute inset-0 bg-[#E4E6EB] opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </button>

              <button
                onClick={() => setShowDomainModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#F2F3F5] active:bg-[#E4E6EB] transition-all duration-200 touch-manipulation relative overflow-hidden group last:rounded-b-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon name="inbox" className="w-5 h-5 text-[#65676B]" />
                  <span className="text-sm font-semibold text-[#050505]">邮箱域名</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#65676B] font-normal">{displayDomain}</span>
                  <Icon name="chevronRight" className="w-5 h-5 text-[#8A8D91]" />
                </div>
                <div className="absolute inset-0 bg-[#E4E6EB] opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </button>
            </div>

            {/* Footer */}
            <div className="text-center py-6 space-y-3">
              <a
                href="https://t.me/fang180"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-semibold text-[#1877F2] hover:underline transition-all duration-200"
              >
                加入 Telegram 频道
              </a>
              <p className="text-xs text-[#65676B]">
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
    </div>
  );
}
