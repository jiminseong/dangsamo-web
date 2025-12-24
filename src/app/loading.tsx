export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-900 animate-pulse">잠시만 기다려주세요</h3>
        <p className="text-sm text-slate-400">안전하게 페이지를 불러오고 있습니다...</p>
      </div>
    </div>
  );
}
