# AI Learning Engine

A full-stack web application that helps users learn by uploading PDF documents and generating interactive learning materials including summaries, concept graphs, flashcards, and quizzes.

## Features

- 📄 **PDF Upload**: Upload PDF files for analysis
- 📝 **Summaries**: AI-generated summaries of document content
- 🧠 **Concept Graphs**: Visual representation of concepts and their relationships
- 🎴 **Flashcards**: Auto-generated flashcards for study
- 🧪 **Quizzes**: Interactive quizzes to test knowledge
- 💬 **Chat Interface**: Conversational AI chat about document content

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PDF Processing**: pdf-parse, pdf-lib, pdf2json, pdfjs-dist
- **API Integration**: Axios with OpenRouter API
- **File Upload**: Multer
- **CORS**: Enabled for frontend communication

### Frontend
- **React 19** with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenRouter API key

### Environment Setup

1. **Backend Configuration**:
   - Copy `.env.example` to `.env`
   - Add your OpenRouter API key:
     ```
     OPENROUTER_API_KEY=your_api_key_here
     ```

2. **Install Dependencies**:
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

### Running the Application

**Terminal 1 - Backend** (runs on `http://localhost:5000`):
```bash
cd backend
npm start
```

**Terminal 2 - Frontend** (runs on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Project Structure

```
├── backend/
│   ├── server.js          # Express server
│   ├── package.json
│   ├── .env               # Environment variables (not committed)
│   ├── .env.example       # Template for .env
│   └── uploads/           # User-uploaded files
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

- `GET /` - Health check
- `POST /upload` - Upload and process PDF
- `POST /chat` - Chat with the AI about document content
- Additional endpoints for flashcards, quizzes, etc.

## Development

- **Linting**: `npm run lint` (frontend)
- **Build**: `npm run build` (frontend)
- **Preview**: `npm run preview` (frontend)

## License

ISC
