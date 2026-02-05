# 🎓 AL Paper & MCQ Platform

A focused dashboard for Sri Lankan A/L students. Track paper progress, manage goals, and create **interactive Sinhala MCQs** from Physics and Chemistry papers.

## 🚀 Features
- **Daily Paper Log**: Track Physics, Chemistry, and Maths paper progress.
- **Sinhala MCQ Studio**: Generate interactive MCQ quizzes for Physics/Chemistry using pasted paper text.
- **Quiz Review Mode**: Submit answers, get instant score, and read Sinhala explanations.
- **Analytics + Goals**: Measure trends and complete weekly/monthly targets.
- **AI Mentor**: Receive strategic study suggestions via Gemini.

## 🧪 Local Development
```bash
npm install
npm run dev
```

If you want Gemini-powered generation/advice locally, create `.env`:
```bash
API_KEY=your_google_ai_api_key
```

## 🌐 Hosting (GitHub Pages)
This repo is configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys on every push to `main`.

### Steps
1. Push this project to a GitHub repository.
2. In GitHub, open **Settings → Pages** and set **Source = GitHub Actions**.
3. In GitHub, open **Settings → Secrets and variables → Actions**.
4. Add a repository secret:
   - **Name:** `API_KEY`
   - **Value:** your Google AI key.
5. Push to `main` (or run workflow manually from Actions tab).
6. Wait for the **Deploy to GitHub Pages** workflow to finish.

Your site URL will appear in the workflow output under the deploy step.

## 📝 License
MIT License.
