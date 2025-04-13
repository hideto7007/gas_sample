# 📦 Google Apps Script × GitHub × CI/CD 自動デプロイ手順

このプロジェクトでは、Google Apps Script（GAS）を GitHub でバージョン管理し、GitHub Actions を用いて CI/CD（自動テスト＆自動デプロイ）を構築しています。

---

## 🔧 前提

- Node.js & npm が使える環境（ローカル）
- Google アカウントを持っている
- `clasp` コマンドが使える状態

---

## ✅ 1. clasp のセットアップ（初回のみ）

```bash
npm install -g @google/clasp
```

## ✅ 2. GAS プロジェクトのクローン or 作成

```bash
clasp clone <scriptId> --rootDir src
```

もしくは

```bash
clasp create --type standalone --title "GAS Sample" --rootDir src
```

## ✅ 3. Jest 導入（テスト環境）

```bash
npm init -y
npm install --save-dev jest
```

- package.json に追記：

```json
"scripts": {
  "test": "jest"
}
```

## ✅ 4. .claspignore を作成

.claspignore に以下を追加（テストコードなどは GAS にアップしない）

```text
test/
node_modules/
```

## ✅ 5. .clasp.json を Git 管理に含める

```json
{
  "scriptId": "AKfxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "rootDir": "src"
}
```

※ .gitignore に .clasp.json を 含めないこと！

## ✅ 6. 認証情報を Secrets に登録（CI/CD 用）

1. 一旦、ログアウト → ログインする

```bash
clasp logout
clasp login --no-localhost
```

- 認証後に http://localhost:8888/?code=... にリダイレクトされる
- その URL をそのままターミナルに貼って完了！

2. ~/.clasprc.json の内容を GitHub Secrets に登録

- GitHub → Settings → Secrets and variables → Actions
- CLASPRC_JSON という名前で追加
- 中身は以下のような形式：

```json
{
  "token": {
    "access_token": "ya29...",
    "refresh_token": "1//...",
    "scope": "https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.deployments",
    "token_type": "Bearer",
    "expiry_date": 9999999999999
  },
  "oauth2ClientSettings": {
    "clientId": "xxx.apps.googleusercontent.com",
    "clientSecret": "xxx"
  },
  "isLocalCreds": false
}
```

## ✅ 7. GitHub Actions の設定

.github/workflows/ci_check.yml を作成：

```yml
name: GAS CI/CD

on:
  push:
    branches:
      - "**"
  pull_request:
    branches:
      - "**"

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test -- --coverage

      - name: Install clasp
        run: npm install -g @google/clasp

      - name: Restore clasp credentials from secrets
        run: |
          echo '{
            "token": {
              "access_token": "${{ secrets.ACCESS_TOKEN }}",
              "refresh_token": "${{ secrets.REFRESH_TOKEN }}",
              "scope": "https://www.googleapis.com/auth/script.projects https://www.googleapis.com/auth/script.deployments",
              "token_type": "Bearer",
              "expiry_date": 9999999999999
            },
            "oauth2ClientSettings": {
              "clientId": "${{ secrets.CLIENTID }}",
              "clientSecret": "${{ secrets.CLIENTSECRET }}",
              "redirectUri": "http://localhost"
            },
            "isLocalCreds": false
          }' > ~/.clasprc.json

      - name: Push to GAS
        if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
        run: clasp push --force
```

✅ 8. テストコード作成（例）
src/test/sample.test.js

```javascript
const { sample } = require("../../src/main/sample");

describe("sample", () => {
  test("return ok", () => {
    expect(sample("sample")).toBe("ok");
  });

  test("return ng", () => {
    expect(sample("other")).toBe("ng");
  });
});
```

## ✅ 9. commit → push → 自動テスト＆GAS 反映

## 補足

こちらのエラーは GAS 上のアクセス許可がされてないとのことなので ON にする

```text
hideto@hideto-MacBook-Air gas_sample % clasp push
User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

[こちらからアクセス](https://script.google.com/home/usersettings)

### ✅ github actions で認証エラーが起きた際の対策

エラー情報

```log
Run clasp push --force

- Pushing files…
Push failed. Errors:
Invalid Credentials
Invalid Credentials
Error: Process completed with exit code 1.
```

内容としては、アクセストークンの有効期限切れ

解決方法としては以下の手順で最新の access_token 取得し github 上の access_token を更新する

1. clasp login
2. cat ~/.clasprc.json の中に最新のログイン情報があるので、その中の`access_token`の値をコピー
3. GitHub の Settings > Secrets > ACCESS_TOKEN を編集し先ほどコピーした値を貼り付け
4. 再度、CI 実施

補足

```bash
# 以下のコマンドを実行するとaccess_tokenだけ取得できる
jq -r '.tokens.default.access_token' ~/.clasprc.json
```
