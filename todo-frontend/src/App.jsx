import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
        {/* Optional: Redirect from root to /Todo-App */}
        <Route path="/" element={<Navigate to="/Todo-App" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;