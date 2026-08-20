# Password reset and “knowing” the password

## How to reset your password

1. On the sign-in screen, click **“Forgot password?”**.
2. Enter your **email** and click **“Send reset link”**.
3. Check your email and open the **password reset link** (from Supabase).
4. You’ll be taken back to the app. Enter a **new password** twice and click **“Set new password”**.
5. You’re signed in with the new password.

**Note:** The reset link must open in the same environment you use for the app (e.g. `http://localhost:3000/` if you run the app there). Add that URL in Supabase → **Authentication** → **URL Configuration** → **Redirect URLs** if it’s not already there.

---

## Can you see or get the password from the backend?

**No.** Passwords are **not stored in plain text**. They are hashed (one-way) in Supabase (and in any secure backend). Nobody—including you or Supabase—can “look up” or “retrieve” the original password. The only way to use the account again if you forgot the password is to **reset** it (forgot password flow above) and set a new one.
