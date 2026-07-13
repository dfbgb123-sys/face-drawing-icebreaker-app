# 진행 상황 및 재개 가이드

이 문서는 컴퓨터가 완전 초기화된 뒤에도 작업을 이어갈 수 있도록, 계획서 원문과 지금까지의 진행 상황, 로컬 환경 재설치 방법을 정리한 것입니다. (원래 계획서는 `C:\Users\WW\.claude\plans\playful-herding-riddle.md`에 있었으나 이 파일은 컴퓨터 초기화 시 사라지므로 이 레포에 복사해둡니다.)

## 지금까지 완료된 것 (todo 상태)

1. ✅ 기존 웹 레포(`face-drawing-icebreaker`) 변경사항 커밋 및 push
2. ✅ 새 모노레포(`face-drawing-icebreaker-app`) 생성 및 GitHub push
3. ✅ 서버 포크에 `PUBLIC_URL` 클라우드 배포 지원 추가 (`server/server/routes.js`, `server/server/index.js`)
4. ✅ React Native 앱 프로젝트 스캐폴딩 및 커밋 (`app/`, RN 0.86.0, 패키지명 `com.dfbgb123.faceicebreaker`)
5. ✅ JDK 17 / Android SDK / NDK 설치 및 환경변수 설정 (아래 "로컬 환경 재설치" 참고) — **주의**: 이후 컴퓨터가 다시 초기화되어 현재 이 툴체인은 사라진 상태. 재설치 필요.
6. ✅ 디버그 APK 빌드로 툴체인 검증 완료 (`app-debug.apk` 121MB 생성 확인, `BUILD SUCCESSFUL`) — 위 초기화로 재검증 필요.
7. ✅ RN 앱에 소켓 통신(`socket.io-client`) 연동 — `app/package.json`에 반영 완료, `npm install` 재실행으로 `node_modules` 복구 완료. `@react-native-async-storage/async-storage`, `@shopify/react-native-skia`도 함께 설치됨. 추가로 캔버스 터치 드로잉에 필요한 `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`도 설치하고 `babel.config.js`(`react-native-worklets/plugin`)와 `index.js`(최상단 `import 'react-native-gesture-handler'`)에 설정 완료.
8. ✅ RN 앱에 그림 그리기 캔버스(`react-native-skia` + `react-native-gesture-handler`) 구현 — `app/src/components/DrawingCanvas.tsx`. `Gesture.Pan()` + `GestureDetector`로 터치 드로잉, `makeImageSnapshot().encodeToBytes(ImageFormat.PNG)`로 PNG 캡처. 웹 버전과 달리 캔버스 픽셀 크기를 800x600으로 고정하지 않고, 화면 폭에 맞춘 4:3 비율 반응형 크기 사용(터치 좌표계와 렌더링 좌표계가 RN Skia에서는 동일 dp 단위라 별도 스케일 보정 불필요).
9. ✅ 참가자/진행자 화면 UI 포팅 완료.
   - 참가자 화면: `app/src/screens/player/` — join/lobby/intermission/drawing/reveal/results/ended 상태 머신을 `useReducer`로 구현 (`playerReducer.ts`), 1:1/바톤터치/1:多 세 모드 모두 지원, 그림 제출·추측(guess)·정답 공개 포함.
   - 진행자 화면: `app/src/screens/host/` — setup/lobby/progress/results/ended 상태 머신 구현, 세션 생성(모드 선택·참가자 이름·라운드 길이)·QR/입장주소 표시·로스터 관리·강제 다음 라운드·세션 종료 포함.
   - 앱 진입점(`App.tsx`): 최초 실행 시 서버 주소 입력 화면(`ServerSetupScreen`, AsyncStorage에 저장) → 참가자/진행자 모드 선택(`ModePickerScreen`) → 각 화면으로 이동. `GestureHandlerRootView`로 루트를 감쌈.
   - **웹 버전 대비 단순화한 부분**: 진행자 가이드 모달, 토스트 알림, 실시간 참가자 수 제한 텍스트 입력 잘라내기, 그림 PNG를 기기 갤러리에 저장하는 기능은 이번 포팅에서 제외함(핵심 게임 플로우와 무관한 UI 편의 기능). 나중에 필요하면 추가.
10. ⬜ 클라우드 서버 실제 배포(Render 등) 및 `PUBLIC_URL` 설정. 참고: RN 앱은 `ServerSetupScreen`에서 서버 주소를 직접 입력받아 AsyncStorage에 저장하는 방식으로 구현했음 — `PUBLIC_URL` 배포 후에는 그 주소를 입력하면 됨. 로컬 개발 중엔 같은 와이파이의 PC LAN IP(`http://192.168.x.x:3000`)를 입력하면 됨.
11. ⬜ 에뮬레이터/실기기로 전체 플레이 사이클 검증 — **아직 실행 검증 안 됨** (아래 참고).
12. ⬜ 서명된 릴리즈 APK 빌드 및 사이드로드 배포 안내.

## 검증 상태 (중요)

이번 세션에서는 Android SDK/JDK 툴체인이 없는 상태(컴퓨터 재초기화로 소실)였기 때문에, 실제 에뮬레이터/기기 실행은 하지 못했습니다. 대신 다음으로 코드 정확성을 검증함:

- `npx tsc --noEmit` — 통과
- `npm run lint` (ESLint) — 통과
- `npm test` (Jest) — 통과. `@react-native/jest-preset`가 devDependency에서 누락되어 있던 기존 버그를 발견해 설치함. `react-native-gesture-handler`/`react-native-reanimated`/`@shopify/react-native-skia`/`@react-native-async-storage/async-storage`가 Jest에서 파싱·목(mock) 되도록 `jest.config.js`와 `jest/setup.js`를 새로 구성함 (skia는 공식 `jestEnv.js`/`jestSetup.js`로 CanvasKit-wasm 기반 목 사용).

