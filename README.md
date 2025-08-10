# Slack to Spreadsheet GAS

Slackのチャンネルメッセージを自動でGoogleスプレッドシートに転記するGoogle Apps Scriptプロジェクトです。

## 📋 機能

- ✅ Slackチャンネルのメッセージを自動取得
- ✅ スレッド（返信）も含めて取得
- ✅ ユーザー名を実名で表示
- ✅ 日時を日本時間で適切にフォーマット
- ✅ スプレッドシートに見やすく整理して転記

## 🚀 セットアップ手順

### 1. Slack App の作成とBot Token取得

1. [Slack API](https://api.slack.com/apps) にアクセス
2. 「Create New App」→「From scratch」を選択
3. App名とワークスペースを設定
4. 左メニューの「OAuth & Permissions」をクリック
5. 「Bot Token Scopes」で以下の権限を追加：
   - `channels:history` （パブリックチャンネルの履歴読取）
   - `groups:history` （プライベートチャンネルの履歴読取）
   - `users:read` （ユーザー情報読取）
6. 「Install to Workspace」をクリック
7. **Bot User OAuth Token**（`xoxb-`で始まる）をコピーして保存

### 2. Googleスプレッドシートの準備

1. [Google スプレッドシート](https://sheets.google.com)で新しいシートを作成
2. 任意の名前を付けて保存

### 3. Google Apps Script の設定

1. スプレッドシートで「拡張機能」→「Apps Script」を選択
2. このリポジトリの`Code.js`の内容をコピー
3. Apps Scriptエディタに貼り付け
4. 以下の設定値を変更：
   ```javascript
   const token = "your-bot-token-here"; // 手順1で取得したBot Token
   const channel = "your-channel-id-here"; // 対象チャンネルのID
   ```

### 4. チャンネルIDの取得方法

**Webブラウザから：**
- Slackのチャンネルを開く
- URLの末尾がチャンネルID（例：`C0123456789`）

**Slackアプリから：**
- チャンネル名を右クリック→「リンクをコピー」
- URLからチャンネルIDを抽出

### 5. Botをチャンネルに招待

- 対象のSlackチャンネルで `/invite @your-bot-name` を実行
- または、チャンネル設定からBotを追加

## 📊 スプレッドシートの構成

| 列 | 項目 | 説明 |
|---|------|------|
| A | 投稿時刻 | メッセージの投稿日時（日本時間） |
| B | 投稿者 | メッセージを投稿したユーザーの実名 |
| C | 投稿内容 | メッセージの本文 |
| D | 回答者 | 返信したユーザーの実名 |
| E | 回答内容 | 返信の本文 |

## 🔄 使用方法

### 手動実行
1. Apps Scriptエディタで `saveMessagesToSheet` 関数を選択
2. 実行ボタン（▷）をクリック

### 定期実行（推奨）
1. Apps Scriptエディタで「トリガー」（時計アイコン）をクリック
2. 「トリガーを追加」を選択
3. 以下を設定：
   - 実行する関数: `saveMessagesToSheet`
   - イベントのソース: 時間主導型
   - 間隔: 任意（例：1時間おき、毎日など）

## ⚠️ 注意事項

- **Bot Tokenは機密情報です**。他人と絶対に共有しないでください
- 初回実行時に権限の認証が必要です
- API制限により、一度に取得できるメッセージ数は制限されています（現在5件）
- 既存のスプレッドシートデータは上書きされませんが、重複チェックは行いません

## 🛠️ カスタマイズ

### メッセージ取得件数の変更
```javascript
const apiUrl = `https://slack.com/api/conversations.history?channel=${channel}&limit=10`; // 5→10に変更
```

### よくあるエラー

**「invalid_auth」エラー**
- Bot Tokenが正しく設定されているか確認
- Slack Appがワークスペースにインストールされているか確認

**「missing_scope」エラー**
- 必要な権限（scopes）が追加されているか確認
- 権限変更後にワークスペースに再インストール

**「Unknown User」表示**
- `users:read` 権限が追加されているか確認

### デバッグ方法
Apps Scriptの実行ログで詳細なエラー情報を確認できます：
1. 実行後「実行数」をクリック
2. ログを確認してエラー内容を特定

## 📝 ライセンス
このプロジェクトはMITライセンスの下で公開されています。
使用は自己責任でお願いします。作者は一切の責任を負いません。
⚠️ 免責事項

このソフトウェアは「現状のまま」提供されます
使用によって生じたいかなる損害についても作者は責任を負いません
商用利用、改変、再配布は自由ですが、全て自己責任で行ってください
サポートやメンテナンスは保証されません

---

**作成者**: [sano]  
**最終更新**: 2025年8月
