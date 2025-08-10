 function saveMessagesToSheet() {
  const token = ""; //作成したbotトークンを張り付けてください
  const channel = "";//該当するワークスペースのチャンネルIDを張り付けてください
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  // ヘッダー設定
  if (sheet.getRange("A3").getValue() === "") {
    sheet.getRange("A3").setValue("投稿時刻");
    sheet.getRange("B3").setValue("投稿者");
    sheet.getRange("C3").setValue("投稿内容");
    sheet.getRange("D3").setValue("回答者");
    sheet.getRange("E3").setValue("回答内容");
  }

  const apiUrl = `https://slack.com/api/conversations.history?channel=${channel}&limit=5`;
  const options = {
    method: "get",
    headers: { "Authorization": `Bearer ${token}` }
  };
  
  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const data = JSON.parse(response.getContentText());
    console.log("APIレスポンス:", JSON.stringify(data));

    if (!data.ok) {
      throw new Error(`APIエラー: ${data.error}`);
    }

    const messages = data.messages || [];
    for (const message of messages) {
      // 投稿のみ処理
      if (!message.thread_ts || message.ts === message.thread_ts) {
        const parentRow = sheet.getLastRow() + 1;
        
        // 投稿をA-C列に転記
        sheet.getRange(parentRow, 1, 1, 3).setValues([[
          new Date(message.ts * 1000),
          getUserName(message.user, token),
          message.text
        ]]);
        
        // スレッド取得
        const replies = getReplies(message, token, channel, options);
        
        // スレッドを投稿の1行下のD-E列に転記
        replies.forEach((reply, index) => {
          const replyRow = parentRow + index + 1; 
          if (index === 0) {
            // 最初の返信は親投稿と同じ行のD-E列に
            sheet.getRange(replyRow, 4, 1, 2).setValues([[
              getUserName(reply.user, token),
              reply.text
            ]]);
          } else {
            // 2つ目以降のスレッドは新しい行に
            const newRow = sheet.getLastRow() + 1;
            sheet.getRange(newRow, 4, 1, 2).setValues([[
              getUserName(reply.user, token),
              reply.text
            ]]);
          }
        });
      }
    }
    
    // 最終実行時刻更新
    const currentTimeJST = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    sheet.getRange("A1").setValue(currentTimeJST);
    
  } catch (e) {
    console.error("エラー発生:", e.message);
    throw e;
  }
}

// スレッド取得関数
function getReplies(message, token, channel, options) {
  if (!message.reply_count) return [];
  const repliesUrl = `https://slack.com/api/conversations.replies?channel=${channel}&ts=${message.ts}`;
  const repliesResponse = UrlFetchApp.fetch(repliesUrl, options);
  const repliesData = JSON.parse(repliesResponse.getContentText());
  return repliesData.ok ? repliesData.messages.filter(m => m.ts !== message.ts) : [];
}

// ユーザー名取得関数
 function getUserName(userId, token) {
   try {
    const userResponse = UrlFetchApp.fetch(`https://slack.com/api/users.info?user=${userId}`, {
       headers: { "Authorization": `Bearer ${token}` }
     });
     const userData = JSON.parse(userResponse.getContentText());
     return userData.user?.real_name || "Unknown User";
   } catch (e) {
     return "Unknown User";
   }
 }