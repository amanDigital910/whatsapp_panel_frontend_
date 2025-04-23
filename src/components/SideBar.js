import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import creditCardIcon from '../assets/icons/credit-card.png';
import dashboardIcon from '../assets/icons/dashboard.png';
import home from '../assets/icons/home.png';
import world from '../assets/icons/world.png';
import exchange from '../assets/icons/exchange.png';
import groupIcon from '../assets/icons/group.png';
import menuIcon from '../assets/icons/paragraph.png';
import templateIcon from '../assets/icons/template.png';
import UserIcon from '../assets/icons/user1.png';
import whatsappIcon from '../assets/icons/whatsapp.png';
import userImage from '../assets/profile.png';
import bulkicon from '../assets/icons/wp bulk.png'
// import logout from '../assets/icons/logout (1).png'
const SideBar = () => {
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData); // Parse the JSON string
      setUserData(parsedData.user); // Set the user object in state
    } else {
      console.log("No user data found in local storage.");
    }
  }, []);

  const handleDropdownClick = (event) => {
    event.stopPropagation();
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login")
  }

  const sidebarMenu = [
    {
      label: "Admin Dashboard",
      to: "/AdminDashboard",
      icon: dashboardIcon
    },
    {
      label: "Transaction Logs",
      to: "/Transitiontable",
      icon: dashboardIcon
    },
    {
      label: "Dashboard",
      to: "/Dashboard",
      icon: home
    },
    {
      label: "Wa Virtual",
      icon: whatsappIcon,
      dropdown: [
        { label: "Quick Campaign", to: "/user/virtualcampaign" },
        { label: "DP Campaign", to: "/user/dpcampaign" },
        { label: "Button Campaign", to: "/user/buttoncampaign" },
        { label: "CSV Campaign", to: "/user/csvvirtual" },
        { label: "WhatsApp Report", to: "/user/whatsappreport" }
      ]
    },
    {
      label: "Wa Personal",
      icon: whatsappIcon,
      dropdown: [
        { label: "Quick Campaign", to: "/personal/campaign" },
        { label: "Button Campaign", to: "/personal/button" },
        { label: "Personal Csv Campaign", to: "/personal/PersonalCsv" },
        { label: "Poll Campaign", to: "/personal/poll/campaign" },
        { label: "WhatsApp Report", to: "/personal/report" },
        { label: "WhatsApp Scan", to: "/personal/scan" }
      ]
    },
    {
      label: "Wa Int. Virtual",
      icon: world,
      dropdown: [
        { label: "Quick Campaign", to: "/international/campaign" },
        { label: "CSV Campaign", to: "/international/csvcampaign" },
        { label: "Button Campaign", to: "/international/buttoncampaign" },
        { label: "Whatsapp Reports", to: "/international/whatsappreport" }
      ]
    },
    {
      label: "Wa Int. Personal",
      icon: exchange,
      dropdown: [
        { label: "Quick Campaign", to: "/international/personal/campaign" },
        { label: "Csv Campaign", to: "/international/personal/csvcampaign" },
        { label: "Button Campaign", to: "/international/personal/buttoncampaign" },
        { label: "Poll Campaign", to: "/international/personal/pollcampaign" },
        { label: "Whatsapp Reports", to: "/international/personal/report" },
        { label: "Whatsapp Scan", to: "/international/personal/scan" }
      ]
    },
    {
      label: "Group",
      to: "/group",
      icon: groupIcon
    },
    {
      label: "Template",
      to: "/template",
      icon: templateIcon
    },
    {
      label: "Manage User",
      to: "/manageuser",
      icon: UserIcon
    },
    {
      label: "Manage Credit",
      to: "/managecredit",
      icon: creditCardIcon
    }
  ];

  return (
    <nav className="navbar navbar-light fixed-top" style={{ backgroundColor: "#133E87" }}>
      <div className="container-fluid">
        <div className='d-flex'>
          <img src={menuIcon} alt="User Image" className="navbar-toggler text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" />
          <img src={bulkicon} alt="icon" width="40px" className='ms-3'/>
          <a className="navbar-brand text-white ps-4" href="#">Whatsapp Bulk Marketing</a>
        </div>
        <a className="navbar-brand text-white" href="#"><img src={userImage} alt="User Profile" width={50} height={20} /></a>

        <div className={`offcanvas offcanvas-start `} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel" style={{ width: "300px", background: "#133E87" }}>
          <div className="offcanvas-header">
            <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">{userData ? userData.userName : ""}</h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body text-white">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3" >
              <li className="nav-item">
                <Link className="nav-link text-white d-flex" aria-current="page" to="/AdminDashboard">
                  <img src={dashboardIcon} width={20} height={20} />
                  <span className="ms-2">Admin Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white d-flex" aria-current="page" to="/Transitiontable">
                  <img src={dashboardIcon} width={20} height={20} />
                  <span className="ms-2">Transaction Logs</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white d-flex" aria-current="page" to="/Dashboard">
                  <img src={home} width={20} height={20} />
                  <span className="ms-2">Dashboard</span>
                </Link>
              </li>
              {/* Whatsapp Virtual */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" id="virtualDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={whatsappIcon} width={24} height={24} />
                  <span className="ms-2">Wa Virtual </span>
                </a>
                <ul className="dropdown-menu " aria-labelledby="virtualDropdown" style={{ backgroundColor: "#133E87" }} onClick={handleDropdownClick} >
                  <li>
                    <Link to="/user/virtualcampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Quick Campaign</Link>
                  </li>
                  <li><Link to="/user/dpcampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>DP Campaign</Link></li>
                  <li><Link to="/user/buttoncampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Button Campaign</Link></li>
                  <li><Link to="/user/csvvirtual" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>CSV Campaign</Link></li>
                  <li><Link to="/user/whatsappreport" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>WhatsApp Report</Link></li>
                </ul>
              </li>
              {/* whatsapp personal  */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" id="personalDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={whatsappIcon} width={24} height={24} />
                  <span className="ms-2">Wa Personal</span>
                </a>
                <ul className="dropdown-menu " aria-labelledby="personalDropdown" style={{ backgroundColor: "#133E87" }} onClick={handleDropdownClick} >
                  <li><Link to="/personal/campaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Quick Campaign</Link></li>
                  <li><Link to="/personal/button" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Button Campaign</Link></li>
                  <li><Link to="/personal/PersonalCsv" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Personal Csv Campaign</Link></li>
                  {/* <li><Link to="/personal/Personalbutton" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Personal Button Campaign</Link></li> */}
                  <li><Link to="/personal/poll/campaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Poll Campaign</Link></li>
                  <li><Link to="/personal/report" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>WhatsApp Report</Link></li>
                  <li><Link to="/personal/scan" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>WhatsApp Scan</Link></li>
                  {/* <li><Link to="/personal/channel" className="dropdown-item text-white " style={{backgroundColor:"#133E87"}}>WhatsApp Channel</Link></li> */}
                  {/* <li><Link to="/personal/community" className="dropdown-item text-white " style={{backgroundColor:"#133E87"}}>WhatsApp Community</Link></li> */}
                </ul>
              </li>
              {/* whatsapp Int virtual */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" id="internationalDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={world} width={24} height={24} />
                  <span className="ms-2 text-white">Wa Int. Virtual</span>
                </a>
                <ul className="dropdown-menu " aria-labelledby="internationalDropdown" style={{ backgroundColor: "#133E87" }} onClick={handleDropdownClick} >
                  <li><Link to="/international/campaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Quick Campaign</Link></li>
                  <li><Link to="/international/csvcampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>CSV Campaign</Link></li>
                  <li><Link to="/international/buttoncampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Button Campaign</Link></li>
                  <li><Link to="/international/whatsappreport" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Whatsapp Reports</Link></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" id="internationalDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={exchange} width={24} height={24} />
                  <span className="ms-2 text-white">Wa Int. Personal</span>
                </a>
                <ul className="dropdown-menu " aria-labelledby="internationalDropdown2" style={{ backgroundColor: "#133E87" }} onClick={handleDropdownClick} >
                  <li><Link to="/international/personal/campaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Quick Campaign</Link></li>
                  <li><Link to="/international/personal/csvcampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Csv Campaign</Link></li>
                  <li><Link to="/international/personal/buttoncampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Button Campaign</Link></li>
                  <li><Link to="/international/personal/pollcampaign" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Poll Campaign</Link></li>
                  <li><Link to="/international/personal/report" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Whatsapp Reports</Link></li>
                  <li><Link to="/international/personal/scan" className="dropdown-item text-white " style={{ backgroundColor: "#133E87" }}>Whatsapp Scan</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/group" className="nav-link text-white d-flex">
                  <img src={groupIcon} width={24} height={24} />
                  <span className="ms-2">Group</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/template" className="nav-link text-white d-flex">
                  <img src={templateIcon} width={24} height={24} />
                  <span className="ms-2">Template</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/manageuser" className="nav-link text-white d-flex">
                  <img src={UserIcon} width={24} height={24} />
                  <span className="ms-2">Manage User</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/managecredit" className="nav-link text-white d-flex">
                  <img src={creditCardIcon} width={24} height={24} />
                  <span className="ms-2">Manage Credit</span>
                </Link>
              </li>
              <li className="nav-item">
                {/* <Link to="/logout" className="nav-link text-white d-flex">
                  <img src={logout} width={24} height={24} />
                  <span className="ms-2">Logout</span>
                </Link> */}
              </li>
            </ul>
          </div>
          <div className='w-75  ms-2 mb-2'>
                <button className='btn btn-success w-100' onClick={() => handleLogout()}
                >Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideBar;
