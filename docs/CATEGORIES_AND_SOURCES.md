# Categories and sources – behaviour

## 1. Adding a parent category

When you add a **parent category** (e.g. "Vacation"), the app automatically creates one **sub-category** with the **same name** ("Vacation") under that parent.

- **Why:** The UI needs at least one sub under a parent so the category can appear in dropdowns (e.g. when entering a transaction). Without that, the parent would never be selectable until you add a sub manually.
- **What you can do:** You can leave "Vacation" as the only sub, or add more subs (e.g. "Flight", "Hotel") and use "Vacation" as a generic option. You can also rename or delete the same-name sub in Settings if you prefer.

If you’d rather have a parent with **no** default sub (and add subs only when you want), the app can be changed to do that; say if you want this.

---

## 2. Source types

When adding a **source** (account), you can choose:

- **Bank**
- **Cash**
- **Wallet**
- **Card** (e.g. credit/debit card)

"Card" is treated like other non-cash sources: it appears in **Cashless** mode dropdowns (transfer source, split source, etc.) and not in **Cash** mode.

---

## 3. Opening / initial balance for sources

- **When adding a source:** Use the **"Opening ₹"** field to set the current/opening balance for that account. This is the balance the app assumes **before** any transactions you enter.
- **After adding:** In **Settings → Sources**, each source has an **Opening** input. Change the value and move focus (or press Enter) to save. Balances in the header ticker are computed from snapshot + transactions; the opening value is the starting point when there is no snapshot (or for that source in the snapshot).

If you already have balances in real accounts, set each source’s opening (or create a **balance snapshot**) so the app’s numbers match reality.
