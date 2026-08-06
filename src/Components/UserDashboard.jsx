import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react"
import { useCookies } from "react-cookie"
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AddToShare, SetSharedAppointments } from '../slicers/share-slicer.jsx';
import { shareAppointment, loadSharedAppointments } from '../services/shared-appointments.js';

export function UserDashboard(){

    const dispatch = useDispatch();
    const sharedAppointments = useSelector((state) => state.sharedAppointments);

    async function handleShareClick(appointment){
        const sharedAppointment = await shareAppointment(appointment, cookies['userid']);
        dispatch(AddToShare(sharedAppointment));
        alert('Appointment Shared');
    }

    const [cookies, setCookie, removeCookie] = useCookies(['userid']);

    const formik_add = useFormik({
        initialValues: {
            title: '',
            description:'',
            date: new Date(),
            user_id: cookies['userid']
        },
        onSubmit: (appointment)=>{
            axios.post('http://localhost:3000/appointments', appointment)
            .then(()=>{
                LoadAppointments();
            })

        }
    })


    const [appointments, setAppointments] = useState([{title:'', description:'', date:'', user_id:''}])
    const [editFormData, setEditFormData] = useState({id:'', title:'', description:'', date:'', user_id:''});
    const [deleteFormData, setDeleteFormData] = useState({id:'', title:'', description:'', date:'', user_id:''});
    const [searchString, setSearchString] = useState('');

    const formik_edit = useFormik({
        initialValues: {
            id: editFormData.id,
            title: editFormData.title,
            description: editFormData.description,
            date: editFormData.date,
            user_id: editFormData.user_id
        },
        onSubmit: (appointment)=>{
            axios.put(`http://localhost:3000/appointments/${appointment.id}`,appointment)
            .then(()=>{
                LoadAppointments();
            })
        },
        enableReinitialize:true
    })

    let navigate = useNavigate();

    function handleSignout(){
        removeCookie('userid');
        navigate('/');
    }

    

    const LoadAppointments = useCallback(()=>{
        axios.get(`http://localhost:3000/appointments`)
        .then(response=>{
            var filteredAppointments = response.data.filter(appointment=> appointment.user_id===cookies['userid']);
            setAppointments(filteredAppointments);
           
        })
    },[cookies])

    useEffect(()=>{
         LoadAppointments();
         loadSharedAppointments().then((shared) => {
            dispatch(SetSharedAppointments(shared));
         });
    }, [dispatch, LoadAppointments])

    const handleEditClick = useCallback((id)=>{
         axios.get(`http://localhost:3000/appointments/${id}`)
        .then(response=>{
            setEditFormData(response.data);
        })
    })

    const handleDeleteClick = useCallback((id)=>{
         axios.get(`http://localhost:3000/appointments/${id}`)
        .then(response=>{
            setDeleteFormData(response.data);
            
        })
    })

    function ConfirmDelete(id){
        axios.delete(`http://localhost:3000/appointments/${id}`)
        .then(()=>{
            LoadAppointments();
        })
    }

    const filteredAppointments = useMemo(()=>{
         return appointments.filter(appointment => appointment.title.toLowerCase().includes(searchString.toLowerCase()));
    },[searchString, appointments])

   const handleSearchChange = useCallback((e)=>{
        setSearchString(e.target.value);
   })

    return(
        <div className="row p-3 g-0 g-md-2">
            <div className="col-12 col-md-3 col-lg-2  p-3 me-md-2" style={{minHeight:'200px'}}>
                <div className="fs-3 fw-bold text-primary">Workspace</div>
                <div className="mb-2 mt-2 d-flex flex-column flex-md-row flex-md-wrap align-items-start gap-2">
                   <span className="bi bi-person-fill fs-5 text-primary"> {cookies['userid']} </span> 
                   <button onClick={handleSignout} className="btn btn-warning text-danger fs-6">Signout</button>
                </div> 
            </div>
            <div className="col-12 col-md-8 col-lg-9">
                <div className="d-flex flex-column flex-md-row p-2 justify-content-between gap-2">
                     <div className="w-100 w-md-auto">
                    <div className="input-group">
                        <input type="text" onChange={handleSearchChange} placeholder="search appointments" className="form-control" />
                        <button className="btn btn-warning bi bi-search"></button>
                    </div>
                 </div>
                 <div className="d-flex flex-wrap gap-2">
                   <button data-bs-toggle="offcanvas" data-bs-target="#shared" className="btn btn-warning position-relative"> <span className="bi bi-share"></span> Shared <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle">{sharedAppointments.length}</span> </button>
                   <div className="offcanvas offcanvas-end" id="shared">
                    <div className="offcanvas-header">
                        <h3>Shared Appointments</h3>
                        <button className="btn btn-close" data-bs-dismiss="offcanvas"></button>
                    </div>
                    <div className="offcanvas-body">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Shared By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sharedAppointments.map(appointment=><tr key={appointment.id ?? appointment.title}>

                                        <td>{appointment.title}</td>
                                        <td>{appointment.sharedBy ?? appointment.user_id}</td>
                                    </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                   </div>
                   <button data-bs-toggle="modal" data-bs-target="#addNew" className="btn btn-primary bi bi-plus-circle"> New Appointment </button>
                        <div className="modal fade" id="addNew">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                    <form onSubmit={formik_add.handleSubmit}>
                                        <div className="modal-header">
                                            <h3>Add New Appointment</h3>
                                        </div>
                                        <div className="modal-body">
                                           <dl>
                                             
                                                <dt>Title</dt>
                                                <dd><input type="text" onChange={formik_add.handleChange} name="title" className="form-control" /></dd>
                                                <dt>Description</dt>
                                                <dd>
                                                    <textarea rows={4} onChange={formik_add.handleChange} name="description" cols={40} className="form-control"></textarea>
                                                </dd>
                                                <dt>Date</dt>
                                                <dd>
                                                    <input type="date" onChange={formik_add.handleChange} name="date" className="form-control" />
                                                </dd>
                                            
                                           </dl>
                                        </div>
                                        <div className="modal-footer">
                                            <button data-bs-dismiss="modal" className="btn btn-primary mx-2">Add</button>
                                            <button data-bs-dismiss="modal" className="btn btn-warning">Cancel</button>
                                        </div>
                                    </form>
                                    </div>
                                </div>
                        </div>
                 </div>
                </div>

                <div className="mt-4">
                    <div className="table-responsive">
                    <table className="table table-hover caption-top">
                        <caption>Your Appointments</caption>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                              (filteredAppointments.length===0)?
                              <tr>
                                <td colSpan={4}> No Appointments Available</td>
                              </tr>
                              :
                                 filteredAppointments.map(appointment=>
                                    <tr key={appointment.title}>
                                        <td>{appointment.title}</td>
                                        <td>{appointment.description}</td>
                                        <td>{appointment.date}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-2">
                                            <button onClick={()=>{handleShareClick(appointment)}} className="btn btn-dark bi bi-share-fill"></button>
                                            <button onClick={()=>handleEditClick(appointment.id)} data-bs-target="#edit" data-bs-toggle="modal" className="btn btn-warning bi bi-pen-fill"></button>
                                                <div className="modal fade" id="edit">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                    <form onSubmit={formik_edit.handleSubmit}>
                                                        <div className="modal-header">
                                                            <h3>Edit Appointment</h3>
                                                        </div>
                                                        <div className="modal-body">
                                                          <dl>
                                                              
                                                                <dt>Title</dt>
                                                                <dd><input type="text" onChange={formik_edit.handleChange} name="title" value={formik_edit.values.title} className="form-control" /></dd>
                                                                <dt>Description</dt>
                                                                <dd>
                                                                    <textarea rows={4} onChange={formik_edit.handleChange} name="description" value={formik_edit.values.description}  cols={40} className="form-control"></textarea>
                                                                </dd>
                                                                <dt>Date</dt>
                                                                <dd>
                                                                    <input type="date" onChange={formik_edit.handleChange} name="date" value={formik_edit.values.date} className="form-control" />
                                                                </dd>
                                                            
                                                          </dl>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button data-bs-dismiss="modal" className="btn btn-success mx-2">Save</button>
                                                            <button data-bs-dismiss="modal" className="btn btn-warning">Cancel</button>
                                                        </div>
                                                    </form>
                                                    </div>
                                                </div>
                                                </div>
                                            
                                            <button onClick={()=>handleDeleteClick(appointment.id)} data-bs-target="#delete" data-bs-toggle="modal" className="btn btn-danger bi bi-trash"></button>
                                            <div className="modal fade" id="delete">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h2>Are you sure, want to delete?</h2>
                                                        </div>
                                                        <div className="modal-body">
                                                           {deleteFormData.title}
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button onClick={()=>ConfirmDelete(deleteFormData.id)}  data-bs-dismiss="modal" className="btn btn-danger">Yes</button>
                                                            <button data-bs-dismiss="modal" className="btn mx-2 btn-warning">No</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    )
}