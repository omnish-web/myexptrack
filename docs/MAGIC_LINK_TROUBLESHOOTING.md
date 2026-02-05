# Magic link not working – fix checklist

## 1. Fix Supabase Redirect URLs (important)

In **Supabase → Authentication → URL Configuration → Redirect URLs**:

- **Remove** any URL that contains **`#access_token=`** or the full magic link.  
  That is a one-time link; it must **not** be in the allow list.

- **Keep only** the **base** URL of your app, for example:  
  **`http://127.0.0.1:5500/ExpTracker-6.html`**

You should have **only one or two** entries here, e.g.:
- `http://127.0.0.1:5500/ExpTracker-6.html`
- (optional) `http://localhost:5500/ExpTracker-6.html` if you use that too

**Site URL** can stay as: `http://127.0.0.1:5500/ExpTracker-6.html`  
Click **Save changes**.

---

## 2. Live Server must be running when you click the link

The magic link opens: `http://127.0.0.1:5500/ExpTracker-6.html#access_token=...`

If nothing is serving that address, the browser will show **“Can’t connect”** or **“Connection refused”**.

**Do this every time you want to use the magic link:**

1. In Cursor, **right‑click** `ExpTracker-6.html` → **Open with Live Server**.
2. Leave that running (don’t stop the server).
3. In the browser tab that opened, enter your email and click **“Send magic link”**.
4. Open your email and **click the magic link**.
5. The link will open in the browser. As long as Live Server is still running, the app will load and sign you in.

If you closed Live Server before clicking the link, start it again (step 1), then request a **new** magic link and click that one.

---

## 3. Use the same URL you added in Supabase

- If your Redirect URL is `http://127.0.0.1:5500/ExpTracker-6.html`, open the app at that URL (via Live Server), then request the magic link.
- Don’t open the app by double‑clicking the file (`file:///...`). Always open it through Live Server so the address is `http://127.0.0.1:5500/...`.

---

## Summary

| Problem | Fix |
|--------|-----|
| Redirect URL has `#access_token=...` in the list | Remove it. Keep only the base URL like `http://127.0.0.1:5500/ExpTracker-6.html`. |
| “Connection refused” when clicking the link | Start Live Server first (Open with Live Server), then click the link. |
| Page loads but stays on “Sign in” | The app was updated to wait for the session from the hash. Try again with a **new** magic link after the fix. |

After fixing the Redirect URLs and ensuring Live Server is running when you click the link, request a **new** magic link and try again.
