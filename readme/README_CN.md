# Misskey Discord.js 邀请生成器

> [!注意]
> 如果 Misskey API 没有“管理邀请代码”权限，则此机器人无法工作。
> 只有管理员可以将“管理邀请代码”权限应用于 API 令牌。

## 概要
该项目是一个使用 Discord.js 生成 Misskey 邀请令牌的机器人。用户可以使用 `/invite` 命令生成邀请令牌。

## 环境变量
需要设置以下环境变量。

- `MISSKEY_TOKEN`: Misskey API 令牌
- `MISSKEY_HOST`: Misskey 主机名
- `DISCORD_TOKEN`: Discord 机器人令牌

在 `.env` 文件中设置这些变量。

```
MISSKEY_TOKEN=your_misskey_token
MISSKEY_HOST=your_misskey_host
DISCORD_TOKEN=your_discord_token
```

## 安装
安装依赖项。

```bash
npm install
```

## 使用方法
启动机器人。

```bash
node index.js
```

### `/invite` 命令
生成 Misskey 邀请令牌。可以使用以下选项。

- `expires`: 令牌的有效期（以分钟为单位）
- `force_locale`: 强制使用的本地化 (JP/EN)
- `use_role_id`: 通过角色 ID 或角色名称确定本地化
- `allow_multiple`: 是否允许多个令牌
- `allowed_roles`: 允许的角色的逗号分隔列表

### `/config invite` 命令
配置邀请令牌生成。可以使用以下选项。

- `expires`: 令牌的有效期（以分钟为单位）
- `force_locale`: 强制使用的本地化 (JP/EN)
- `use_role_id`: 通过角色 ID 或角色名称确定本地化
- `allow_multiple`: 是否允许多个令牌
- `allowed_roles`: 允许的角色的逗号分隔列表
- `moderator_role`: 版主角色名称

### 版主权限
版主可以执行以下操作：

- 使用 `/config invite` 命令更改邀请令牌生成设置。
  - `expires`: 令牌的有效期（以分钟为单位）
  - `force_locale`: 强制使用的本地化 (JP/EN)
  - `use_role_id`: 通过角色 ID 或角色名称确定本地化
  - `allow_multiple`: 是否允许多个令牌
  - `allowed_roles`: 允许的角色的逗号分隔列表
  - `moderator_role`: 版主角色名称

## 注意事项
- 确保环境变量设置正确。
- 确保 Discord 机器人令牌正确。
- Misskey API 令牌需要“管理邀请代码”权限。只有管理员可以授予此权限。
