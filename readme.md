# 🏢 사내 비품 관리 시스템 (Internal Equipment Management System)

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.12-brightgreen?logo=spring-boot)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

사내 비품의 효율적인 관리 및 신청을 위한 풀스택 웹 애플리케이션

[주요 기능](#-주요-기능) • [기술 스택](#️-기술-스택) • [시작하기](#-시작하기) • [API 문서](#-api-문서)

</div>

---

## 📋 목차

- [주요 기능](#-주요-기능)
- [기술 스택](#️-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
  - [사전 요구사항](#사전-요구사항)
  - [설치](#설치)
  - [환경 변수 설정](#환경-변수-설정)
  - [실행](#실행)
- [API 문서](#-api-문서)
- [주요 화면](#-주요-화면)
- [배포](#-배포)
- [라이센스](#-라이센스)

---

## ✨ 주요 기능

### 👤 사용자 기능

- **회원가입/로그인**: JWT 기반 인증 시스템
- **비품 조회**: 카테고리별 비품 목록 및 상세 정보 확인
- **비품 신청**: 장바구니 기능을 통한 다중 비품 신청
- **신청 내역 관리**: 신청 상태(대기/승인/반려) 확인 및 추적
- **다국어 지원**: 한국어/일본어 자동 감지 및 전환

### 🔧 관리자 기능

- **비품 관리**: 비품 등록, 수정, 삭제 및 재고 관리
- **이미지 업로드**: AWS S3를 통한 비품 이미지 관리
- **신청 관리**: 비품 신청 승인/반려 및 사유 기록
- **실시간 통계**: 처리 대기/승인/반려 건수 대시보드

### 🌐 공통 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- **실시간 재고 확인**: 재고 부족/품절 시각적 표시
- **가상화 리스트**: 대량 데이터 최적화 렌더링
- **자동 토큰 갱신**: Refresh Token을 통한 세션 유지

---

## 🛠️ 기술 스택

### Backend

| 기술            | 버전    | 용도              |
| --------------- | ------- | ----------------- |
| Spring Boot     | 3.4.12  | 백엔드 프레임워크 |
| Java            | 17      | 프로그래밍 언어   |
| Spring Security | -       | 인증/인가         |
| JWT             | 0.12.3  | 토큰 기반 인증    |
| Spring Data JPA | -       | ORM               |
| MariaDB/MySQL   | -       | 데이터베이스      |
| AWS S3          | 2.20.26 | 파일 저장소       |
| Swagger         | 2.2.0   | API 문서화        |

### Frontend

| 기술           | 버전    | 용도            |
| -------------- | ------- | --------------- |
| React          | 19.2.0  | UI 라이브러리   |
| TypeScript     | 5.9.3   | 타입 안정성     |
| Vite           | 7.2.4   | 빌드 도구       |
| TailwindCSS    | 4.1.17  | 스타일링        |
| React Router   | 7.9.6   | 라우팅          |
| Zustand        | 5.0.9   | 전역 상태 관리  |
| TanStack Query | 5.90.12 | 서버 상태 관리  |
| Axios          | 1.13.2  | HTTP 클라이언트 |
| i18next        | 25.7.1  | 다국어 지원     |
| React Virtuoso | 4.17.0  | 가상화 리스트   |

---

## 📁 프로젝트 구조

```
equip-request/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/backend/
│   │   ├── config/            # 설정 파일 (Security, CORS, S3)
│   │   ├── controller/        # REST API 컨트롤러
│   │   ├── domain/            # JPA 엔티티
│   │   ├── repository/        # JPA 리포지토리
│   │   ├── service/           # 비즈니스 로직
│   │   └── util/              # 유틸리티 (JWT, S3)
│   └── src/main/resources/
│       ├── application.yml    # 메인 설정
│       └── application-*.yml  # 프로파일별 설정
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── common/            # 공통 컴포넌트 (Loading, etc)
│   │   ├── components/        # UI 컴포넌트 (shadcn/ui)
│   │   ├── pages/             # 페이지 컴포넌트
│   │   │   ├── auth/          # 로그인/회원가입
│   │   │   ├── equipment/     # 비품 목록/상세
│   │   │   ├── cart/          # 장바구니
│   │   │   ├── request/       # 신청 내역
│   │   │   └── admin/         # 관리자 페이지
│   │   ├── stores/            # Zustand 스토어
│   │   ├── lib/               # 라이브러리 (API, i18n)
│   │   ├── locales/           # 다국어 번역 파일
│   │   └── types/             # TypeScript 타입 정의
│   └── public/                # 정적 파일
│
└── README.md                   # 프로젝트 문서
```

---

## 🚀 시작하기

### 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Java 17** 이상
- **Node.js 18** 이상
- **npm** 또는 **yarn**
- **MariaDB** 또는 **MySQL** 8.0 이상
- **AWS 계정** (S3 사용 시)

### 설치

#### 1. 저장소 클론

```bash
git clone https://github.com/akh820/equip-request.git
cd equip-request
```

#### 2. 백엔드 설정

```bash
cd backend

# Gradle 의존성 다운로드
./gradlew build
```

#### 3. 프론트엔드 설정

```bash
cd frontend

# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정

#### Backend (`backend/.env`)

```env
# Database
DB_URL=jdbc:mysql://localhost:3306/malldb?useSSL=false&serverTimezone=Asia/Seoul
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_ACCESS_EXPIRATION=3600000
JWT_REFRESH_EXPIRATION=604800000

# AWS S3
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-bucket-name

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 데이터베이스 초기화

```sql
CREATE DATABASE equipment_request_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

애플리케이션 실행 시 JPA가 자동으로 테이블을 생성합니다.

### 실행

#### 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

서버가 `http://localhost:8080`에서 실행됩니다.

#### 프론트엔드 실행 (개발 모드)

```bash
cd frontend
npm run dev
# 또는
yarn dev
```

프론트엔드가 `http://localhost:5173`에서 실행됩니다.

#### 프론트엔드 빌드 및 프로덕션 실행

```bash
cd frontend

# 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---

## 📚 API 문서

### Swagger UI

백엔드 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

```
http://localhost:8080/swagger-ui/index.html
```

### 주요 엔드포인트

#### 인증 (`/auth`)

- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

#### 비품 (`/equipment`)

- `GET /equipment` - 비품 목록 조회
- `GET /equipment/{id}` - 비품 상세 조회
- `POST /equipment` - 비품 등록 (관리자)
- `PUT /equipment/{id}` - 비품 수정 (관리자)
- `DELETE /equipment/{id}` - 비품 삭제 (관리자)

#### 신청 (`/requests`)

- `GET /requests/my` - 내 신청 목록
- `POST /requests` - 비품 신청
- `GET /requests/admin/all` - 전체 신청 목록 (관리자)
- `POST /requests/admin/{id}/approve` - 신청 승인 (관리자)
- `POST /requests/admin/{id}/reject` - 신청 반려 (관리자)

---

## 🖼️ 주요 화면

### 사용자 화면

- **로그인/회원가입**: JWT 기반 인증
- **비품 목록**: 카테고리별 필터링 및 검색
- **비품 상세**: 재고 확인 및 장바구니 담기
- **장바구니**: 다중 비품 선택 및 신청
- **신청 내역**: 상태별 필터링 및 추적

### 관리자 화면

- **비품 관리**: CRUD 및 이미지 업로드
- **신청 관리**: 승인/반려 처리 및 통계 대시보드

---

## 🔐 인증 흐름

```
1. 사용자 로그인
   ↓
2. 서버가 Access Token + Refresh Token 발급
   ↓
3. Access Token을 헤더에 포함하여 API 요청
   ↓
4. Access Token 만료 시
   ↓
5. Refresh Token으로 새 Access Token 발급
   ↓
6. 재시도
```

---

## 📦 배포

### 백엔드 배포 (예: AWS EC2)

```bash
# 빌드
./gradlew build

# JAR 실행
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### 프론트엔드 배포 (예: Vercel, Netlify)

```bash
# 빌드
npm run build

# dist 폴더를 배포
```

---

## 🐛 트러블슈팅

### 자주 발생하는 문제

#### CORS 오류

```bash
# backend/.env 파일에서 CORS_ALLOWED_ORIGINS 확인
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### JWT 토큰 만료

- Access Token이 만료되면 자동으로 Refresh Token을 사용하여 갱신
- 문제 지속 시 로그아웃 후 재로그인

#### S3 업로드 실패

- AWS 자격증명 확인
- S3 버킷 권한 확인 (public-read 설정 필요)

#### 카트 데이터 문제

- 로그아웃 시 카트는 자동으로 초기화됩니다
- 현재 카트 데이터는 localStorage에만 저장됩니다 (DB 저장 안 함)

---

## 🏗️ 아키텍처

### 데이터 흐름

```
Frontend (React)
    ↓ Axios
Backend (Spring Boot)
    ↓ JPA
Database (MariaDB/MySQL)

Frontend
    ↓ Multipart
Backend
    ↓ AWS SDK
S3 (이미지 저장)
```

### 상태 관리

- **Zustand**: 전역 상태 (인증, 카트)
- **TanStack Query**: 서버 상태 (비품, 신청)
- **localStorage**: 영구 저장 (인증 토큰, 카트)

---

## 🎨 디자인 시스템

- **shadcn/ui**: 재사용 가능한 UI 컴포넌트
- **TailwindCSS 4**: 유틸리티 우선 스타일링
- **Radix UI**: 접근성 높은 프리미티브 컴포넌트
- **Lucide React**: 일관된 아이콘 시스템

---

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.
