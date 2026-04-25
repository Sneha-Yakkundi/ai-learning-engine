import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import ConceptGraph from "./pages/ConceptGraph";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* App Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:docId" element={<Chat />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/graph" element={<ConceptGraph />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;