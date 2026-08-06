import { Link, Outlet } from "react-router-dom";

export default function ToDoHome() {
    return (
         <div className="bg-secondary min-vh-100 d-flex flex-column">
            <header className="bg-light border-bottom">
                <div className="container-fluid d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between px-3 py-3 gap-2">
                    <span className="fs-3 fw-bold text-primary bi bi-pencil-square"> <Link to='/' className="text-decoration-none">Task Manager</Link> </span>
                    
                    <div className="d-flex flex-row align-items-center gap-2 ms-md-auto w-auto">
                        <button className="btn btn-primary px-3 py-2"><Link to="/register" className="text-white text-decoration-none">Get Started</Link></button>
                    </div>
                </div>
            </header>
            <section className="flex-grow-1 p-3 p-md-5 bg-light">
                 <Outlet />
            </section>
        </div>
    )
}