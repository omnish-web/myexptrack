# Pending transactions and partial receive

## 1. Pending with multiple destination accounts (splits)

When you log a **pending** transaction, you can:

- Set a **Deposit To** account (where the income will land).
- Add **transfer splits**: multiple destination accounts and amounts (e.g. ₹500 to Bank A, ₹300 to Bank B). The split amounts must add up to the total pending amount.

So the flow is: **Income → Deposit To account → then Transfers to each split account**.

---

## 2. Partial receive when the original had 2 (or more) accounts

If you do a **partial receive** on a pending item that has **multiple transfer destinations**:

1. **Income recorded**  
   The partial amount you receive is recorded as **Income** into the same **Deposit To** account. One income transaction is created for that amount.

2. **Pending amount reduced**  
   The pending item’s total amount is reduced by the received amount (e.g. ₹800 → you receive ₹400 → remaining pending ₹400).

3. **Splits scaled proportionally**  
   The **transfer splits** (the “to be sent to 2 different accounts” part) are **scaled down** so they match the new remaining amount:
   - Example: Original ₹800 with splits ₹500 to Bank A, ₹300 to Bank B.
   - After partial receive of ₹400, remaining is ₹400.
   - New splits: ₹250 to Bank A, ₹150 to Bank B (same 5:3 ratio).

4. **When you later approve the remainder**  
   When you **fully approve** the remaining pending amount, the app creates:
   - One **Income** transaction for the remaining amount (into Deposit To).
   - One **Transfer** per split for the scaled amounts (e.g. ₹250 to A, ₹150 to B).

So partial payment **does** adjust: the split amounts are recalculated so the remaining pending and its destinations stay in sync. You don’t have to re-enter splits after a partial receive.

---

## 3. Summary

| Action | What happens |
|--------|----------------|
| **Partial receive** | One Income (partial amount) to Deposit To; optional destination rows create Transfers; remaining pending and its splits are reduced proportionally. |
| **Full approve (remaining)** | One Income (remaining amount) to Deposit To; one Transfer per split for the (already scaled) amounts. |

The “2 different accounts” are updated automatically so the remaining pending reflects only what’s left to receive and to send to each account.
