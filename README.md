# Genify: Multilingual RAG based Startup Funding Intelligence
Genify is a multilingual RAG (Retrieval-Augmented Generation) intelligence platform designed specifically for the Indian startup ecosystem. By using the latest Gemini 3.0 Flash models and real-time Google Search Grounding, Genify provides founders, investors, and researchers with high-fidelity funding data, policy updates, and investor insights in 10 Indian languages.
# Problem Statement
The Indian startups are increasing day by day, but information needed for them are often fragmented, outdated, or found only in English interfaces. Due to this, regional entrepreneurs often face a "knowledge barrier" when learning about complex government schemes (Startup India) or identifying the right VCs.
# Our Solution: Genify
Genify becomes the companion of the regional entrepreneurs by:
Real-time Grounding: Every answer is cross-referenced with live web data (Inc42, YourStory, Entrackr).
Linguistic support: Supports 10 Indian languages - (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi) allowing users to prompt and query in their native tongue.
Voice mode: Integrated Web Speech API for seamless interaction.
Transparent Citations: Every results made by Genify is backed by clickable source links.
# Tech Stack
Frontend: React 19 (ESM-first architecture)
Styling: Tailwind CSS (Modern, minimalist UI/UX)
AI Engine: Google Gemini 3.0 Flash
Intelligence Tools: Google Search Grounding (RAG)
Voice: Web Speech API (Multilingual Recognition)
Deployment: Optimized for rapid cloud delivery
# Project Setup
Prerequisites
A Google AI Studio API Key.
A modern browser (Chrome/Edge recommended for Voice features).
Local Installation
Clone the repository:
code
Bash
git clone https://github.com/your-username/genify.git
cd genify
Environment Configuration:
The application requires an environment variable for the Gemini API.
code
Bash
# Set your API Key in your execution environment
export API_KEY='your_gemini_api_key_here'
Development:
Since the project uses an ESM module structure with index.html and index.tsx, you can serve the root directory using any local development server (e.g., Vite or simple live-server).
# Workflow
User Input: User submits a query via text or voice (e.g., "SaaS funding rounds in Bangalore this month").
Language Processing: Genify detects the session language and translates instructions for the LLM.
RAG Cycle:
Gemini receives the prompt.
The Google Search Tool is triggered to pull the latest 2024-2025 data.
Data is filtered for relevance and accuracy.
Response Generation: Gemini synthesizes the search results into a clean Markdown response in the user's selected Indic language.
UI Rendering: The response is displayed with high-fidelity formatting and verifiable source citations.
# Usage
All passioanate entrepreneurs can use Genify for:
Market Research: "Who are the top AgriTech investors in Maharashtra?"
Policy Navigation: "What are the latest tax exemptions for DPIIT recognized startups?"
Funding Alerts: "Show me the latest Series A rounds in the Fintech sector."
Multilingual Support: Switch between Hindi, Tamil, Telugu, and more using the language selector in the input bar.
and other startup and funding related queries.
# Specialities of Genify
Genify uses search grounding to ensure data is current. 
It has multilingual support with voice input.
It's built with a lightweight ESM architecture for better response.
# Future work
Dashboard Integration: Visualizing funding trends with real-time charts.
PDF Analyzer: Uploading PDFs to get feedback based on current market trends.
Investor Matching: AI-driven lead scoring for founders based on VC portfolios.

Developed by Genify team for AI verse hackathon-Anokha 26'.
