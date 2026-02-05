# Phase 5 complete: Saving to Supabase

All create, update, and delete operations now go to **Supabase** when you're signed in (running the app via Live Server with your Supabase keys set).

---

## What works with Supabase now

| Feature | Action |
|--------|--------|
| **Entry** | Save single transaction (Expense / Income / Transfer), edit, delete, undo |
| **Bulk entry** | Save multiple transactions at once |
| **Reports** | Bulk delete, bulk reclassify category, load archived year |
| **Scheduled** | Create and edit recurring schedules, delete schedule |
| **Budgets** | Set category limit, delete budget |
| **Pending** | Add receivable, edit, delete, approve (logs to expenses and clears pending) |
| **Snapshot** | Create balance snapshot (then reload uses snapshot + delta) |
| **Settings** | Add/rename/delete parent category, add/delete/reclassify sub-category, add/delete source, set favourite/default source |

When you're **not** signed in with Supabase (or Supabase URL/key are empty), the app still tries to use **Google Apps Script** for these actions if it’s running in that environment.

---

## How to try it

1. Open the app with **Live Server** and sign in with your magic link.
2. **Settings:** Add a **parent category** (e.g. "Grocery") and a **sub-category** under it. Add a **source** (e.g. "Bank").
3. **Entry:** Add an expense with date, amount, category, and source → **Save**. It should appear in the table and in Session Log.
4. **Reports:** Open the report, select a transaction, delete it (or use bulk delete / bulk reclassify).
5. **Budgets:** Set a budget for a category. **Scheduled:** Add a recurring schedule.
6. **Pending:** Add a pending receivable, then approve it and confirm it appears in expenses.

If any action shows an error (e.g. "Failed" or a Supabase message), note the exact message and we can fix that next.

---

## Next (optional)

- **Phase 6:** Local-first with IndexedDB + sync (faster UI, offline support).
- **Phase 7:** Remove Google completely and add “Import from Google Sheets (CSV)” in Settings.

You can keep using the app as-is with Supabase; Phases 6 and 7 are optional improvements.
