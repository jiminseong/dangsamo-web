import { toast } from "sonner";

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export const shareContent = async (options: ShareOptions) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const data = {
    title: options.title || "당사모",
    text: options.text || "과장광고 없는 깨끗한 쇼핑!",
    url: options.url || window.location.href,
    files: options.files,
  };

  try {
    if (isMobile && navigator.share && navigator.canShare && navigator.canShare(data)) {
      await navigator.share(data);
    } else {
      // 데스크톱이거나 공유 API 미지원 시 클립보드 복사
      // 파일이 있는 경우(이미지 공유)는 다운로드 처리
      if (options.files && options.files.length > 0) {
        const file = options.files[0];
        const link = document.createElement("a");
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success("이미지가 저장되었습니다.");
      } else {
        await navigator.clipboard.writeText(data.url);
        toast.success("링크가 복사되었습니다.");
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("공유 실패:", error);
      toast.error("공유하기에 실패했습니다.");
    }
  }
};
