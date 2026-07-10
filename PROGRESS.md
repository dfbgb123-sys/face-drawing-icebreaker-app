# 진행 상황 및 재개 가이드

이 문서는 컴퓨터가 완전 초기화된 뒤에도 작업을 이어갈 수 있도록, 계획서 원문과 지금까지의 진행 상황, 로컬 환경 재설치 방법을 정리한 것입니다. (원래 계획서는 `C:\Users\WW\.claude\plans\playful-herding-riddle.md`에 있었으나 이 파일은 컴퓨터 초기화 시 사라지므로 이 레포에 복사해둡니다.)

## 지금까지 완료된 것 (todo 상태)

1. ✅ 기존 웹 레포(`face-drawing-icebreaker`) 변경사항 커밋 및 push
2. ✅ 새 모노레포(`face-drawing-icebreaker-app`) 생성 및 GitHub push
3. ✅ 서버 포크에 `PUBLIC_URL` 클라우드 배포 지원 추가 (`server/server/routes.js`, `server/server/index.js`)
4. ✅ React Native 앱 프로젝트 스캐폴딩 및 커밋 (`app/`, RN 0.86.0, 패키지명 `com.dfbgb123.faceicebreaker`)
5. ✅ JDK 17 / Android SDK / NDK 설치 및 환경변수 설정 (아래 "로컬 환경 재설치" 참고)
6. ✅ 디버그 APK 빌드로 툴체인 검증 완료 (`app-debug.apk` 121MB 생성 확인, `BUILD SUCCESSFUL`)
7. ⏳ RN 앱에 소켓 통신(`socket.io-client`) 연동 — **중단된 시점**: `npm install socket.io-client @react-native-async-storage/async-storage @shopify/react-native-skia --save`를 `app/`에서 실행하던 중 컴퓨터 초기화로 중단됨. `app/package.json`에는 아직 반영 안 됨(재설치 필요).
8. ⬜ RN 앱에 그림 그리기 캔버스(`react-native-skia`) 구현
9. ⬜ 참가자/진행자 화면 UI 포팅 (라운드 진행, 타이머, QR 등)
10. ⬜ 클라우드 서버 실제 배포(Render 등) 및 `PUBLIC_URL` 설정
11. ⬜ 에뮬레이터/실기기로 전체 플레이 사이클 검증
12. ⬜ 서명된 릴리즈 APK 빌드 및 사이드로드 배포 안내

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
  app/              # React Native 앱 (참가자+진행자 네이티브 화면, 작업 중)
```

## 재개 시 다음 작업 (7~9번)

`server/public/js/{socketClient.js, player.js, host.js, canvas.js, countdown.js}`를 참고해 RN으로 포팅:

- `socketClient.js` → RN의 `AsyncStorage`로 identity(`sessionId`, `participantId`, `clientToken`) 저장/로드
- `player.js` → 참가자 화면 상태 머신 (loading/join/lobby/intermission/drawing/reveal/results/ended), 소켓 이벤트: `player:join`, `player:rejoin`, `player:submit-guess`, `player:request-reveal`, 수신 `session:lobby-update`, `round:assignment`, `session:intermission`, `session:round-start`, `round:end`, `session:reveal-wait`, `session:results-ready`, `results:your-portraits`
- `host.js` → 진행자 화면 상태 머신 (setup/lobby/progress/results/ended), 소켓 이벤트: `host:join`, `host:remove-participant`, `host:start-session`, `host:force-advance`, `host:end-session`
- `canvas.js` → `@shopify/react-native-skia`로 포팅. 웹 버전 API: `clear()`, `loadBackground(url)`, `setColor(c)`, `setWidth(w)`, `setTool(t)`, `toBlob()` (PNG). 캔버스 크기는 800x600 고정.
- `countdown.js` → `endsAt` 타임스탬프 기반 카운트다운 (서버 권위, 200ms tick)

세션 참가 흐름: 앱은 QR 스캔 없이 `GET {API_BASE}/api/sessions/active`로 활성 세션 조회 (참고: `player.js:314-318`).

미완료였던 설치 명령 (다시 실행 필요):
```bash
cd app
npm install socket.io-client @react-native-async-storage/async-storage @shopify/react-native-skia --save
```
