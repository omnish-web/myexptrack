# Install Git on Windows

If you see **"git is not recognized"** in PowerShell, Git is not installed (or not in your PATH). Install it like this:

---

## 1. Download Git for Windows

1. Go to: **https://git-scm.com/download/win**
2. The download should start automatically (e.g. **Git-2.43.0-64-bit.exe** or similar). If not, click the download link for 64-bit Windows.

---

## 2. Run the installer

1. Double-click the downloaded `.exe`.
2. Click **Next** through the steps. You can leave the default options.
3. On **"Adjusting your PATH environment"** choose:
   - **Git from the command line and also from 3rd-party software** (recommended)
4. Click **Next** until **Install**, then finish.

---

## 3. Use a new PowerShell window

1. **Close** your current PowerShell window.
2. **Open a new** PowerShell (or Command Prompt).
3. Check that Git works:

   ```powershell
   git --version
   ```

   You should see something like `git version 2.43.0.windows.1`.

---

## 4. Set your name and email (one-time, for commits)

Git needs your name and email for each commit. Run (use your own name and email):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Use the same email as your GitHub account if you like.

---

## 5. Run the GitHub push steps again

From your project folder:

```powershell
cd "c:\Users\hp\Documents\ReportPilot"
git init
git add .
git commit -m "Initial commit - expense tracker with Supabase"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repository name.

When prompted for **password**, use a **GitHub Personal Access Token** (see `docs/GITHUB_NETLIFY_SETUP.md`).
