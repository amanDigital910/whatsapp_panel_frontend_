import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CustomSideBar from './components/CustomSideBar';
import NavBar from './components/NavBar';
import './App.css'
import { Provider } from 'react-redux';
import store from './redux/store';

import { PrivateRoute, PublicRoute } from './components/ProtectedRoutes';
import NotFoundPage from './components/NotFoundPage';
import AutoLogoutWrapper from './components/AutoLogoutWrapper';
import PersonalGroupChannelCommunity from './pages/user/wa_personal/PersonalGroupChannel-Community.js';
// import SideBar from './components/SideBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Pages
const Dashboard = lazy(() => import('./pages/user/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const TransitionCReditUser = lazy(() => import('./pages/admin/TransitionCReditUser'))

const LoginScreen = lazy(() => import('./pages/auth/UserLogin'));

const VirtualCampaign = lazy(() => import("./pages/user/wa_virtual/VirtualCampaign"));
// const CsvVirtualCampaign = lazy(() => import("./pages/user/wa_virtual/CSV_Campaign"));
const DpVirtualCampaign = lazy(() => import("./pages/user/wa_virtual/VirtualDpCampaign"));
const VirtualPollCampaign = lazy(() => import("./pages/user/wa_virtual/VirtualPollCampaign"));
const ButtonCampaign = lazy(() => import("./pages/user/wa_virtual/VirtualButtonCampaign"));
const WhatsappReport = lazy(() => import("./pages/user/wa_virtual/WhatsappReport"));
// const PersonalCSVButton = lazy(() => import("./pages/user/wa_personal/PersonalCSVButton"))
const PerosnalCampaign2 = lazy(() => import("./pages/user/wa_personal/PerosnalCampaign2"));
const PersonalPoll = lazy(() => import("./pages/user/wa_personal/PersonalCampaignPoll"));
// const PersonalCsv = lazy(() => import("./pages/user/wa_personal/personal_csv"));
const PersonalButton = lazy(() => import("./pages/user/wa_personal/PerosnalButton"));
const PersonalCampaign = lazy(() => import("./pages/user/wa_personal/PersonalWaReport"));
const PersonalCampaignScan = lazy(() => import("./pages/user/wa_personal/PersonalCampaignScan"));
const PersonalCampaignChannel = lazy(() => import("./pages/user/wa_personal/PersonalGroupChannel.js"));

const InternationalCampaign = lazy(() => import("./pages/user/wa_int_virtual/InternationalCampaign"));
// const InternaitionaCsv = lazy(() => import("./pages/user/wa_int_virtual/InternationalVirtualCsv"));
const InternaitionaButton = lazy(() => import("./pages/user/wa_int_virtual/InternationalCampaigeButton"));
const InternationalWhatsappReport = lazy(() => import("./pages/user/wa_int_virtual/InternationalWhatsappReport"));

const InternationCampaigePersonal = lazy(() => import("./pages/user/wa_int_personal/InternationCampaigePersonal"));
// const InternationalCampaignCsv = lazy(() => import("./pages/user/wa_int_personal/InternationalCampaignCsv"));
const InternationalCampaignButton = lazy(() => import("./pages/user/wa_int_personal/InternationalCampaignButton"));
const InternationalCampaignPoll = lazy(() => import("./pages/user/wa_int_personal/InternationalCampaignPoll"));
const InternationalReport = lazy(() => import("./pages/user/wa_int_personal/internationalReport"));
const InternationalPersonalScan = lazy(() => import("./pages/user/wa_int_personal/InternationalPersonalScan"));


const GroupCampaign = lazy(() => import("./pages/user/GroupCampaign"));
const TemplateCampaign = lazy(() => import("./pages/user/TemplateCampaign"));

const ManageUser = lazy(() => import("./pages/user/ManageUser"));
const ManageCredit = lazy(() => import("./pages/user/ManageCredit"));
const AddNewUser = lazy(() => import("./pages/user/AddNewUser"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage.js"));

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Loader effect
  // const [show, setShow] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => setShow(true), [30000]); // delay 1s
  //   // return () => clearTimeout(timer);
  //   return timer;
  // }, []);

  const toggleDropdown = (index) =>
    setActiveDropdown(activeDropdown === index ? null : index);

  // Disable Side bar in Login Screen
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // Determine if the current page should show sidebar and navbar
  // const isLoginPage = location.pathname === '/login';

  //Blog right click from the entire website
  // eslint-disable-next-line no-lone-blocks
  {/* useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    }
  
    document.addEventListener("contextmenu", handleContextMenu);
  
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    }
  }, []); */}

  return (
    <div>
      <div className="flex h-full w-full flex-wrap">
        {/* Sidebar */}
        {/* 
        // Old Sidebar Code
        <div className="bg-gray-800 h-full">
          <SideBar isOpen={isOpen} setIsSidebarOpen={setIsOpen} />
        </div> 
        */}
        {!isLoginPage && <CustomSideBar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeDropdown={activeDropdown}
          toggleDropdown={toggleDropdown}
        />}

        {/* Main Area */}
        <div className="flex-1 flex flex-col ">

          {/* Topbar */}
          {!isLoginPage && <NavBar
            isOpen={isOpen}
            setIsOpen={setIsOpen} />}

          {/* Main Content */}
          <div className={`flex-1 flex flex-col h-full  ${!isLoginPage ? ' mt-[70px]' : ''} `}>
            {/* Scrollable content area */}
            <div className="h-[100%] overflow-y-auto">
              <Suspense  >
                {/*  fallback={show && (
                 <div className='w-full max-h-screen h-full flex justify-center items-center'>
                   <div className='loader' />
                 </div>)}> */}
                <Routes>
                  {/* Default redirect to /login */}
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Public routes like login */}
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginScreen />} />
                  </Route>

                  {/* Protected routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/login" element={<LoginScreen />} />
                    {/* Dashboard admin and user */}
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path='/transitiontable' element={<TransitionCReditUser />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Wa virtual campaige */}
                    <Route path="/virtual-quick-csv" element={<VirtualCampaign />} />
                    <Route path="/virtual-dp" element={<DpVirtualCampaign />} />
                    <Route path="/virtual-poll" element={<VirtualPollCampaign />} />
                    <Route path="/virtual-button" element={<ButtonCampaign />} />
                    <Route path="/virtual-whatsapp-report" element={<WhatsappReport />} />
                    {/* <Route path="/user/csvvirtual" element={<CsvVirtualCampaign />} /> */}

                    {/* wa personal Campaige */}
                    <Route path="/personal-quick-csv" element={<PerosnalCampaign2 />} />
                    <Route path="/personal-poll" element={<PersonalPoll />} />
                    {/* <Route path="/personal-personal-csv" element={<PersonalCsv />} /> */}
                    <Route path="/personal-button" element={<PersonalButton />} />
                    {/* <Route path='/personal-Personalbutton' element={<PersonalCSVButton/> } /> */}
                    <Route path="/personal-whatsapp-report" element={<PersonalCampaign />} />
                    <Route path="/personal-whatsapp-scan" element={<PersonalCampaignScan />} />
                    <Route path="/personal-group-community" element={<PersonalCampaignChannel />} />
                    <Route path="/personal-channel-create-bulk-sms" element={<PersonalGroupChannelCommunity />} />

                    {/* wa Int virtual */}
                    <Route path="/international-virtual-quick-csv" element={<InternationalCampaign />} />
                    {/* <Route path="/international-csvcampaign" element={<InternaitionaCsv />} /> */}
                    <Route path="/international-virtual-button" element={<InternaitionaButton />} />
                    <Route path="/international-virtual-whatsapp-report" element={<InternationalWhatsappReport />} />


                    {/* Wa Int Personal */}
                    <Route path="/international-personal-quick-csv" element={<InternationCampaigePersonal />} />
                    {/* <Route path="/international-personal-csvcampaign" element={<InternationalCampaignCsv />} /> */}
                    <Route path="/international-personal-button" element={<InternationalCampaignButton />} />
                    <Route path="/international-personal-poll" element={<InternationalCampaignPoll />} />
                    <Route path="/international-personal-whatsapp-report" element={<InternationalReport />} />
                    <Route path="/international-personal-whatsapp-scan" element={<InternationalPersonalScan />} />

                    <Route path="/group" element={<GroupCampaign />} />
                    <Route path="/template" element={<TemplateCampaign />} />

                    <Route path='/manage-user' element={<ManageUser />} />
                    <Route path='/manage-credit' element={<ManageCredit />} />
                    <Route path='/add-new-user' element={<AddNewUser />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='*' element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const MainApp = () => (
  <Provider store={store}>
    <Router>
      <AutoLogoutWrapper>
        <App />
      </AutoLogoutWrapper>
    </Router>
  </Provider>
);

export default MainApp;