**재개 시 최우선 작업**: 아래 "로컬 환경 재설치"로 JDK/Android SDK를 다시 설치한 뒤, `cd app && npx react-native run-android`(에뮬레이터 또는 실기기)로 실제 빌드·실행 검증을 하는 것. 특히 확인이 필요한 부분:
- `react-native-reanimated` v4는 New Architecture 전용인데 `android/gradle.properties`에 `newArchEnabled=true`가 이미 설정되어 있음(확인함) — 그래도 실제 네이티브 빌드/런타임에서 문제없는지 확인 필요.
- 캔버스 터치 드로잉이 실제 기기에서 자연스럽게 동작하는지 (제스처 인식, PNG 캡처·업로드).
- 소켓 연결이 실기기에서 서버(같은 와이파이의 PC)에 정상 연결되는지.

## 로컬 환경 재설치 (컴퓨터 초기화 후 필요)

```powershell
# 1) JDK 17 (Temurin)
winget install --id EclipseAdoptium.Temurin.17.JDK --silent --accept-package-agreements --accept-source-agreements

# 2) Android SDK 커맨드라인 도구만 설치 (Android Studio 전체 설치는 winget에서 다운로드가 멈추는 문제가 있었음 — 아래 직접 다운로드 방식을 권장)
mkdir C:\Android\cmdline-tools
# https://dl.google.com/android/repository/repository2-3.xml 에서 최신 commandlinetools-win-*.zip 파일명 확인 후:
curl -L -o cmdline-tools.zip "https://dl.google.com/android/repository/commandlinetools-win-15641748_latest.zip"
# 압축 풀어서 C:\Android\cmdline-tools\latest\bin\sdkmanager.bat 경로가 되도록 폴더명을 latest로 변경

# 3) 환경변수 설정 (User 레벨)
#    JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot (버전은 설치 시점에 따라 다를 수 있음)
#    ANDROID_HOME / ANDROID_SDK_ROOT = C:\Android
#    Path 에 추가: %ANDROID_HOME%\platform-tools, %ANDROID_HOME%\cmdline-tools\latest\bin, %JAVA_HOME%\bin

# 4) SDK 라이선스 동의 + 필수 패키지 설치
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;27.1.12297006" "cmake;3.22.1"
```

**주의**: `winget install --id Google.AndroidStudio`는 시도했을 때 다운로드가 무한정 멈추는 현상이 있었음(원인 불명, 재현되면 위 커맨드라인 도구 직접 설치 방식 사용). 또한 첫 `gradlew assembleDebug` 실행 시 Gradle이 `ndk;27.1.12297006`를 자체적으로 자동 다운로드하려다 멈추는 현상이 있었는데, 위처럼 `sdkmanager`로 미리 NDK를 설치해두면 그 문제를 피할 수 있음.

## 프로젝트 구조

```
face-drawing-icebreaker-app/
  server/          # 기존 웹 레포(face-drawing-icebreaker)를 그대로 이식한 Express/Socket.IO 백엔드
    server/        # index.js, routes.js, socketHandlers.js 등 (PUBLIC_URL 지원 추가됨)
    public/        # 기존 웹 프론트엔드 (브라우저로도 계속 사용 가능)
  app/              # React Native 앱 (참가자+진행자 네이티브 화면)
    src/
      config.ts               # 서버 주소(API_BASE) 저장/로드 (AsyncStorage)
      types.ts                 # 서버 API와 공유하는 타입 정의
      context/ApiBaseContext.tsx
      services/identity.ts     # 참가자 identity(sessionId/participantId/clientToken) 저장
      services/api.ts          # REST API 호출 (세션 조회/생성, 그림 업로드)
      hooks/useSocket.ts        # socket.io-client 연결 훅
      hooks/useCountdown.ts     # 서버 권위 카운트다운 (endsAt 기반, 200ms tick)
      components/DrawingCanvas.tsx  # react-native-skia + gesture-handler 캔버스
      components/Countdown.tsx
      screens/ServerSetupScreen.tsx  # 서버 주소 입력 (최초 1회)
      screens/ModePickerScreen.tsx   # 참가자/진행자 모드 선택
      screens/player/                # 참가자 화면 상태 머신 + 하위 뷰들
      screens/host/                  # 진행자 화면 상태 머신 + 하위 뷰들
```

## 참고: 서버 API 요약 (RN 클라이언트가 사용하는 것)

- `GET /api/sessions/active` — 활성 세션 조회
- `POST /api/sessions` — 세션 생성 (참가자 이름, 라운드 길이, 모드)
- `POST /api/sessions/:id/drawings?participantId&clientToken&roundIndex` — PNG 그림 제출 (raw binary body, `Content-Type: image/png`). RN에서는 `Blob`이 ArrayBuffer로부터 생성 불가능하므로(`Creating blobs from 'ArrayBuffer' ... are not supported` 에러), `Uint8Array`를 fetch의 `body`에 직접 전달함 — RN 코어가 내부적으로 base64 변환 후 네이티브에서 디코드해 전송함(`convertRequestBody.js` 확인).
- Socket.IO 이벤트: `player:join`, `player:rejoin`, `player:submit-guess`, `player:request-reveal`, `host:join`, `host:remove-participant`, `host:start-session`, `host:force-advance`, `host:end-session` (emit) / `session:lobby-update`, `round:assignment`, `session:intermission`, `session:round-start`, `round:end`, `round:submission-progress`, `session:reveal-wait`, `session:results-ready`, `results:your-portraits` (수신).
