import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API_URL from "../services/api";
export default function Register() {

    const [usermsg, setusermsg] = useState('');
    const [errorclass, seterrorclass] = useState('text-danger');

    let navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            userid: '',
            username: '',
            password: '',
            email: '',
        },
        onSubmit: (user)=> {
            axios.post(`${API_URL}/users`, user)
            .then((response) => {
                alert('User registered successfully');
                navigate('/login');
            })
           
        }
    });

    function verifyUserId(e) {
        axios.get(`${API_URL}/users`)
        .then((response) => {
            var result = response.data.find(user => user.userid === e.target.value)
            if(result) {
                setusermsg('User id already exists');
                seterrorclass('text-danger');
            } else {
                setusermsg('User id available');
                seterrorclass('text-success');
                
            }
        })
    }

    return (
        <div className="d-flex justify-content-center px-3 py-4">
            <form onSubmit={formik.handleSubmit} className="p-3 p-md-4 mx-auto w-100" style={{maxWidth: '360px'}}>
                <dl>
                    <dt> Userid </dt>
                    <dd> <input type="text" name="userid" onBlur={verifyUserId} onChange={formik.handleChange} className="form-control" /> </dd>
                    <dd className={errorclass}> {usermsg} </dd>
                    <dt> Username </dt>
                    <dd> <input type="text" name="username" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt> Password </dt>
                    <dd> <input type="password" name="password" onChange={formik.handleChange} className="form-control" /> </dd>
                    <dt> Email </dt>
                    <dd> <input type="email" name="email" onChange={formik.handleChange} className="form-control" /> </dd>

                </dl>
                <button type="submit" className="btn btn-primary w-100">Register</button>
                <div className="mt-3">
                    <Link to="/login">Already registered? Login here</Link>
                </div>

            </form>
        </div>
    )
}