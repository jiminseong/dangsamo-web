import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-8">서비스 이용약관</h1>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제1조 (목적)</h2>
            <p>
              본 약관은 당사모(이하 "회사"라 함)가 제공하는 AI 과장광고 분석 서비스(이하 "서비스")의
              이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
              목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제2조 (약관의 효력 및 변경)</h2>
            <p>
              1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이
              발생합니다.
              <br />
              2. 회사는 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 약관이 변경된 경우에는
              지체 없이 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제3조 (서비스의 제공)</h2>
            <p>
              1. 회사는 회원에게 AI 기반의 텍스트/이미지 분석 서비스를 제공합니다.
              <br />
              2. 회사는 서비스의 안정적인 제공을 위해 노력하며, 유지보수 및 점검이 필요한 경우
              서비스 제공을 일시 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제4조 (이용요금 및 결제)</h2>
            <p>
              1. 서비스 내의 일부 기능은 유료로 제공될 수 있습니다.
              <br />
              2. 회원은 회사가 정한 결제 수단을 통하여 이용요금을 납부해야 합니다.
              <br />
              3. 결제와 관련된 구체적인 사항은 Polar 등 결제 대행사의 정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제5조 (면책조항)</h2>
            <p>
              1. 회사는 AI 분석 결과의 완전성이나 정확성을 보증하지 않습니다. 분석 결과는
              참고용으로만 활용되어야 합니다.
              <br />
              2. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
              경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">제6조 (준거법 및 재판관할)</h2>
            <p>
              본 약관에 명시되지 않은 사항은 대한민국의 관계법령에 따르며, 서비스 이용으로 발생한
              분쟁에 대해 소송이 제기되는 경우 서울중앙지방법원을 관할 법원으로 합니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
