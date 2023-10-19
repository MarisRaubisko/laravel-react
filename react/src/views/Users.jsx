import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import axiosClient from "../axios-client";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Users() {
    const [page, setPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const {setNotification} = useStateContext()

    useEffect(()=>{
        getUsers();
    }, [page])

    const getUsers = () => {
        setLoading(true);
        axiosClient.get(`/users?page=${page}`)
        .then(({data}) => {
            setLoading(false);
            setMaxPage(data.meta.last_page)
            setUsers(data.data);
        }).catch(()=>{
            setLoading(false);
        })
    }

    const paginator = (number) =>{
        if(page+number>1 && page+number<=maxPage){
            setPage(prev=>prev+=number)
        }
    }

    const onDelete = (user) => {
        if(!window.confirm(`Are you sure you want to delete ${user.name} profile?`)){
            return
        }
        
        axiosClient.delete(`/users/${user.id}`)
        .then(() => {
            setNotification('User was successfully deleted')
            getUsers();
        })
    }


    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <Link to={"/users/new"} className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading ? <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    </tbody>:
                    <tbody>
                    {users.map(user => (
                        <tr key={`${user.id}`}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.created_at}</td>
                            <td>
                                <Link to={`/users/${user.id}`} className="btn-edit">Edit</Link>
                                &nbsp;
                                <button onClick={ev => onDelete(user)} className="btn-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                    } 
                </table>
            </div>
            <div onClick={() => paginator(-1)}>Prev Page</div>
            <div onClick={() => paginator(1)}>Next Page</div>
        </div>
    )
}