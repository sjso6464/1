import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Meta/Facebook 官方色彩系统
        'meta-blue': {
          DEFAULT: '#1877F2',
          hover: '#166FE5',
          active: '#1567D3',
          light: '#E7F3FF',
        },
        'meta-text': {
          primary: '#050505',
          secondary: '#65676B',
          tertiary: '#8A8D91',
          placeholder: '#BCC0C4',
        },
        'meta-bg': {
          primary: '#FFFFFF',
          secondary: '#F0F2F5',
          hover: '#F2F3F5',
          active: '#E4E6EB',
          wash: '#F5F6F7',
        },
        'meta-border': {
          primary: '#CED0D4',
          secondary: '#E4E6EB',
        },
        'meta-green': '#42B72A',
        'meta-red': '#F02849',
        'meta-yellow': '#FFB800',
      },
      fontFamily: {
        // Meta 官方字体栈
        'meta': ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Meta 标准字体尺寸
        'meta-xs': ['12px', { lineHeight: '16px' }],
        'meta-sm': ['13px', { lineHeight: '16px' }],
        'meta-base': ['15px', { lineHeight: '20px' }],
        'meta-lg': ['17px', { lineHeight: '20px' }],
        'meta-xl': ['20px', { lineHeight: '24px' }],
        'meta-2xl': ['24px', { lineHeight: '28px' }],
        'meta-3xl': ['28px', { lineHeight: '32px' }],
      },
      borderRadius: {
        // Meta 标准圆角
        'meta-sm': '4px',
        'meta': '6px',
        'meta-md': '8px',
        'meta-lg': '12px',
        'meta-full': '9999px',
      },
      boxShadow: {
        // Meta 标准阴影
        'meta-1': '0 1px 2px rgba(0, 0, 0, .1)',
        'meta-2': '0 2px 4px rgba(0, 0, 0, .1)',
        'meta-3': '0 4px 8px rgba(0, 0, 0, .1)',
        'meta-modal': '0 12px 28px 0 rgba(0,0,0,.2), 0 2px 4px 0 rgba(0,0,0,.1)',
        'meta-card': '0 1px 2px rgba(0, 0, 0, .1)',
      },
      animation: {
        // Meta 标准动画
        'meta-fade-in': 'meta-fade-in 300ms cubic-bezier(0.08, 0.52, 0.52, 1)',
        'meta-slide-up': 'meta-slide-up 300ms cubic-bezier(0.08, 0.52, 0.52, 1)',
        'meta-spin': 'meta-spin 800ms linear infinite',
        'meta-pulse': 'meta-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'meta-fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'meta-slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px) scale(0.95)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'meta-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'meta-pulse': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.7',
            transform: 'scale(0.95)',
          },
        },
      },
      transitionTimingFunction: {
        // Meta 标准缓动函数
        'meta': 'cubic-bezier(0.08, 0.52, 0.52, 1)',
      },
      spacing: {
        // Meta 8px 间距系统
        '4.5': '1.125rem', // 18px
        '13': '3.25rem',   // 52px
        '15': '3.75rem',   // 60px
      },
    },
  },
  plugins: [],
};

export default config;
