"use client";

import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

export default function AddressGenerator() {
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.status === 'ok') {
        setAddress(data.address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoCard = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-xs text-gray-500 mb-1.5 font-medium">{label}</div>
      <div className="flex items-start md:items-center justify-between gap-2">
        <div className="text-sm text-gray-900 font-medium break-words flex-1 leading-relaxed">{value}</div>
        <button
          onClick={() => copyToClipboard(value, field)}
          className="flex-shrink-0 p-2 md:p-1.5 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
        >
          {copiedField === field ? (
            <Check className="w-4 h-4 md:w-4 md:h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 md:w-4 md:h-4 text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 md:p-4 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12 px-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 md:mb-3 tracking-tight">
            美国地址生成器
          </h1>
          <p className="text-base md:text-lg text-gray-600">生成随机美国地址信息</p>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-6 md:mb-8 px-2">
          <button
            onClick={fetchAddress}
            disabled={loading}
            className="w-full max-w-xs md:w-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full font-medium text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '生成中...' : '生成新地址'}
          </button>
        </div>

        {/* Address Information */}
        {address && (
          <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 px-2">
            {/* Personal Information */}
            <section className="bg-white/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl border border-gray-200">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-6">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <InfoCard label="姓名" value={address.Full_Name} field="name" />
                <InfoCard label="性别" value={address.Gender} field="gender" />
                <InfoCard label="生日" value={address.Birthday} field="birthday" />
                <InfoCard label="电话" value={address.Telephone} field="phone" />
                <InfoCard label="邮箱" value={address.Temporary_mail} field="email" />
                <InfoCard label="密码" value={address.Password} field="password" />
              </div>
            </section>
          </div>
        )}

        {/* Empty State */}
        {!address && !loading && (
          <div className="text-center py-12 md:py-16 px-4">
            <div className="text-gray-400 mb-4">
              <svg className="w-20 h-20 md:w-24 md:h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-lg md:text-xl text-gray-500">点击上方按钮生成地址</p>
          </div>
        )}
      </div>
    </div>
  );
}