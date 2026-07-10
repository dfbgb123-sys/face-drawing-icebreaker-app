# face-drawing-icebreaker-app

[face-drawing-icebreaker](https://github.com/dfbgb123-sys/face-drawing-icebreaker)의 웹 버전을 클라우드 배포 + React Native 앱으로 확장하기 위한 모노레포입니다.

- `server/` — 기존 웹 저장소를 그대로 이식한 Express/Socket.IO 백엔드. 클라우드 배포를 위해 `PUBLIC_URL` 환경변수 지원이 추가되었습니다(`server/routes.js`, `server/index.js`). 기존 웹 프론트엔드(`server/public/`)도 그대로 남아 있어 브라우저로도 계속 사용할 수 있습니다.
- `app/` — React Native 앱 (참가자/진행자). 아직 작업 전입니다.

원본 웹 저장소는 더 이상 수정하지 않고 그대로 보존합니다.
