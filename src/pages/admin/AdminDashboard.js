import React, { useEffect, useState } from 'react'
import Admin from '../../assets/icons/user-setting.png';
import User from '../../assets/icons/user.png';
import Reseller from '../../assets/icons/social (1).png';

const AdminDashboard = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [resellerCount, setResellerCount] = useState(0);

  // Counter logic using useEffect
  useEffect(() => {
    const incrementCount = (target, setCount) => {
      let current = 0;
      const interval = setInterval(() => {
        current += 5; // Increment by 5
        if (current >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(current);
        }
      }, 50); // Update every 50ms
    };

    incrementCount(150, setAdminCount); // Admin's counter
    incrementCount(110, setUserCount); // User's counter
    incrementCount(100, setResellerCount); // Reseller's counter
  }, []);
  return (
    <>
      <div className='container flex justify-content-between align-items-center'>
        <div className="card mt-[85px]" style={{ width: '18rem' }}>
          <div className="card-body d-flex align-items-center">
            {/* Admin Icon */}
            <div className="me-3">
              <img src={Admin} alt="Admin" style={{ width: '40px', height: "auto" }} />
            </div>

            {/* Admin Text and Total Count */}
            <div>
              <h5 className="card-title">Admin</h5>
              <p className="card-text text-dark fs-4">{adminCount}</p>
            </div>
          </div>
        </div>
        <div className="card mt-[85px]" style={{ width: '18rem' }}>
          <div className="card-body d-flex align-items-center">
            {/* Admin Icon */}
            <div className="me-3">
              <img src={User} alt="Admin" style={{ width: '40px', height: "auto" }} />
            </div>

            {/* Admin Text and Total Count */}
            <div>
              <h5 className="card-title">User</h5>
              <p className="card-text text-dark fs-4">{userCount}</p>
            </div>
          </div>
        </div>
        <div className="card mt-[85px]" style={{ width: '18rem' }}>
          <div className="card-body d-flex align-items-center">
            {/* Admin Icon */}
            <div className="me-3">
              <img src={Reseller} alt="Admin" style={{ width: '40px', height: "auto" }} />
            </div>

            {/* Admin Text and Total Count */}
            <div>
              <h5 className="card-title">Reseller</h5>
              <p className="card-text text-dark fs-4">{resellerCount}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard