# 당사모 (Dangsamo) - 과장광고 위험도 분석 서비스

소비자들이 현명한 쇼핑을 할 수 있도록 돕는, AI 기반 과장 광고 리스크 분석 플랫폼입니다.

## 1. 기획 의도
온라인 쇼핑몰, 특히 건강기능식품 시장에는 소비자를 현혹하는 과장 광고가 넘쳐납니다. 심지어, 유튜브에는 전문가인척 AI로 만든 영상이 넘쳐납니다. 일반 소비자가 상세페이지의 방대한 텍스트 속에 숨겨진 "위험 신호"를 일일이 찾아내기는 어렵습니다.  
본 서비스는 **"소비자를 보호하는 광고 리스크 점검 전문가"**라는 페르소나를 가진 AI를 활용하여, 사용자가 상품명이나 URL만 입력하면 즉시 과장 광고 위험도를 분석해줍니다.  
어렵고 딱딱한 법률 용어 대신, 누구나 이해하기 쉬운 설명으로 위험도 점수와 체크 포인트를 제공하여 소비자의 판단을 돕는 것이 핵심 목표입니다.
더 나아가, 소비자가 검증된 상품만을 구매할 수 있는 플랫폼이 되는 것이 목표입니다.

## 2. 시스템 아키텍처

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Interaction**: Framer Motion (애니메이션), Canvas Confetti (결제 성공 효과)
- **State Management**: React Query (TanStack Query) - *코드상 직접 보이진 않았으나 일반적인 패턴, 혹은 React Hooks로 처리*
- **Form Handling**: React Hook Form
- **OpenGraph**: Next.js `ImageResponse`를 활용한 동적 썸네일 생성

### Backend & Database
- **Platform**: Supabase
- **Database**: PostgreSQL (사용자 정보, 크레딧, 구매 이력, 분석 결과 공유 데이터 저장)
- **Authentication**: Supabase Auth
- **API**: Next.js Route Handlers (`/api/analyze`, `/api/checkout`, `/api/webhook` 등)

### AI
- **Model**: Google Gemini 2.0 Flash (`gemini-2.5-flash`)
- **Integration**: `@google/generative-ai` SDK 사용

### Payment
- **Provider**: Polar (polar.sh)
- **Method**: Checkout Link 방식

---

## 3. 프롬프트 엔지니어링 전략
정확하면서도 사용자 친화적인 결과를 얻기 위해, 다음과 같은 프롬프트 전략을 사용했습니다.

### 페르소나 (Persona) 설정
> "당신은 소비자를 보호하는 '광고 리스크 점검 전문가'입니다."

단순한 텍스트 요약이 아닌, **"전문가"**로서의 역할을 부여하여 분석의 신뢰도를 높였습니다.

### 출력 형식 제어 (JSON Enforcement)
AI의 응답을 그대로 보여주는 것이 아니라 프론트엔드에서 예쁘게 가공하기 위해, 철저하게 JSON 형식으로만 응답하도록 강제하였습니다.
```typescript
{
  "productName": "감지된 상품명",
  "riskScore": 0-100, // 정수형 점수
  "shortReasons": ["이유1", "이유2"] // UI에 바로 꽂을 수 있는 배열 형태
}
```

### 톤앤매너 (Tone & Manner)
> "모든 문구는 '귀엽고 단정한' 톤으로, 생활 밀착형 단어(리스크 점검, 체크, 확인 등)를 사용하세요."
> "'AI가 분석합니다' 같은 기계적인 표현은 피하세요."

사용자가 검사 결과에 거부감을 느끼지 않도록, 친근한 언어 사용을 지시했습니다.

### 이원화된 분석 로직
- **무료 분석**: 빠른 속도를 위해 간단한 점수와 1~2개의 이유만 생성.
- **유료(정밀) 분석**: `signals`(의심 신호), `implications`(소비자에게 미치는 영향), `nextActions`(행동 지침) 등 심층적인 필드를 추가로 요청.

---

## 4. 결제 로직 처리 (성공/실패)

결제 시스템은 **Polar**를 사용하여 안정적이고 간편하게 구현했습니다.

### 결제 흐름 (Flow)
1. **결제 요청**: 사용자가 크레딧 충전을 요청하면 `api/checkout` 엔드포인트가 호출됩니다.
   - 이때 `user_id`와 `email`을 메타데이터로 Polar에 전달하여 나중에 식별할 수 있게 합니다.
2. **Checkout 생성**: Polar API를 통해 일회성 결제 링크를 생성하고 반환합니다.
3. **사용자 결제**: 브라우저가 Polar의 결제 페이지로 이동합니다.

### 결제 성공 및 후속 처리 (Webhook)
결제 성공 시 **보안성**과 **데이터 무결성**을 위해 클라이언트가 아닌 **서버 간 통신(Webhook)**으로 크레딧을 지급합니다.

1. **Webhook 수신 (`api/webhook/polar`)**:
   - Polar 서버가 결제 완료(`checkout.updated` → `status: succeeded`) 이벤트를 보냅니다.
   - `webhook-signature`를 검증하여 위변조된 요청을 차단합니다.
2. **중복 처리 방지**:
   - `purchases` 테이블을 조회하여 이미 처리된 결제 ID(`provider_ref`)인지 확인합니다. (멱등성 보장)
3. **크레딧 지급 (트랜잭션)**:
   - `purchases` 테이블에 결제 이력을 기록합니다.
   - `credits` 테이블을 **Upsert** 방식으로 업데이트하여 사용자의 잔여 크레딧을 +10만큼 증가시킵니다.
4. **사용자 리다이렉트**:
   - 결제를 마친 사용자는 `/billing/return` 페이지로 돌아와 "결제 완료" 메시지와 폭죽 효과를 보게 됩니다.

## 5. 주요 기능
- **AI 과장광고 분석**: 상품명/URL 입력 시 Gemini가 실시간 분석
- **결과 공유하기**: 분석 결과를 동적 OpenGraph 이미지로 생성하여 카카오톡/SNS 공유 시 예쁜 미리보기 제공
- **크레딧 시스템**: 심층 분석을 위한 부분 유료화 모델 적용
