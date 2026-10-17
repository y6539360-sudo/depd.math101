import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';
import './src/index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
