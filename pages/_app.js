import "@/styles/globals.css";
import Chatbot from '../components/Chatbot';

function App({ Component, pageProps }) {
  return (
    <div>
      <Chatbot />
      <Component {...pageProps} />
    </div>
  );
}

export default App;