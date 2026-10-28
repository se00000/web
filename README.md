# 스마트홈 플래너 커뮤니티

웹서비스설계 JWT 게시판 과제입니다.

## 작성자와 서비스 소개

- 학번 / 이름: 202422474 / 서준원
- 서비스 목적과 대상 사용자: 집에 스마트 센서를 설치하려는 사람들이 설치 방법, 기기 후기, 질문을 나누는 커뮤니티입니다. 게시글은 로그인 없이 누구나 읽을 수 있고, 로그인한 사용자만 글을 쓸 수 있으며, 본인이 쓴 글만 수정·삭제할 수 있습니다.
- 선택한 기술: React + Express
- 주요 기능: 공개 목록·상세 조회, 로그인과 JWT 발급, 내 정보 조회, 본인 글 작성·수정·삭제, 토큰 만료·로그아웃 처리

## 보고서와 테스트 증거

- [구현 보고서 PDF](docs/report.pdf)
- [테스트 증거](docs/evidence/)

## 프로젝트 구조

```text
.
├── README.md
├── .gitignore
├── frontend/          # React + Vite (화면, 토큰 보관·전송)
├── backend/           # Express + SQLite(sql.js) (JWT 발급·검증, 권한 검사)
├── tools/
│   └── check_api.py   # 제공된 API 자동 검사 스크립트
└── docs/
    ├── report.pdf
    └── evidence/      # 테스트 캡처 (토큰은 가림)
```

## 실행 환경

| 항목 | 사용 버전 |
|---|---|
| 운영체제 | Windows 11 Home |
| 프론트 런타임 Node.js | v22.23.2 |
| 백엔드 런타임 | Node.js v22.23.2 |
| 프레임워크 | React 19.3.0, Vite 8.3.4 / Express 5.3.0, jsonwebtoken 9.0.3 |
| 데이터 저장 | SQLite (sql.js 1.14.2) |

## 설치와 실행

### 1 저장소 복제

```sh
git clone https://github.com/se00000/web.git
cd web
```

### 2 백엔드 준비와 실행

```sh
cd backend
npm ci
copy .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm start
```

- 환경설정 예시 파일: `backend/.env.example`
- JWT_SECRET 설정 방법: 위 `node -e` 명령으로 64자리 16진수 키를 새로 만들어 `backend/.env`의 `JWT_SECRET=` 뒤에 넣습니다. 키가 64자리 16진수가 아니면 서버가 시작되지 않습니다. `.env`는 커밋하지 않습니다.
- TOKEN_TTL: 기본 90초(`.env`의 `TOKEN_TTL`). 만료 테스트 때는 cmd에서 `set TOKEN_TTL=3` 후 `npm start`로 실행하고, 끝나면 그 터미널을 닫습니다.
- 백엔드 주소: http://127.0.0.1:8000
- 정상 실행 확인 방법: 콘솔에 `SmartHome 커뮤니티 API http://127.0.0.1:8000`이 출력되고, http://127.0.0.1:8000/api/health 가 `{"status":"ok","stack":"express"}`를 반환합니다.

### 3 프론트 빌드와 로컬 실행

백엔드를 켜 두고 새 터미널에서 실행합니다.

```sh
cd frontend
npm ci
npm run build
npm run preview
```

- 최종 확인 주소: http://127.0.0.1:4173
- 개발 중 실행: `npm run dev`, http://127.0.0.1:5173
- API 연결 방식: 브라우저는 4173번으로 `/api/...` 요청을 보내고, Vite preview 서버가 이를 8000번 백엔드로 전달합니다(`frontend/vite.config.js`의 `proxy`). 백엔드 포트를 바꾸면 `backend/.env`의 `PORT`와 `vite.config.js`의 프록시 주소를 함께 바꿉니다.
- 종료: 프론트와 백엔드를 실행한 각 터미널에서 Ctrl+C
- 코드 변경 후 재실행: 프론트는 `npm run build` 후 `npm run preview`를 다시 실행하고, 백엔드는 Ctrl+C 후 `npm start`를 다시 실행합니다.

### 4 테스트 계정과 DB

| 사용자 | 이메일 | 실습용 비밀번호 |
|---|---|---|
| Alice | alice@class.test | Classroom!2026 |
| Bob | bob@class.test | Classroom!2026 |

- SQLite 파일 위치와 자동 생성 방식: `backend/data/board.sqlite`. 서버를 처음 실행할 때 자동으로 생성되고, 글이 바뀔 때마다 저장됩니다.
- DB 초기화 방법: 서버를 종료한 뒤 `backend/data/board.sqlite`를 삭제하고 다시 실행합니다.
- 서버 재시작 후 데이터 유지 확인 결과: 백엔드를 종료 후 재실행해도 기존 글의 제목·내용·작성자가 유지됨(보고서 T15)

위 계정은 과제 전용 테스트 계정입니다.

## 구현 완료 범위

