import {JSX, useEffect, useState} from "react";
import {userStore} from "../../state/user-state";
import {User} from "../../models/user";
import './ConnectedUsers.css'

function ConnectedUsers(): JSX.Element {

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        userStore.subscribe(()=> {
            setUsers(userStore.getState().userList);
        })
    }, [])

    return (
        <div className="users-connected">
            <h1>Connected users</h1>
            <table className="users-connected-table">
                <thead>
                    <tr>
                        <th>Serial number</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.email}>
                            <td>{index + 1}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.roleId}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ConnectedUsers;
