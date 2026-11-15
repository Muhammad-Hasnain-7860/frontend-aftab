import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => navigate("/auth")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Go to Auth
      </button>
    </div>
  );
}

export default App;