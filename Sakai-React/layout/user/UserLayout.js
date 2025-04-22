// import React from "react";
// import AppHeaderUser from "./AppHeaderUser"; // Header dành cho User
// import AppFooterUser from "./AppFooterUser"; // Footer dùng chung

// const UserLayout = ({ children }) => {
//     return (
        
//         <div id="container">
//             <AppHeaderUser />
//             <main className="user-content">{children}</main>
//             <AppFooterUser />
//         </div>

//     );
// };

// export default UserLayout;

// layout/user/UserLayout.js
import React from 'react';
import AppHeaderUser from "./AppHeaderUser"; // Header dành cho User
import AppFooterUser from "./AppFooterUser"; // Footer dùng chung

const UserLayout = (props) => {
    return (
        <div id = "user-body">
            <div  id="user-container">
                <AppHeaderUser />
                <div >
                    {props.children}
                </div>
                <AppFooterUser />
            </div>
        </div>
    );
};

export default UserLayout;
