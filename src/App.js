import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import CreateSurvey from "./components/CreateSurvey";
import EditSurvey from "./components/EditSurvey";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<CreateSurvey />} />
          <Route path="/surveys/:id" element={<EditSurvey />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
