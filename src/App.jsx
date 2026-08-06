import { useLenis } from './hooks/useLenis';
import Home from './pages/Home';

export default function App() {
  useLenis();

  return <Home />;
}