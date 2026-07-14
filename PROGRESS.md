# 진행 상황 및 재개 가이드

이 문서는 컴퓨터가 완전 초기화된 뒤에도 작업을 이어갈 수 있도록, 계획서 원문과 지금까지의 진행 상황, 로컬 환경 재설치 방법을 정리한 것입니다. (원래 계획서는 `C:\Users\WW\.claude\plans\playful-herding-riddle.md`에 있었으나 이 파일은 컴퓨터 초기화 시 사라지므로 이 레포에 복사해둡니다.)

## 지금까지 완료된 것 (todo 상태)

1. ✅ 기존 웹 레포(`face-drawing-icebreaker`) 변경사항 커밋 및 push
2. ✅ 새 모노레포(`face-drawing-icebreaker-app`) 생성 및 GitHub push
3. ✅ 서버 포크에 `PUBLIC_URL` 클라우드 배포 지원 추가 (`server/server/routes.js`, `server/server/index.js`)
4. ✅ React Native 앱 프로젝트 스캐폴딩 및 커밋 (`app/`, RN 0.86.0, 패키지명 `com.dfbgb123.faceicebreaker`)
5. ✅ JDK 17 / Android SDK / NDK 재설치 완료 (아래 "로컬 환경 재설치" 참고 — 이번 세션에 처음부터 다시 진행함)
6. 🔧 디버그 APK 빌드로 툴체인 검증 — **진행 중, 아직 성공 확인 못함**. 자세한 내용은 아래 "6번 항목 상세: Windows 빌드 트러블슈팅" 참고.
7. ✅ RN 앱에 소켓 통신(`socket.io-client`) 연동 — `app/package.json`에 반영 완료. `@react-native-async-storage/async-storage`, `@shopify/react-native-skia`도 함께 설치됨. 캔버스 터치 드로잉에 필요한 `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`도 설치하고 `babel.config.js`(`react-native-worklets/plugin`)와 `index.js`(최상단 `import 'react-native-gesture-handler'`)에 설정 완료.
8. ✅ RN 앱에 그림 그리기 캔버스(`react-native-skia` + `react-native-gesture-handler`) 구현 — `app/src/components/DrawingCanvas.tsx`. `Gesture.Pan()` + `GestureDetector`로 터치 드로잉, `makeImageSnapshot().encodeToBytes(ImageFormat.PNG)`로 PNG 캡처. 웹 버전과 달리 캔버스 픽셀 크기를 800x600으로 고정하지 않고, 화면 폭에 맞춘 4:3 비율 반응형 크기 사용(터치 좌표계와 렌더링 좌표계가 RN Skia에서는 동일 dp 단위라 별도 스케일 보정 불필요).
9. ✅ 참가자/진행자 화면 UI 포팅 완료.
   - 참가자 화면: `app/src/screens/player/` — join/lobby/intermission/drawing/reveal/results/ended 상태 머신을 `useReducer`로 구현 (`playerReducer.ts`), 1:1/바톤터치/1:多 세 모드 모두 지원, 그림 제출·추측(guess)·정답 공개 포함.
   - 진행자 화면: `app/src/screens/host/` — setup/lobby/progress/results/ended 상태 머신 구현, 세션 생성(모드 선택·참가자 이름·라운드 길이)·QR/입장주소 표시·로스터 관리·강제 다음 라운드·세션 종료 포함.
   - 앱 진입점(`App.tsx`): 최초 실행 시 서버 주소 입력 화면(`ServerSetupScreen`, AsyncStorage에 저장) → 참가자/진행자 모드 선택(`ModePickerScreen`) → 각 화면으로 이동. `GestureHandlerRootView`로 루트를 감쌈.
   - **웹 버전 대비 단순화한 부분**: 진행자 가이드 모달, 토스트 알림, 실시간 참가자 수 제한 텍스트 입력 잘라내기, 그림 PNG를 기기 갤러리에 저장하는 기능은 이번 포팅에서 제외함(핵심 게임 플로우와 무관한 UI 편의 기능). 나중에 필요하면 추가.
