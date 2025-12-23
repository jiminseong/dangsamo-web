"use client";

import { AuthButton } from "./AuthButton";
import { Share2, Menu, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크가 복사되었습니다!");
  };

  const handleReset = () => {
    window.location.reload();
  };

  const menuItems = [
    { name: "예시보기", href: "#examples" },
    { name: "주요기능", href: "#features" },
    { name: "가격감사", href: "#price-audit" },
  ];

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-[880px] mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            당
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">당사모</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {item.name}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500"
            title="공유하기"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500"
            title="초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <AuthButton />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <AuthButton />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg md:hidden p-4 space-y-2"
          >
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="w-full text-left px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {item.name}
              </button>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
              <button 
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 py-3 hover:bg-slate-50 rounded-xl text-slate-600 text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
