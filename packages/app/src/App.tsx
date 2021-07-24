import Home from "pages/Home";
import Test from "pages/Test";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { home, auth } from "routes";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
