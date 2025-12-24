import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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

        <h1 className="text-2xl font-bold text-slate-900 mb-8">개인정보처리방침</h1>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">1. 개인정보의 처리 목적</h2>
            <p>
              당사모(이하 '서비스')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는
              개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는
              「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
              예정입니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>서비스 제공 및 관리 (분석 결과 저장, 결제 내역 관리 등)</li>
              <li>회원 가입 및 관리</li>
              <li>마케팅 및 광고에의 활용 (선택 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">2. 처리하는 개인정보의 항목</h2>
            <p>서비스는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>필수항목:</strong> 이메일, 이름(닉네임), 프로필 사진, 결제 기록
              </li>
              <li>
                <strong>수집방법:</strong> 소셜 로그인(Google), 서비스 이용 과정에서 생성
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">3. 개인정보의 파기</h2>
            <p>
              서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을
              때에는 지체 없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">4. 개인정보 보호책임자</h2>
            <p>
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
              정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고
              있습니다.
            </p>
            <div className="mt-2 bg-slate-50 p-4 rounded-lg">
              <p>
                <strong>이메일:</strong> iamjms4237@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">5. 변경 및 고지</h2>
            <p>
              이 개인정보처리방침은 2024년 12월 24일부터 적용됩니다. 법령 및 방침에 따른 변경내용의
              추가, 삭제 및 정정이 있는 경우에는 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
