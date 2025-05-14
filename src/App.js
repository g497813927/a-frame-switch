// import './App.css';

import XR from './XR';
import Start from './Start';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/vr_mode" element={<XR />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

