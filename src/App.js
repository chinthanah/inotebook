import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import Navbar from "./components/Navbar";
import About from "./components/About";
import NotesState from "./context/notes/NotesState";
import { Alert } from "./components/Alert";

function App() {
  return (
    <>
      <NotesState>
        <Router>
          <Navbar />
          <Alert message="This is a best react course" />
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </NotesState>
    </>
  );
}

export default App;
