# Step 0: Create Supabase account and get your keys

This is **Phase 0** — no code changes. You’ll create a free Supabase account and a project, then copy two values we’ll need later.

---

## 0.1 Create a Supabase account

1. Open your browser and go to: **https://supabase.com**
2. Click **“Start your project”** (or **“Sign in”** if you prefer to use GitHub).
3. Sign up with:
   - **GitHub**, or  
   - **Email** (they’ll send a link to confirm).

You don’t need a credit card. The free tier is enough for this app.

---

## 0.2 Create a new project and get your keys

After you’re signed in:

1. Click **“New Project”**.
2. Fill in:
   - **Name:** e.g. `expense-tracker` (anything you like).
   - **Database Password:**  
     - Choose a strong password and **save it somewhere safe** (e.g. a password manager).  
     - You’ll need it only for direct database access; the app will use the “anon” key, not this password.
   - **Region:** Pick one close to you (e.g. “East US” or “Southeast Asia”).
3. Click **“Create new project”**.
4. Wait 1–2 minutes until the project status is **“Active”** (you’ll see a green check or “Project is ready”).

Then get the two values we need:

5. In the left sidebar, click **“Project Settings”** (gear icon at the bottom).
6. In the left menu of Settings, click **“API”**.
7. On the API page you’ll see:
   - **Project URL**  
     Example: `https://abcdefghijk.supabase.co`  
     → Copy this and save it (e.g. in a text file in your ReportPilot folder, or a note).
   - **Project API keys**  
     - **anon public**  
       A long string like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`  
       → Copy this and save it next to the URL.

**Important:** The **anon public** key is safe to use in front-end code (browser). We’ll use Row Level Security so users only see their own data. Don’t share your **service_role** key; we won’t use it in the app.

---

## 0.3 Save the URL and anon key

Create a small file (only for your use; we’ll add it to `.gitignore` later so it’s not committed):

- In your `ReportPilot` folder you can create a file like `my-supabase-keys.txt` and put:

```text
Project URL: https://YOUR_PROJECT_REF.supabase.co
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace with your real URL and anon key.  
When we add the app config in Phase 2, we’ll put these same values there (or in a config file).

---

## Checklist

- [ ] I have a Supabase account.
- [ ] I created a new project and it’s **Active**.
- [ ] I copied and saved the **Project URL**.
- [ ] I copied and saved the **anon public** key.
- [ ] I stored my database password somewhere safe (optional for now; needed only for direct DB access).

When all are done, you’ve finished **Phase 0**.  
Next: **Phase 1** — create the database tables using [STEP_1_DATABASE.md](./STEP_1_DATABASE.md) and `supabase/schema.sql`.  
When you’re ready, say: **“I’ve got the Supabase keys”** and we’ll do Phase 1 step by step.
