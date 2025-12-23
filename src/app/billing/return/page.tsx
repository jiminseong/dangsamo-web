import Link from "next/link";

import { redirect } from "next/navigation";

export default async function BillingReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout_id?: string }>;
}) {
  const { checkout_id } = await searchParams;

  if (!checkout_id) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="card-cute w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">결제가 완료되었습니다!</h1>
        <p className="text-zinc-600 mb-8">
          이제 상세 점검 크레딧이 충전되었습니다. <br />더 꼼꼼하게 리스크를 확인해보세요.
        </p>
        <Link href="/" className="btn-primary w-full">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
