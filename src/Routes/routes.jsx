import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import UserLogin from "../Components/userlogin";
import ToDoHome from "../Components/to-do-home";
import Register from "../Components/Register";
import { UserDashboard } from "../Components/UserDashboard";

const router = createBrowserRouter([
    {
        path: '*',
        element: <App />,
        children: [
            {
                index: true,
                element: <ToDoHome />
            },
            {
                path: 'login',
                element: <UserLogin width='w-25' displayTitle='d-block' />
            },
            {
                path: 'register',
                element: <Register />
            }
        ]
    },
    {
        path: 'dashboard',
        element: <UserDashboard />
    }
])

export default router;