10. ⬜ 클라우드 서버 실제 배포(Render 등) 및 `PUBLIC_URL` 설정. 참고: RN 앱은 `ServerSetupScreen`에서 서버 주소를 직접 입력받아 AsyncStorage에 저장하는 방식으로 구현했음 — `PUBLIC_URL` 배포 후에는 그 주소를 입력하면 됨. 로컬 개발 중엔 같은 와이파이의 PC LAN IP(`http://192.168.x.x:3000`)를 입력하면 됨.
11. ⬜ 에뮬레이터/실기기로 전체 플레이 사이클 검증 — 6번이 끝나야 진행 가능.
12. ⬜ 서명된 릴리즈 APK 빌드 및 사이드로드 배포 안내.

## 코드 검증 상태 (tsc / lint / jest)

- `npx tsc --noEmit` — 통과
- `npm run lint` (ESLint) — 통과
- `npm test` (Jest) — 통과. `@react-native/jest-preset`가 devDependency에서 누락되어 있던 기존 버그를 발견해 설치함. `react-native-gesture-handler`/`react-native-reanimated`/`@shopify/react-native-skia`/`@react-native-async-storage/async-storage`가 Jest에서 파싱·목(mock) 되도록 `jest.config.js`와 `jest/setup.js`를 새로 구성함 (skia는 공식 `jestEnv.js`/`jestSetup.js`로 CanvasKit-wasm 기반 목 사용).

## 6번 항목 상세: Windows 빌드 트러블슈팅 (재개 시 여기부터)

JDK/SDK를 전부 재설치하고 `gradlew assembleDebug`를 돌렸는데, **Windows 260자 경로 길이 제한**에 걸려 계속 실패 중입니다. 지금까지 파악한 것과 시도한 것:

### 원인
`react-native-gesture-handler`의 Fabric(New Architecture) 코드젠이 만드는 오브젝트 파일 경로가 384자로, Windows의 기본 MAX_PATH(260자)를 넘음:
```
...\android\app\.cxx\Debug\<hash>\arm64-v8a\rngesturehandler_codegen_autolinked_build\CMakeFiles\react_codegen_rngesturehandler_codegen.dir\C_\Users\dfbgb\face-drawing-icebreaker-app\app\node_modules\react-native-gesture-handler\shared\shadowNodes\react\renderer\components\rngesturehandler_codegen\RNGestureHandlerDetectorShadowNode.cpp.o
```

### 시도 1: Windows Long Path 활성화 — 부분 실패
관리자 권한으로 레지스트리 설정:
```powershell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
```
→ 설정은 성공했지만 **동일한 에러로 다시 실패**. 원인: Android SDK의 `cmake;3.22.1` 패키지에 번들된 `ninja.exe`가 **버전 1.10.2**로, 이 레지스트리 설정을 인식하지 못하는 구버전(ninja가 Windows 긴 경로를 제대로 지원하기 시작한 건 1.11+).

