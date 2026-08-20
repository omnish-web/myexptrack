# Run the app on localhost (for magic link to work)

The magic link from Supabase redirects you to **http://localhost:3000**.  
If you see **"localhost refused to connect"**, it means nothing is running on port 3000. You need to **start a local web server** that serves your ReportPilot folder.

Use **one** of the options below. Keep the server running while you use the app and click the magic link.

---

## Option A: Python (if you have Python installed)

1. Open **PowerShell** or **Command Prompt**.
2. Go to your project folder:
   ```powershell
   cd "c:\Users\hp\Documents\ReportPilot"
   ```
3. Start a server on port 3000:
   ```powershell
   python -m http.server 3000
   ```
   If that fails, try:
   ```powershell
   py -m http.server 3000
   ```
4. Leave this window open. You should see something like: `Serving HTTP on :: port 3000`.
5. In your browser, open: **http://localhost:3000/ExpTracker-6.html**
6. When you click the magic link in your email, it will redirect to **http://localhost:3000/#access_token=...** — the server will serve `index.html`, which redirects to the app with the token so sign-in completes.

---

## Option B: VS Code Live Server (recommended if you use VS Code / Cursor)

1. Install the **Live Server** extension in Cursor/VS Code (search "Live Server" in Extensions).
2. **Right-click** on `ExpTracker-6.html` in the file explorer.
3. Click **"Open with Live Server"**.
4. The app will open in the browser. Live Server often uses port **5500** (e.g. `http://127.0.0.1:5500/ExpTracker-6.html`).

**Important:** If Live Server uses a different port (e.g. 5500), you must tell Supabase to redirect there:

1. Go to **Supabase Dashboard** → your project → **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add:
   - `http://127.0.0.1:5500/ExpTracker-6.html`
   - and/or `http://localhost:5500/ExpTracker-6.html`
   (use the exact URL you see in the browser when the app is open.)
3. Save. Then request a **new** magic link and click it — it should redirect to your app and sign you in.

---

## Option C: Node.js (if you have Node installed)

1. Open PowerShell in the project folder:
   ```powershell
   cd "c:\Users\hp\Documents\ReportPilot"
   ```
2. Run:
   ```powershell
   npx serve . -p 3000
   ```
3. Leave the window open. Open **http://localhost:3000/ExpTracker-6.html** in your browser.
4. The magic link (redirect to http://localhost:3000) will work.

---

## Summary

| What you see              | What to do                                      |
|---------------------------|-------------------------------------------------|
| "localhost refused to connect" | Start a local server (A, B, or C above).       |
| Magic link goes to port 3000   | Use Python or Node so something runs on 3000.  |
| Magic link goes to port 5500   | Use Live Server and add that URL in Supabase.  |

After the server is running, open the app from that URL, then sign in with email. When you click the magic link, the browser will load your app with the token and complete sign-in.
