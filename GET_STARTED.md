
# 🚀 Getting Started Guide (Beginner Friendly)

Welcome! This guide will help you set up your **AL Paper Tracker** even if you've never coded before. Follow these 5 simple steps.

---

## 🛠 Step 1: Install the Tools
You need two things installed on your computer:
1. **Node.js**: Go to [nodejs.org](https://nodejs.org/) and download the **LTS** version. This is the "engine" that runs your app.
2. **VS Code**: Go to [code.visualstudio.com](https://code.visualstudio.com/) and install it. This is your "notebook" where you edit the code.

---

## 📂 Step 2: Set up your Project Folder
1. Create a new folder on your computer named `AL-Tracker`.
2. Open **VS Code**.
3. Go to `File > Open Folder` and select that `AL-Tracker` folder.
4. Copy all the files provided in the chat into this folder. (Ensure the file names match exactly, like `App.tsx`, `index.html`, etc.)

---

## 🔑 Step 3: Get your AI Key (Gemini)
The "AI Mentor" needs a key to work:
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **"Get API Key"**.
3. Create a new key and **copy it**.
4. **Important**: Keep this key safe.

---

## 💻 Step 4: Run it on your Computer
1. **Fix the API Key Error**: In VS Code, create a new file in your main folder named `.env` (it starts with a dot).
2. Inside that `.env` file, paste this line:
   ```text
   API_KEY=your_actual_key_here
   ```
   *(Replace `your_actual_key_here` with the long key you copied in Step 3)*.
3. Open the **Terminal** in VS Code (Press ``Ctrl + ` `` or go to `Terminal > New Terminal`).
4. Type this command and press Enter:
   ```bash
   npm install
   ```
5. Once finished, type this to start the app:
   ```bash
   npm run dev
   ```
6. Click the link (e.g., `http://localhost:5173`) to open your app!

---

## 🌐 Step 5: Put it on the Internet (GitHub)
To use this on your phone:
1. Create a [GitHub](https://github.com/) account.
2. Create a "New Repository" named `al-paper-tracker`.
3. Upload your files to GitHub (everything except the `.env` file).
4. **Add your Key to GitHub**:
   - In your GitHub Repo, go to **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `API_KEY`
   - Secret: (Paste your key from Step 3)
5. **Turn on the Website**:
   - Go to **Settings** > **Pages**.
   - Under "Source", select **GitHub Actions**.
   - Your app will be live in a few minutes!

---

## 💡 Quick Tips for A/L Success
- **Home Screen**: Open the link on your phone's browser, then select "Add to Home Screen" to use it like a real app.
- **Save Daily**: Make it a habit to log your papers right after your evening tea.
- **AI Help**: If the AI Mentor isn't giving advice, make sure you have logged at least one paper!

Good luck with your exams! You've got this. 🎓