### 시도 2: 경로 단축 (subst, buildStagingDirectory 등) — 수학적으로 불가능 확인
드라이브 문자 치환(`subst`)이나 CMake 빌드 스테이징 경로 단축을 아무리 최적으로 조합해도, AGP가 자동 생성하는 고정 경로 세그먼트(`CMakeFiles\react_codegen_....dir\` 등, 121자)와 gesture-handler 패키지 내부의 고정된 상대경로(`node_modules\...\RNGestureHandlerDetectorShadowNode.cpp.o`, 152자)를 합치면 최선의 경우에도 **279자**로, 여전히 260자를 초과함. → 경로 단축만으로는 근본 해결 불가능.

### 시도 3: 최신 cmake로 교체, Gradle 설정으로 버전 지정 — Gradle DSL 타이밍 문제로 실패
- `sdkmanager "cmake;4.1.2"`로 설치 (ninja 1.12.1 포함, 긴 경로 정상 지원 확인함: `C:\Android\cmake\4.1.2\bin\ninja.exe --version` → `1.12.1`)
- `app/android/build.gradle`에 `subprojects { afterEvaluate { ... cmake.version = "4.1.2" } }` 추가 → **"Cannot run Project.afterEvaluate(Closure) when the project is already evaluated"** 에러
- `subprojects { subproject.plugins.withId(...) { ... cmake.version = "4.1.2" } }`로 수정 → **"AgpDslLockedException: It is too late to set version"** 에러
- 두 방식 모두 `com.facebook.react.rootproject` 플러그인이 서브프로젝트를 먼저 평가해버리는 타이밍 때문에 실패. **이 방식은 포기함, `app/android/build.gradle`는 원상복구했음** (현재 커스텀 코드 없음).

### 시도 4: ninja.exe 바이너리 직접 교체 — 진행 중, 유망함
Gradle 설정을 건드리지 않고, AGP가 실제로 호출하는 `C:\Android\cmake\3.22.1\bin\ninja.exe` 파일 자체를 cmake 4.1.2의 ninja로 덮어씀:
```powershell
# 원본 백업 (이미 해둠, C:\Android\cmake\3.22.1\bin\ninja.exe.orig-1.10.2)
Copy-Item "C:\Android\cmake\4.1.2\bin\ninja.exe" "C:\Android\cmake\3.22.1\bin\ninja.exe" -Force
```
이 상태로 `gradlew assembleDebug`를 다시 돌렸을 때, **이전에 실패했던 지점(gesture-handler codegen)을 통과하고 더 진행되는 것까지 확인**했으나, 사용자 요청으로 세션을 여기서 멈춤 — **빌드가 최종 성공했는지는 아직 확인 못함**.

### 재개 시 할 일
1. 위 ninja.exe 교체가 이미 되어 있는지 확인 (`C:\Android\cmake\3.22.1\bin\ninja.exe.orig-1.10.2` 파일이 있으면 이미 교체된 것):
   ```powershell
   Test-Path "C:\Android\cmake\3.22.1\bin\ninja.exe.orig-1.10.2"
   ```
2. 아래 명령으로 다시 빌드 (env var는 새 셸에선 다시 지정해야 함 — User 레벨 영구 설정은 되어 있지만 이 세션의 PowerShell 도구에서는 새 프로세스마다 `$env:` 로 재지정 필요했음):
   ```powershell
   $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
   $env:ANDROID_HOME = "C:\Android"
   $env:ANDROID_SDK_ROOT = "C:\Android"
   cd C:\Users\dfbgb\face-drawing-icebreaker-app\app\android
   .\gradlew.bat assembleDebug --stacktrace
   ```
3. 성공하면 `app-debug.apk`가 `app/android/app/build/outputs/apk/debug/` 에 생성됨. 에뮬레이터/실기기에 `adb install`로 설치해 11번(전체 플레이 사이클 검증)으로 넘어가면 됨.
4. 만약 ninja 교체로도 여전히 같은 260자 에러가 난다면 (다른 파일에서 재발 등): `LongPathsEnabled` 레지스트리는 이미 켜져 있으니, 남은 방법은 (a) 프로젝트 자체를 `C:\rn\` 같은 훨씬 짧은 경로로 옮기고 ninja 교체와 병행 (계산상 둘을 합치면 260자 안쪽으로 들어올 가능성 높음), 또는 (b) WSL2 안에서 빌드하는 방법을 고려.

## 로컬 환경 재설치 (컴퓨터 초기화 후 필요) — 이번 세션에 다시 검증한 최신 버전

```powershell
# 1) JDK 17 (Temurin)
winget install --id EclipseAdoptium.Temurin.17.JDK --silent --accept-package-agreements --accept-source-agreements

# 2) Android SDK 커맨드라인 도구만 설치 (Android Studio 전체 설치는 winget에서 다운로드가 멈추는 문제가 있었음 — 아래 직접 다운로드 방식을 권장)
mkdir C:\Android\cmdline-tools
# https://dl.google.com/android/repository/repository2-3.xml 에서 최신 commandlinetools-win-*.zip 파일명 확인 후:
curl -L -o cmdline-tools.zip "https://dl.google.com/android/repository/commandlinetools-win-15641748_latest.zip"
# 압축 풀어서 C:\Android\cmdline-tools\latest\bin\sdkmanager.bat 경로가 되도록 폴더명을 latest로 변경 (zip 안에 이미 cmdline-tools 폴더가 있으므로 그 내용물을 latest/ 로 옮기면 됨)

# 3) 환경변수 설정 (User 레벨 — [System.Environment]::SetEnvironmentVariable(..., 'User')로 설정함, PowerShell 새 프로세스부터 적용되나 이 세션의 도구에서는 안 잡혀서 매번 $env: 로 재지정했음)
#    JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot (버전은 설치 시점에 따라 다를 수 있음)
#    ANDROID_HOME / ANDROID_SDK_ROOT = C:\Android
#    Path 에 추가: %ANDROID_HOME%\platform-tools, %ANDROID_HOME%\cmdline-tools\latest\bin, %JAVA_HOME%\bin

# 4) SDK 라이선스 동의 (대화형 프롬프트라 y를 여러 줄 파이핑해야 함, PowerShell 파이프보다 cmd 리다이렉션이 더 안정적이었음)
#    (1..25 | % {"y"}) -join "`r`n" | Out-File -Encoding ascii yes.txt
#    cmd /c "sdkmanager.bat --licenses < yes.txt"
sdkmanager --licenses

# 5) 필수 SDK 패키지 설치 (프로젝트의 android/build.gradle가 실제로는 compileSdk/targetSdk/buildTools 36을 요구하므로, 34만 깔아두면 Gradle이 첫 빌드 때 36 계열을 자동으로 더 받아옴 — 그건 정상 동작이니 놀라지 말 것)
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" "ndk;27.1.12297006" "cmake;3.22.1"

# 6) Windows 260자 경로 문제 대응을 위해 최신 cmake도 함께 설치 (ninja 1.12.1 포함)
sdkmanager "cmake;4.1.2"
# 그 다음 위 "6번 항목 상세"의 "시도 4"대로 3.22.1의 ninja.exe를 4.1.2의 것으로 교체
```

**주의**: `winget install --id Google.AndroidStudio`는 시도했을 때 다운로드가 무한정 멈추는 현상이 있었음(원인 불명, 재현되면 위 커맨드라인 도구 직접 설치 방식 사용).

**주의 (관리자 권한)**: 이 세션의 셸 프로세스는 관리자 권한이 아니었지만, `dfbgb` 계정 자체는 Administrators 그룹 소속이라 `Start-Process ... -Verb RunAs`로 UAC 승인 창을 띄워서 관리자 작업(레지스트리 변경 등)을 수행할 수 있었음. 재개 시에도 이 방법이 통함.

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

## 이번 세션에 설치된 것 (참고용 인벤토리)

- JDK 17 Temurin (`C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot`)
- Android SDK (`C:\Android`, 총 ~3GB): `platform-tools`, `platforms;android-34`, `platforms;android-36`(Gradle 자동 추가), `build-tools;34.0.0`/`35.0.0`/`36.0.0`(34는 직접 설치, 35/36은 Gradle이 빌드 중 자동으로 받음 — 프로젝트의 `android/build.gradle`가 `compileSdkVersion/buildToolsVersion = 36`을 요구하기 때문, 정상), `ndk;27.1.12297006`, `cmake;3.22.1`(ninja를 1.12.1로 교체함), `cmake;4.1.2`(ninja 소스로 사용)
- npm 패키지 (앞서 7~9번 항목 참고): `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`, `@react-native/jest-preset`(devDependency)
- Windows 레지스트리: `HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem\LongPathsEnabled = 1` (관리자 권한으로 변경)
