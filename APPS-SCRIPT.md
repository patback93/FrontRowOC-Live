# APPS-SCRIPT.md — Mint your `HOLD_WEBHOOK_URL` in ~10 minutes

The `/galas` date-hold form POSTs to `/api/hold`, which forwards each
submission to whatever URL is in the `HOLD_WEBHOOK_URL` environment variable.
The fastest free way to receive those submissions is a Google Apps Script web
app that emails you and appends a row to a spreadsheet. Copy-paste below.

## The script

```javascript
// Front Row Broadcast — /galas date-hold receiver
// Emails hello@frontrowoc.com and appends every submission to a sheet.

var NOTIFY = 'hello@frontrowoc.com';

function doPost(e) {
  var d = {};
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  var fields = ['name', 'org', 'email', 'phone', 'date', 'venue', 'page', 'ts', 'ua'];
  var clean = function (k) { return String(d[k] || ''); };

  // 1) Email the hold request
  var lines = fields.map(function (k) {
    return k.toUpperCase() + ': ' + clean(k);
  });
  MailApp.sendEmail({
    to: NOTIFY,
    subject: 'DATE HOLD — ' + clean('date') + ' — ' + (clean('org') || clean('name')),
    body:
      'New date-hold request from frontrowoc.com/galas\n\n' +
      lines.join('\n') +
      '\n\nReply within 2 hours — that is the promise on the page.',
  });

  // 2) Append to the spreadsheet this script is bound to
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Holds') || ss.insertSheet('Holds');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['RECEIVED', 'NAME', 'ORG', 'EMAIL', 'PHONE', 'EVENT DATE', 'VENUE', 'PAGE', 'CLIENT TS', 'UA']);
  }
  sheet.appendRow([
    new Date(),
    clean('name'), clean('org'), clean('email'), clean('phone'),
    clean('date'), clean('venue'), clean('page'), clean('ts'), clean('ua'),
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## Deploy in 5 steps

1. **Create the sheet + script.** Go to [sheets.new](https://sheets.new), name
   the spreadsheet `Front Row — Date Holds`, then **Extensions → Apps
   Script**. Delete the placeholder code and paste the script above. Save
   (name it `hold-receiver`).
2. **Deploy as a web app.** Click **Deploy → New deployment → ⚙ Select type →
   Web app**. Description: `galas hold form`. **Execute as: Me**. **Who has
   access: Anyone**. Click **Deploy**.
3. **Authorize it.** Google will prompt for permissions (send mail as you,
   edit the sheet). Approve via **Advanced → Go to hold-receiver (unsafe)** —
   it's your own script.
4. **Copy the Web app URL** (looks like
   `https://script.google.com/macros/s/AKfyc.../exec`). That URL **is** your
   `HOLD_WEBHOOK_URL`.
5. **Set it on Vercel.** Project → **Settings → Environment Variables** → add
   `HOLD_WEBHOOK_URL` = the URL from step 4 (Production + Preview), then
   redeploy. Test the live form once; the email lands at
   hello@frontrowoc.com and the row appears in `Holds`.

**Updating the script later:** edit code → **Deploy → Manage deployments →
✏ edit → Version: New version → Deploy**. The URL stays the same.

**Notes**
- The site's API already strips the `company` honeypot field and bot traffic
  before forwarding — anything reaching this script is worth reading.
- MailApp quota is 100 recipients/day on a free account — far above gala
  inquiry volume.
- Apps Script answers POSTs with a 302 redirect; the site's API follows it,
  so no extra config is needed.
