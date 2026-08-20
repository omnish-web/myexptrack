# Step 1: Create the database tables in Supabase

This is **Phase 1**. You’ll run a SQL script in Supabase so that your project has the same “sheets” as your app — but as real database tables.

**Before you start:** You must have finished **Step 0** (Supabase account, project created, Project URL and anon key saved).

---

## 1.1 Open the SQL Editor in Supabase

1. Go to **https://supabase.com** and sign in.
2. Open your **expense-tracker** (or whatever you named it) project.
3. In the **left sidebar**, click **“SQL Editor”** (icon that looks like `</>` or “SQL”).
4. Click **“New query”** so you have an empty editor.

---

## 1.2 Copy and run the schema script

1. On your computer, open the file:
   - **`ReportPilot/supabase/schema.sql`**
2. Select **all** the text in that file (Ctrl+A) and copy it (Ctrl+C).
3. In the Supabase SQL Editor, **paste** the full script (Ctrl+V).
4. Click **“Run”** (or press Ctrl+Enter).

You should see a message like **“Success. No rows returned”** (that’s normal — the script creates tables and doesn’t return data).

If you see any **red error message**, copy the full error text and we can fix it. Common issues:
- **“relation already exists”** — Tables were already created; that’s okay. You can skip to 1.3.
- **“permission denied”** — Make sure you’re in the correct project and ran the script in the SQL Editor (not in the Table Editor).

---

## 1.3 Confirm the tables exist

1. In the left sidebar, click **“Table Editor”**.
2. You should see these tables in the list:
   - **expenses**
   - **categories**
   - **sources**
   - **recurring**
   - **budgets**
   - **pending_transactions**
   - **balance_snapshots**

Click any table to see its columns. They will be empty until the app starts writing data.

---

## Checklist

- [ ] I opened the SQL Editor and ran `supabase/schema.sql`.
- [ ] The script ran without errors (or I noted any error to fix).
- [ ] I see all 7 tables in the Table Editor.

When all are done, **Phase 1** is complete.

**Next:** Phase 2 — we’ll add the Supabase client to your HTML and a “Test connection” button so the app can talk to Supabase. When you’re ready, say: **“I’ve run the schema, ready for Phase 2”**.
