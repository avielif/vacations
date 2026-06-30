import {JSX, useEffect, useState} from "react";
import {userStore} from "../../state/user-state";
import {User} from "../../models/user";
import './ConnectedUsers.css'
import {userSocketService} from "../../services/user-socket-service";
import {socketService} from "../../services/socket-service";
import {RoleId} from "../../models/enums";

function ConnectedUsers(): JSX.Element {

    const [users, setUsers] = useState<User[]>(userStore.getState().userList);
    console.log(userStore.getState().userList);

    useEffect(() => {
        socketService.connect(); // ensure socket exists
        userSocketService.getUsersConnected();
        const unsubscribe = userStore.subscribe(()=> {
            setUsers(userStore.getState().userList);
        });
        return () => unsubscribe();
    }, [])

    return (
        <div className="users-connected">
            <h1>Connected users</h1>
            <table className="users-connected-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {[...users].sort((a, b) => a.id! - b.id!).map((user, index) => (
                        <tr key={user.email}>
                            <td>{index + 1}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.roleId === RoleId.Admin ? "Admin" : user.roleId === RoleId.User ? "User" : null}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ConnectedUsers;
