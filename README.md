# dangsamo-web (당사모: 당하기 싫은 사람들의 모임)

고가 상품 구매 전, 과장광고 위험 신호를 AI로 분석해주는 "광고 리스크 점검" 서비스입니다.

## 핵심 기능
- **요약 점검 (무료)**: 하루 최대 3회, 상품명/URL에 대한 빠른 리스크 요약.
- **상세 점검 (유료)**: 크레딧 1회 차감, 구체적 의심 신호와 우려 사항, 권장 행동 분석.
- **결제**: Polar Sandbox를 통한 10회 이용권(1,000원) 결제.

## 기술 스택
- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Backend**: Supabase (Postgres + Auth), Next.js API Routes
- **AI**: Google Gemini 1.5 Flash (무료) / Pro (유료)
- **Payments**: Polar (Sandbox)

## 환경 변수 설정 (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Polar Payments (Sandbox)
POLAR_ACCESS_TOKEN=your_polar_pat
POLAR_WEBHOOK_SECRET=your_polar_webhook_secret
NEXT_PUBLIC_POLAR_PRODUCT_ID=your_polar_product_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=your_ga4_id (선택)
```

## 설치 및 실행

1. 의존성 설치:
   ```bash
   bun install
   ```
2. 로컬 서버 실행:
   ```bash
   bun dev
   ```

## 주요 설정 가이드

### 1. Supabase 설정
- **Auth**: Google Provider 활성화 (Google Cloud Console에서 Client ID/Secret 발급 필요).
- **Database**: 제공된 SQL 스키마를 Supabase SQL Editor에서 실행.
- **Redirect URI**: `https://[PROJECT_ID].supabase.co/auth/v1/callback`

### 2. Polar 설정
- **Sandbox 모드**: [Polar.sh](https://polar.sh)에서 Sandbox 활성화.
- **Product**: 1,000원 상당의 '당사모 10회 이용권' 생성.
- **Webhook**: `api/webhook/polar` 경로로 `checkout.updated` 이벤트 수신 설정.

## 테스트 시나리오
1. **로그인**: 메인 페이지에서 "Google로 시작하기" 클릭.
2. **무료 분석**: 상품명 입력 후 "요약 점검" 클릭 (일 3회 제한 확인).
3. **결제**: 크레딧이 0일 때 나타나는 "10회 이용권" 버튼 클릭 -> Polar Sandbox 결제 진행.
4. **상세 분석**: 결제 완료 후 자동 충전된 크레딧으로 "상세 점검" 클릭.
5. **공유**: 결과 페이지 하단의 "결과 공유하기" 클릭하여 링크 복사 확인.

## 데이터 트래킹 (GA4)
- `input_submit`: 분석 시작 시 (TODO)
- `analysis_complete`: 분석 완료 시
- `paywall_click`: 결제 버튼 클릭 시 (TODO)
- `payment_success`: 결제 완료 페이지 방문 시
- `share_click`: 공유 버튼 클릭 시
