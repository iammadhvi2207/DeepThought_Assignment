<h1 align="center">🧠 Trinethra Module – Supervisor Feedback Analyzer</h1>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?lines=AI-Powered+Feedback+Analysis;Built+with+Next.js+and+LLMs;Transforming+Qualitative+Insights+into+Structured+Evaluation&center=true&width=700&height=45">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-FullStack-black?style=for-the-badge">
  <img src="https://img.shields.io/badge/Groq-LLM_API-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Internship-Assignment-green?style=for-the-badge">
</p>

---

## 📌 About the Project

The **Trinethra Module – Supervisor Feedback Analyzer** is a full-stack AI-powered web application developed as part of the **DeepThought Software Developer Internship Assignment**.

This application analyzes supervisor feedback transcripts related to **DeepThought Fellows** using Large Language Models through the **Groq Cloud API**. The system transforms unstructured qualitative assessments into structured evaluations aligned with the **DeepThought Rubric** and key performance indicators (KPIs).

The goal of the platform is to automate feedback interpretation, improve consistency in evaluation, and provide meaningful insights from supervisor conversations in a scalable and efficient way.

---

## Setup Instructions

**Prerequisites:** You need Node.js installed.
*Note: Since the original assignment requested Ollama but the user prompt requested Groq Cloud API, this application connects to Groq. You will need a Groq API Key.*

1. **Clone the repository** (if not already done) and navigate to the project directory:
   ```bash
   cd trinethra-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open `http://localhost:3000` in your web browser.

5. **Run an Analysis**:
   - Paste your Groq API Key into the "Groq API Key" input field in the top right of the navigation bar.
   - Click one of the "Sample" buttons above the text area to load a transcript or paste your own.
   - Click "Run Analysis" to get the structured evaluation.

## LLM Model Used

**Model: `llama3-70b-8192` (via Groq Cloud API)**
*Why:* LLaMA 3 70B is an incredibly powerful open-weight model that rivals proprietary models in instruction following and reasoning. Groq's LPU architecture provides extremely fast inference. I chose this model because it handles complex system prompts and strictly adheres to structured JSON schema output, which is crucial for reliably extracting evidence, mapping KPIs, and scoring based on the rubric without formatting errors.

## Architecture Overview

This project is built using **Next.js (App Router)** and **Tailwind CSS**.
- **Frontend (`app/page.js`)**: A responsive React interface that allows users to input the transcript and provide their Groq API Key securely. It has a stateful architecture managing the loading states and the presentation of the complex structured data.
- **Backend API (`app/api/analyze/route.js`)**: A secure serverless route that receives the transcript and API Key, dynamically loads the `rubric.json` context, constructs a robust system prompt, and calls the Groq API. It enforces JSON mode and returns the structured data back to the frontend.

## Design Challenges Tackled

### Challenge 1: One Prompt or Many?
I chose the **One Prompt** approach. Given the advanced instruction-following capabilities of `llama3-70b`, making a single comprehensive prompt that enforces a strict JSON schema is highly efficient. By providing the rubric directly in the prompt and requesting all sections (Score, Evidence, KPIs, Gaps, Questions) simultaneously, the model maintains a cohesive understanding of the transcript and reduces the latency and cost of multiple API calls.

### Challenge 2: Structured Output Reliability
To ensure the LLM returns clean, parsable JSON, I utilized Groq's `response_format: { type: 'json_object' }` configuration. Furthermore, the prompt explicitly defines the exact JSON schema it must adhere to. The backend API handles the parsing and gracefully catches any errors, passing meaningful error messages to the frontend if something fails.

## Future Improvements (With More Time)

1. **Highlighting Evidence in the Transcript**: I would add an interactive feature where clicking an extracted quote in the analysis highlights the corresponding text in the original transcript view. This would make it much easier for the intern to verify the AI's extraction in context.
2. **Editable Draft Mode**: Instead of just displaying the analysis, I would make the output fields (like Score Justification and Evidence Interpretations) editable input fields so the psychology intern can make tweaks, fix the score if needed, and click a "Finalize & Save" button to push it to a database.
3. **Database Integration**: Set up MongoDB/Prisma to store the processed analyses tied to Fellow IDs and client data.
