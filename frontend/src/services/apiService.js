// API Service for connecting to the backend
const API_URL = process.env.NODE_ENV === "production" 
  ? "https://ai-learning-engine.onrender.com"
  : "http://localhost:5000";

export const apiService = {
  // Upload PDF
  uploadPDF: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }
    
    return response.json();
  },

  // Ask question about PDF
  askQuestion: async (question) => {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Question failed");
    }
    
    return response.json();
  },

  // Generate Summary
  generateSummary: async () => {
    const response = await fetch(`${API_URL}/generate-summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Summary generation failed");
    }
    
    return response.json();
  },

  // Generate Quiz
  generateQuiz: async () => {
    const response = await fetch(`${API_URL}/generate-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Quiz generation failed");
    }
    
    return response.json();
  },

  // Generate Concept Graph
  generateConceptGraph: async () => {
    const response = await fetch(`${API_URL}/generate-concept-graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Graph generation failed");
    }
    
    return response.json();
  },

  // Generate Flashcards
  generateFlashcards: async () => {
    const response = await fetch(`${API_URL}/generate-flashcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Flashcard generation failed");
    }
    
    return response.json();
  },

  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_URL}/`);
    return response.ok;
  }
};
