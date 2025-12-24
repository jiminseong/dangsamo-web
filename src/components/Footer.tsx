export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-16 text-slate-400">
      <div className="max-w-7xl  mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm shadow-sm">
                당
              </div>
              <span className="text-xl font-bold text-white tracking-tight">당사모</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              당하기 싫은 사람들의 모임. <br />
              현명한 소비자를 위한 AI 과장광고 분석 서비스입니다. <br />
              우리는 데이터로 허위 정보와 과장 마케팅을 걸러냅니다.
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                문의 및 제보
              </span>
              <a
                href="mailto:support@dangsamo.ai"
                className="text-white font-semibold text-sm hover:underline"
              >
                support@dangsamo.ai
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                분석 도구
              </h4>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>요약 점검</li>
                <li>상세 위험 분석</li>
                <li>성분 교차 검증</li>
                <li>가격 거품 감사</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                서비스
              </h4>
              <ul className="text-slate-400 space-y-2 text-sm">
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>광고 제보하기</li>
                <li>공지사항</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-800">
          <p className="text-xs text-slate-500 font-medium">© 2025 당사모. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400">시스템 정상</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
