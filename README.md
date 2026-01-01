# NIDRA AI

NIDRA AI is an advanced AI-powered dream analysis and therapeutic conversation platform designed to help users explore their subconscious mind.  
The project analyzes dream descriptions using large language models, symbolic interpretation, emotional analysis, and guided therapeutic conversations.

The system was first developed as a **basic AI engine in Google Colab** and later converted into a **full-stack web application** using modern web technologies.

---

## Project Overview

NIDRA AI allows users to:
- Describe their dreams using text or voice input
- Receive deep symbolic and emotional interpretations
- Understand recurring patterns, fears, and subconscious signals
- Engage in a guided, therapeutic-style conversation for self-reflection

The application focuses on introspection, emotional awareness, and personal growth using AI-driven insights.

---

## Development Approach & Evolution

### Phase 1: Core Engine Development (Google Colab)
- The project initially started in **Google Colab**
- A basic dream analysis engine was built using:
  - OpenAI API
  - Prompt engineering techniques
- Focus areas:
  - Accepting dream input
  - Structuring prompts for symbolic and emotional analysis
  - Generating meaningful interpretations using AI models

This phase allowed rapid experimentation and refinement of the core logic.

---

### Phase 2: AI Model Integration
The following OpenAI models and tools were integrated:

- **Whisper (Voice Recognition Model)**
  - Converts spoken dream descriptions into text
  - Enables voice-based interaction

- **GPT-4o Mini**
  - Used for:
    - Dream interpretation
    - Emotional analysis
    - Symbol extraction
    - Therapeutic conversation responses

- **Prompt Engineering**
  - Carefully designed prompts guide the AI to:
    - Interpret symbols (forest, snake, well, etc.)
    - Identify emotional themes (fear, anxiety, vulnerability)
    - Provide compassionate and reflective responses
    - Maintain a therapeutic and non-judgmental tone

---

### Phase 3: Web Application Conversion
- After finalizing the AI engine, the project was converted into a **web application**
- Technologies used:
  - **Next.js** for frontend and backend integration
  - **HTML** for structure
  - **Tailwind CSS** for modern and responsive UI
- This phase transformed NIDRA AI into a deployable, user-friendly platform

---

## Key Features

- Text-based dream input
- Voice-based dream input using Whisper
- Deep symbolic interpretation
- Emotional analysis of dreams
- Extracted parameters and themes
- Therapeutic AI chat assistant
- Clean and intuitive web interface
- Secure API key-based usage

---

## Technologies Used

| Technology | Purpose |
|---------|--------|
| Google Colab | Initial development and experimentation |
| OpenAI API | Core AI processing |
| Whisper | Voice recognition |
| GPT-4o Mini | Dream analysis and therapy responses |
| Prompt Engineering | Controlled and meaningful AI outputs |
| Next.js | Web application framework |
| HTML | Frontend structure |
| Tailwind CSS | Styling and UI |
| JavaScript | Application logic |

---

## Project Flow (How It Works)

### 1. User Input
- The user enters a dream description:
  - By typing text, or
  - By speaking (voice input)

### 2. Voice Processing (Optional)
- If voice input is used:
  - Whisper converts speech into text

### 3. Dream Analysis
- The text is sent to the OpenAI API
- GPT-4o Mini processes the input using carefully engineered prompts
- The system extracts:
  - Emotional themes
  - Symbolic meanings
  - Psychological patterns

### 4. Interpretation Output
- The user receives:
  - A detailed dream interpretation
  - Symbol meanings
  - Emotional intensity analysis

### 5. Dream Therapy Conversation
- The user can interact with the AI assistant
- The assistant guides reflection through compassionate, therapeutic dialogue

---

## How to Run

### Google Colab (Initial Engine)
1. Open the notebook in Google Colab
2. Install required dependencies
3. Add your OpenAI API key
4. Run all cells
5. Test dream analysis using text or voice input

---

### Web Application (Next.js)

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ## Team Members

### Project Lead / AI & Backend Development
**Sarthak Mokal**  
GitHub: https://github.com/sarthakmokal  
LinkedIn: https://www.linkedin.com/in/sarthak-mokal/

## How to Run (Web Application)

1. Add your OpenAI API key to the environment variables:
   ```env
   OPENAI_API_KEY=your_api_key_here

## API Key Requirement

To use NIDRA AI, users must provide their **own OpenAI API key**.

The API key is required for:
- Dream analysis
- Voice recognition
- Therapeutic conversation

The API key is never hardcoded and must be provided securely via environment variables.

---

## Notes & Limitations

- NIDRA AI is not a medical or clinical diagnostic tool
- Interpretations are AI-generated and intended for self-reflection only
- Emotional responses may vary depending on prompt context
- This project is intended for educational, exploratory, and personal insight purposes only

---

## Future Enhancements

- User accounts and dream history
- Multi-language support
- Improved emotion visualization
- Long-term pattern tracking
- Mobile-friendly optimization

---

## License

This project is licensed under the **MIT License**.

