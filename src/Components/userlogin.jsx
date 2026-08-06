import { Link , useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useCaptcha } from "../hooks/captcha";
export default function UserLogin(props) {
    const [cookies, setcookies, removecookies] = useCookies(['userid']);

    let captcha = useCaptcha();
    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            userid: '',
            password: '',
        },
        onSubmit: (user)=> {
            axios.get(`http://localhost:3000/users`)
            .then((response)=> {
                var result = response.data.find(u => u.userid === user.userid)
                if(result) {
                    if(result.password === user.password) {
                        setcookies( 'userid', user.userid)
                        navigate('/dashboard')
                    } else {
                        alert('Invalid password')
                    }
                } else {
                    alert('Invalid user id')
                }
            })
        }
    })
           return (
            <div>
                <form onSubmit={formik.handleSubmit} className={`${props.width} p-4 mx-auto`} style={{maxWidth: '320px'}}>
                    <h3 className={props.displaytitle}>User Login</h3>
                    <div className="mb-3">
                        <label className="form-label">Userid</label>
                        <input type="text" name="userid" onChange={formik.handleChange} className="form-control" style={{maxWidth: '320px'}}/>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" onChange={formik.handleChange} className="form-control" style={{maxWidth: '320px'}}/>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="mt-3">
                        <Link to="/register">New user? Register here</Link>
                    </div>
                </form>
            </div>
           )
                         
}