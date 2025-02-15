# Misskey Discord.js 招待生成ボット

> [!注意]
> このBOTはMisskeyのAPIに「招待コードを操作する」権限がないと動きません。
> APIに「招待コードを操作する」権限を適用できるのは管理者のみです。

## 概要
このプロジェクトは、Discord.js を使用して Misskey の招待トークンを生成するボットです。ユーザーは `/invite` コマンドを使用して招待トークンを生成できます。

## 環境変数
以下の環境変数を設定する必要があります。

- `MISSKEY_TOKEN`: Misskey の API トークン
- `MISSKEY_HOST`: Misskey のホスト名
- `DISCORD_TOKEN`: Discord ボットのトークン

`.env` ファイルにこれらの変数を設定してください。

```
MISSKEY_TOKEN=your_misskey_token
MISSKEY_HOST=your_misskey_host
DISCORD_TOKEN=your_discord_token
```

## インストール
依存関係をインストールします。

```bash
npm install
```

## 使用方法
ボットを起動します。

```bash
node index.js
```

### `/invite` コマンド
Misskey の招待トークンを生成します。以下のオプションを使用できます。

- `expires`: トークンの有効期限（分単位）
- `force_locale`: 強制的に使用するローカライズ (JP/EN)
- `use_role_id`: ローカライズをロールIDで判断するかロールの名前 (JP/EN) で判断するか
- `allow_multiple`: 複数のトークンを発行できるかどうか
- `allowed_roles`: 許可されたロールのカンマ区切りリスト

### `/config invite` コマンド
招待トークン生成の設定を行います。以下のオプションを使用できます。

- `expires`: トークンの有効期限（分単位）
- `force_locale`: 強制的に使用するローカライズ (JP/EN)
- `use_role_id`: ローカライズをロールIDで判断するかロールの名前 (JP/EN) で判断するか
- `allow_multiple`: 複数のトークンを発行できるかどうか
- `allowed_roles`: 許可されたロールのカンマ区切りリスト
- `moderator_role`: モデレーターのロール名

### モデレーターの権限
モデレーターは以下の操作を行うことができます：

- `/config invite` コマンドを使用して招待トークン生成の設定を変更することができます。
  - `expires`: トークンの有効期限（分単位）
  - `force_locale`: 強制的に使用するローカライズ (JP/EN)
  - `use_role_id`: ローカライズをロールIDで判断するかロールの名前 (JP/EN) で判断するか
  - `allow_multiple`: 複数のトークンを発行できるかどうか
  - `allowed_roles`: 許可されたロールのカンマ区切りリスト
  - `moderator_role`: モデレーターのロール名

## 注意事項
- 環境変数が正しく設定されていることを確認してください。
- Discord ボットのトークンが正しいことを確認してください。
- Misskey の API トークンには「招待コードを操作する」権限が必要です。この権限を付与できるのは管理者のみです。
