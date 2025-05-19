import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // ✅ FIXED import
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/TodoStyles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/Todo-App" element={<TodoList />} />
        <Route path="/" element={<Navigate to="/Todo-App" replace />} /> {/* ✅ Redirect works now */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
