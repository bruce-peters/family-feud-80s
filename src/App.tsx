import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from './routes/Landing';
import { Host } from './routes/Host';
import { BoardView } from './routes/BoardView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/host" element={<Host />} />
        <Route path="/board" element={<BoardView />} />
      </Routes>
    </BrowserRouter>
  );
}
