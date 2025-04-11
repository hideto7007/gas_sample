### Google Apps Script

--

#### 初期設定

- ログインする

```bash
clasp login
```

- ローカルにソースコードがアップさせる

- github にリポジトリ作成

- ローカルで編集したソースを反映

```bash
clasp push
```

- こちらのエラー

```text
hideto@hideto-MacBook-Air gas_sample % clasp push
User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

https://script.google.com/home/usersettings

### テスト環境構築

---

- ① npm init と Jest のインストール

```bash
npm init -y
npm install --save-dev jest
```

- gas 上のアップロードしないように .claspignore に以下を含める

```text
# テストコード除外
test/**

# ビルドツール設定など
jest.config.js
package.json
package-lock.json

# npm系
node_modules/**

# ドキュメントなど
README.md
.gitignore
```