| 기능 | 완료 여부 | 주요 파일 또는 함수 |
|---|---|---|
| 공개 목록과 상세 | 완료 | `backend/src/app.js`, `frontend/src/main.jsx` |
| 로그인과 JWT 발급 | 완료 | `backend/src/auth.js` `issueToken`, `frontend/src/api.js` `login` |
| JWT 검증과 내 정보 조회 | 완료 | `backend/src/auth.js` `currentUserId` |
| 글 작성과 작성자 저장 | 완료 | `backend/src/app.js` `POST /api/posts` |
| 본인 글 수정·삭제 | 완료 | `backend/src/auth.js` `assertOwner`, `frontend/src/api.js` `canEdit` |
| 토큰 만료와 로그아웃 | 완료 | `frontend/src/api.js` `request`, `clearSession` |
| 입력 오류와 권한 오류 처리 | 완료 | `backend/src/app.js` `fields`, 오류 처리기 |

알려진 문제와 미완성 기능: 로그아웃해도 서버에서 토큰이 무효화되지 않아 복사된 토큰은 만료 시각까지 유효합니다. 토큰을 메모리에만 저장하므로 새로고침하면 다시 로그인해야 합니다.

## 테스트 방법과 결과 요약

- 실행한 검사 명령과 실행 위치: 저장소 루트에서 `python tools/check_api.py --mode final` (40개 통과), `TOKEN_TTL=3` 서버에서 `python tools/check_api.py --mode final --expiry` (48개 통과). 나머지는 브라우저 Network 탭과 curl로 직접 확인
- Alice/Bob 권한 구분 확인 결과: Bob이 Alice 글을 수정·삭제하면 403 FORBIDDEN, 글은 그대로 유지(T07, T08)
- HTTP 상태와 오류 code 확인: 200·201·204 정상, 400 BAD_INPUT, 401 INVALID_CREDENTIALS·TOKEN_REQUIRED·INVALID_TOKEN·TOKEN_EXPIRED, 403 FORBIDDEN, 404 NOT_FOUND 확인(보고서 4장)
- 응답 헤더와 본문 확인: 글 등록 201에 `Location: /api/posts/{id}`, 보호 API 401에 `WWW-Authenticate: Bearer`, 삭제 204는 빈 본문
- 토큰 없음·변조·만료 확인 결과: 각각 401 TOKEN_REQUIRED, INVALID_TOKEN, TOKEN_EXPIRED. 401을 받으면 화면이 로그아웃 상태로 바뀜
- 전체 T01~T17 결과와 증거: [보고서 4장](docs/report.pdf), [docs/evidence/](docs/evidence/)

## 핵심 구현 설명

1. **로그인**: `POST /api/auth/login`에서 계정을 확인한 뒤 `issueToken`이 HS256으로 서명한 JWT(sub, iss, aud, exp)를 발급합니다.
2. **토큰 보관·전송**: 프론트는 토큰을 메모리 변수 `session`에만 저장하고, 요청마다 `Authorization: Bearer <토큰>`을 붙입니다. 401을 받으면 세션을 지웁니다.
3. **서버 검증**: `currentUserId`가 헤더 형식, 서명, 알고리즘, iss, aud, 만료, exp·sub 존재, 실제 사용자를 확인한 뒤 사용자 ID를 반환합니다.
4. **작성자 권한 검사**: 수정·삭제 시 `assertOwner`가 토큰의 사용자 ID와 글의 authorId를 비교해 다르면 403을 반환합니다. 작성자는 요청 본문이 아니라 토큰으로 정합니다.

자세한 코드 설명은 [보고서 3장](docs/report.pdf)에 있습니다.

## AI 활용 요약과 참고 자료

- AI 사용 여부: 사용
- 도구와 사용 목적: Claude Code(Claude Opus 5.5). 문법 학습, 본인 작성 코드 검토와 디버깅, 초기 설정, 테스트 명령 작성, 보고서 초안
- 반영 위치와 직접 수정·검증한 내용: 구현 함수(BE-01~03, FE-01~04)는 힌트를 받아 직접 작성하고 리뷰 후 수정. `jwt.verify` 옵션과 `login` 요청 줄은 AI 제안을 반영. 모두 T01~T17로 검증
- 상세 활용 기록: [보고서 5장](docs/report.pdf)
- 참고한 수업 자료·외부 코드·공식 문서: 웹서비스설계 과제 자료와 제공 템플릿, [jsonwebtoken 문서](https://github.com/auth0/node-jsonwebtoken)

## 제출 확인

- [x] README의 안내 문구를 실제 내용으로 교체했다.
- [ ] 새 폴더에 clone하여 README만으로 설치·환경설정·빌드·로컬 실행했다.
- [x] 4173번 빌드 화면에서 API 연결과 전체 필수 기능을 확인했다.
- [ ] GitHub에서 보고서와 증거 링크가 열린다.
- [ ] 교수자가 저장소를 열람·복제할 수 있다.
- [x] 비밀 키·실제 토큰·DB·node_modules·.venv·target을 커밋하지 않았다.
- [ ] 최종 push 후 저장소 URL과 제출 기준 커밋 SHA를 LMS에 제출했다.
