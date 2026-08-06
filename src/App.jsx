
import { Routes, Route } from "react-router-dom";
import ToDoHome from "./Components/to-do-home";
import Register from "./Components/Register";
import UserLogin from "./Components/userlogin";
import { UserDashboard } from "./Components/UserDashboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ToDoHome />}>
          <Route index element={<UserLogin />} />
          <Route path="login" element={<UserLogin />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App