-- ========================================
-- Expense Tracker - Supabase Schema
-- ========================================
-- Run this in Supabase Dashboard → SQL Editor → New query.
-- Paste the whole file and click "Run".

-- Enable UUID extension (Supabase usually has it; safe to run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. EXPENSES (replaces Google Sheet "Expenses")
-- Columns: id, date, type, sub, parent, amount, mode, source, remarks
-- ========================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type TEXT NOT NULL,          -- Expense, Income, Transfer
  sub TEXT,                    -- sub category
  parent TEXT,                 -- parent category
  amount NUMERIC NOT NULL,
  mode TEXT,                   -- Cashless, Cash
  source TEXT,                 -- account/source or "Source: Amt | ..."
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);

-- ========================================
-- 2. CATEGORIES (replaces Sheet "Categories")
-- Stored as: one row per sub-category under a parent
-- ========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent TEXT NOT NULL,        -- e.g. "Utility", "Grocery"
  sub TEXT NOT NULL,           -- e.g. "Electricity", "Vegetables"
  UNIQUE(user_id, parent, sub)
);

CREATE INDEX IF NOT EXISTS idx_categories_user ON public.categories(user_id);

-- ========================================
-- 3. SOURCES (replaces Sheet "Source")
-- Columns: Source, Type, Opening, Stmt, Due, Link, Fav, Def
-- ========================================
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  type TEXT DEFAULT 'Bank',
  opening NUMERIC DEFAULT 0,
  stmt TEXT,
  due TEXT,
  link TEXT,
  fav BOOLEAN DEFAULT false,
  def BOOLEAN DEFAULT false,
  UNIQUE(user_id, source_name)
);

CREATE INDEX IF NOT EXISTS idx_sources_user ON public.sources(user_id);

-- ========================================
-- 4. RECURRING / SCHEDULED (replaces Sheet "Recurring")
-- ID, Freq, Date, End, Type, Sub, Parent, Amt, Mode, Src, Rem
-- ========================================
CREATE TABLE IF NOT EXISTS public.recurring (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL,     -- Daily, Weekly, Monthly, etc.
  start_date DATE NOT NULL,
  end_date DATE,
  type TEXT NOT NULL,
  sub TEXT,
  parent TEXT,
  amount NUMERIC NOT NULL,
  mode TEXT,
  source TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recurring_user ON public.recurring(user_id);

-- ========================================
-- 5. BUDGETS (replaces Sheet "Budgets")
-- Key format in app: "Category#YYYY-MM", value: limit
-- ========================================
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_key TEXT NOT NULL,  -- e.g. "Grocery#2025-02"
  limit_amount NUMERIC NOT NULL,
  UNIQUE(user_id, category_key)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user ON public.budgets(user_id);

-- ========================================
-- 6. PENDING TRANSACTIONS (replaces Sheet "Pending_Transactions")
-- ========================================
CREATE TABLE IF NOT EXISTS public.pending_transactions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date_created TIMESTAMPTZ DEFAULT now(),
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  expected_date DATE NOT NULL,
  income_category TEXT,
  income_sub_category TEXT,
  income_account TEXT,
  transfer_account TEXT,
  transfer_category TEXT,
  transfer_sub_category TEXT,
  status TEXT DEFAULT 'Pending'
);

CREATE INDEX IF NOT EXISTS idx_pending_user ON public.pending_transactions(user_id);

-- ========================================
-- 7. BALANCE SNAPSHOTS (replaces Sheet "Balance_Snapshots")
-- ========================================
CREATE TABLE IF NOT EXISTS public.balance_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  balances_json JSONB NOT NULL,  -- e.g. {"Bank1": 1000, "Cash": 500}
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_balance_snapshots_user ON public.balance_snapshots(user_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only see and edit their own rows.
-- ========================================
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balance_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies: allow all operations only when user_id = auth.uid()
CREATE POLICY "Users can do all on own expenses"
  ON public.expenses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own categories"
  ON public.categories FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own sources"
  ON public.sources FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own recurring"
  ON public.recurring FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own budgets"
  ON public.budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own pending_transactions"
  ON public.pending_transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can do all on own balance_snapshots"
  ON public.balance_snapshots FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Optional: trigger to set updated_at on expenses and recurring
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS expenses_updated_at ON public.expenses;
CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS recurring_updated_at ON public.recurring;
CREATE TRIGGER recurring_updated_at
  BEFORE UPDATE ON public.recurring
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
