# Misskey Discord.js 초대 생성기

> [!주의]
> 이 봇은 Misskey API에 "초대 코드 관리" 권한이 없으면 작동하지 않습니다.
> API 토큰에 "초대 코드 관리" 권한을 적용할 수 있는 사람은 관리자뿐입니다.

## 개요
이 프로젝트는 Discord.js를 사용하여 Misskey 초대 토큰을 생성하는 봇입니다. 사용자는 `/invite` 명령어를 사용하여 초대 토큰을 생성할 수 있습니다.

## 환경 변수
다음 환경 변수를 설정해야 합니다.

- `MISSKEY_TOKEN`: Misskey API 토큰
- `MISSKEY_HOST`: Misskey 호스트 이름
- `DISCORD_TOKEN`: Discord 봇 토큰

이 변수들을 `.env` 파일에 설정하세요.

```
MISSKEY_TOKEN=your_misskey_token
MISSKEY_HOST=your_misskey_host
DISCORD_TOKEN=your_discord_token
```

## 설치
의존성을 설치합니다.

```bash
npm install
```

## 사용 방법
봇을 시작합니다.

```bash
node index.js
```

### `/invite` 명령어
Misskey 초대 토큰을 생성합니다. 다음 옵션을 사용할 수 있습니다.

- `expires`: 토큰의 유효 기간 (분 단위)
- `force_locale`: 사용할 로컬라이제이션 강제 지정 (JP/EN)
- `use_role_id`: 로컬라이제이션을 역할 ID로 판단할지 역할 이름으로 판단할지
- `allow_multiple`: 여러 개의 토큰을 발행할 수 있는지 여부
- `allowed_roles`: 허용된 역할의 쉼표로 구분된 목록

### `/config invite` 명령어
초대 토큰 생성 설정을 구성합니다. 다음 옵션을 사용할 수 있습니다.

- `expires`: 토큰의 유효 기간 (분 단위)
- `force_locale`: 사용할 로컬라이제이션 강제 지정 (JP/EN)
- `use_role_id`: 로컬라이제이션을 역할 ID로 판단할지 역할 이름으로 판단할지
- `allow_multiple`: 여러 개의 토큰을 발행할 수 있는지 여부
- `allowed_roles`: 허용된 역할의 쉼표로 구분된 목록
- `moderator_role`: 모더레이터 역할 이름

### 모더레이터 권한
모더레이터는 다음 작업을 수행할 수 있습니다.

- `/config invite` 명령어를 사용하여 초대 토큰 생성 설정을 변경할 수 있습니다.
  - `expires`: 토큰의 유효 기간 (분 단위)
  - `force_locale`: 사용할 로컬라이제이션 강제 지정 (JP/EN)
  - `use_role_id`: 로컬라이제이션을 역할 ID로 판단할지 역할 이름으로 판단할지
  - `allow_multiple`: 여러 개의 토큰을 발행할 수 있는지 여부
  - `allowed_roles`: 허용된 역할의 쉼표로 구분된 목록
  - `moderator_role`: 모더레이터 역할 이름

## 주의 사항
- 환경 변수가 올바르게 설정되었는지 확인하세요.
- Discord 봇 토큰이 올바른지 확인하세요.
- Misskey API 토큰에는 "초대 코드 관리" 권한이 필요합니다. 이 권한을 부여할 수 있는 사람은 관리자뿐입니다.
