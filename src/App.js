/* eslint-disable react/jsx-no-undef */
import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import CustomSideBar from './components/CustomSideBar';
import NavBar from './components/NavBar';
import './App.css'
import { Provider } from 'react-redux';
import store from './redux/store';

import { PrivateRoute, PublicRoute, ROLES } from './components/ProtectedRoutes';
import NotFoundPage from './components/NotFoundPage';
import AutoLogoutWrapper from './components/AutoLogoutWrapper';
import PersonalGroupChannelCommunity from './pages/user/wa_personal/PersonalGroupChannel-Community.js';
// import SideBar from './components/SideBar';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MembershipValidTill from './pages/user/Membership_Valid_Till.js';

// Pages
const Dashboard = lazy(() => import('./pages/user/UserDashboard'));
// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAllCampaigns = lazy(() => import('./pages/admin/AdminPages/AdminAllCampaigns'));
const AdminAllGroups = lazy(() => import('./pages/admin/AdminPages/AdminAllGroups'));
const AdminAllTemplates = lazy(() => import('./pages/admin/AdminPages/AdminAllTemplates'));
const AdminCreateTemplates = lazy(() => import('./pages/admin/AdminPages/AdminCreateTemplates'));
const ManageAllCredits = lazy(() => import('./pages/admin/AdminPages/ManageAllCredits'));

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

// Whatsapp Offical Pages
const WhatsappDashboard = lazy(() => import("./pages/user/whatsapp_offical/Dashboard.js"))
const WhatsappBilling = lazy(() => import("./pages/user/whatsapp_offical/Billing.js"))
const WhatsappSend = lazy(() => import("./pages/user/whatsapp_offical/SendWhatsapp.js"))
const WhatsappAPI = lazy(() => import("./pages/user/whatsapp_offical/WhatsappAPI.js"))

// Whatsapp Official Settings
const WhatsappSettingPhones = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/Phones.js"))
const WhatsappSettingTemplates = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/Templates.js"))
const WhatsappSettingUserTrigger = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/UserTrigger.js"))
const WhatsappSettingFlows = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/Flows.js"))
const WhatsappSettingWebhook = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/WebHook.js"))
const WhatsappSettingPricing = lazy(() => import("./pages/user/whatsapp_offical/whatsapp_settings/Pricing.js"))

// Whatsapp Profiles Settings
const WhatsappProfileSetting = lazy(() => import("./pages/user/whatsapp_offical/settings/SettingProfile.js"))
const WhatsappProfileCompany = lazy(() => import("./pages/user/whatsapp_offical/settings/CompanyProfile.js"))
const WhatsappProfileTeam = lazy(() => import("./pages/user/whatsapp_offical/settings/TeamProfile.js"))
const WhatsappProfileSecurity = lazy(() => import("./pages/user/whatsapp_offical/settings/SecurityProfile.js"))

// Whatsapp Official Report Pages
const CampaignReport = lazy(() => import("./pages/user/whatsapp_offical/reports/ReportCampaignReport.js"));
const WhatsappLogsReport = lazy(() => import("./pages/user/whatsapp_offical/reports/WhatsappLogsReport.js"));
const ClickLogsReport = lazy(() => import("./pages/user/whatsapp_offical/reports/ClickLogsReport.js"));
const DailyStatsReport = lazy(() => import("./pages/user/whatsapp_offical/reports/DailyStatsReport.js"));
const UserResponseReport = lazy(() => import("./pages/user/whatsapp_offical/reports/UserResponseReport.js"));
const ExportReport = lazy(() => import("./pages/user/whatsapp_offical/reports/ExportsReport.js"));

// Developer API Pages
const PersonalDeveloperAPI = lazy(() => import("./pages/user/developer_api/personal_api/PersonalAPIManage.js"));
const PersonalDeveloperReport = lazy(() => import("./pages/user/developer_api/personal_api/PersonalReport.js"));
const InternationalDeveloperAPI = lazy(() => import("./pages/user/developer_api/international_api/InternationalAPIManage.js"));
const InternationalDeveloperReport = lazy(() => import("./pages/user/developer_api/international_api/InternationalReport.js"));

const GroupCampaign = lazy(() => import("./pages/user/GroupCampaign"));
const TemplateCampaign = lazy(() => import("./pages/user/TemplateCampaign"));

const ManageUser = lazy(() => import("./pages/user/ManageUser"));
const ManageCredit = lazy(() => import("./pages/user/ManageCredit"));
const AddNewUser = lazy(() => import("./pages/user/AddNewUser"));
const ProfilePage = lazy(() => import("./pages/user/ProfilePage.js"));
const CreditHistory = lazy(() => import("./pages/user/CreditHistory.js"))

const App = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (index, link) => {
    if (link) navigate(link);
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Disable Side bar in Login Screen
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // const isLoggedIn = !!localStorage.getItem('userToken'); // or check auth state from Redux

  // Redirect if not logged in and on protected path
  // useEffect(() => {
  //   if (!isChangePassword) {
  //     navigate('/login');
  //   }
  // }, [isLoggedIn, isChangePassword, navigate]);

  return (
    <div className='custom-horizontal-scroll'>
      <div className="flex h-full w-full flex-wrap select-none hide-scrollbar">
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
                    {/* <Route path="/change-password" element={<ChangePassword />} /> */}
                  </Route>

                  {/* Protected routes */}
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
                    {/* Dashboard admin and user */}
                    <Route path="/admin-dashboard" element={<AdminDashboard isOpen={isOpen} />} />
                    <Route path="/create-campaigns" element={<AdminCreateTemplates isOpen={isOpen} />} />
                    <Route path="/all-templates" element={<AdminAllTemplates isOpen={isOpen} />} />
                    <Route path="/all-campaigns" element={<AdminAllCampaigns isOpen={isOpen} />} />
                    <Route path="/all-groups" element={<AdminAllGroups isOpen={isOpen} />} />
                    <Route path="/manage-developer-api" element={<ManageAllCredits isOpen={isOpen} />} />

                    <Route path='/transitiontable' element={<TransitionCReditUser isOpen={isOpen} />} />
                  </Route>
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} />}>
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Whatsapp Offical Pages Routing */}
                    <Route path="/whatsapp-dashboard" element={<WhatsappDashboard />} />
                    <Route path="/whatsapp-send" element={<WhatsappSend />} />
                    <Route path="/whatsapp-billing" element={<WhatsappBilling />} />
                    <Route path="/whatsapp-api" element={<WhatsappAPI />} />

                    {/* Whatsapp Offical Profile Pages Routing */}
                    <Route path='/whatsapp-profile/setting' element={<WhatsappProfileSetting />} />
                    <Route path='/whatsapp-profile/company' element={<WhatsappProfileCompany />} />
                    <Route path='/whatsapp-profile/team' element={<WhatsappProfileTeam />} />
                    <Route path='/whatsapp-profile/security' element={<WhatsappProfileSecurity />} />

                    {/* Whatsapp Offical Settings Pages Routing */}
                    <Route path='/whatsapp-settings/phones' element={<WhatsappSettingPhones />} />
                    <Route path='/whatsapp-settings/templates' element={<WhatsappSettingTemplates />} />
                    <Route path='/whatsapp-settings/user-trigger' element={<WhatsappSettingUserTrigger />} />
                    <Route path='/whatsapp-settings/flows' element={<WhatsappSettingFlows />} />
                    <Route path='/whatsapp-settings/webhook' element={<WhatsappSettingWebhook />} />
                    <Route path='/whatsapp-settings/pricing' element={<WhatsappSettingPricing />} />

                    {/* Whatsapp Offical Report Page Routing */}
                    <Route path="/whatsapp-reports/campaigns" element={<CampaignReport activeDropdown={activeDropdown} isOpen={isOpen} />} />
                    <Route path="/whatsapp-reports/whatsapp-logs" element={<WhatsappLogsReport />} />
                    <Route path="/whatsapp-reports/click-logs" element={<ClickLogsReport />} />
                    <Route path="/whatsapp-reports/daily-stats" element={<DailyStatsReport />} />
                    <Route path="/whatsapp-reports/user-responses" element={<UserResponseReport />} />
                    <Route path="/whatsapp-reports/exports" element={<ExportReport />} />

                    {/* Developer API Pages*/}
                    {/* Personal Developer API */}
                    <Route path="/personal/developer-api" element={<PersonalDeveloperAPI isOpen={isOpen} />} />
                    <Route path="/personal/whatsapp-report" element={<PersonalDeveloperReport />} />
                    {/* International Developer API */}
                    <Route path="/international/developer-api" element={<InternationalDeveloperAPI />} />
                    <Route path="/international/whatsapp-report" element={<InternationalDeveloperReport />} />


                    <Route path="/group" element={<GroupCampaign />} />
                    <Route path="/template" element={<TemplateCampaign isOpen={isOpen} />} />

                    <Route path='/credit-history' element={<CreditHistory isOpen={isOpen} />} />
                    <Route path='/membership-validity' element={<MembershipValidTill />} />
                    <Route path='/profile' element={<ProfilePage />} />
                    <Route path='/unauthorized' element={<NotFoundPage />} />
                    <Route path='*' element={<NotFoundPage />} />

                  </Route>

                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} requiredPermissions={["virtual"]} />}>
                    {/* Wa virtual campaige */}
                    <Route path="/virtual-quick-csv" element={<VirtualCampaign />} />
                    <Route path="/virtual-dp" element={<DpVirtualCampaign />} />
                    <Route path="/virtual-poll" element={<VirtualPollCampaign />} />
                    <Route path="/virtual-button" element={<ButtonCampaign />} />
                    <Route path="/virtual-whatsapp-report" element={<WhatsappReport isOpen={isOpen} />} />
                    {/* <Route path="/user/csvvirtual" element={<CsvVirtualCampaign />} /> */}
                  </Route>
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} requiredPermissions={["personal"]} />}>
                    {/* wa personal Campaige */}
                    <Route path="/personal-quick-csv" element={<PerosnalCampaign2 />} />
                    <Route path="/personal-poll" element={<PersonalPoll />} />
                    {/* <Route path="/personal-personal-csv" element={<PersonalCsv />} /> */}
                    <Route path="/personal-button" element={<PersonalButton />} />
                    {/* <Route path='/personal-Personalbutton' element={<PersonalCSVButton/> } /> */}
                    <Route path="/personal-whatsapp-report" element={<PersonalCampaign isOpen={isOpen} />} />
                    <Route path="/personal-scan-whatsapp" element={<PersonalCampaignScan isOpen={isOpen} />} />
                    <Route path="/personal-group-community" element={<PersonalCampaignChannel />} />
                    <Route path="/personal-channel-create-bulk-sms" element={<PersonalGroupChannelCommunity />} />
                  </Route>
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} requiredPermissions={["internationalVirtual"]} />}>
                    {/* wa Int virtual */}
                    <Route path="/international-virtual-quick-csv" element={<InternationalCampaign />} />
                    {/* <Route path="/international-csvcampaign" element={<InternaitionaCsv />} /> */}
                    <Route path="/international-virtual-button" element={<InternaitionaButton />} />
                    <Route path="/international-virtual-whatsapp-report" element={<InternationalWhatsappReport isOpen={isOpen} />} />

                  </Route>
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} requiredPermissions={["internationalPersonal"]} />}>
                    {/* Wa Int Personal */}
                    <Route path="/international-personal-quick-csv" element={<InternationCampaigePersonal />} />
                    {/* <Route path="/international-personal-csvcampaign" element={<InternationalCampaignCsv />} /> */}
                    <Route path="/international-personal-button" element={<InternationalCampaignButton />} />
                    <Route path="/international-personal-poll" element={<InternationalCampaignPoll />} />
                    <Route path="/international-personal-whatsapp-report" element={<InternationalReport isOpen={isOpen} />} />
                    <Route path="/international-personal-scan-whatsapp" element={<InternationalPersonalScan isOpen={isOpen} />} />
                  </Route>
                  {/* <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER, ROLES.USER]} requiredPermissions={["virtual"]} />}>
                    
                  </Route> */}
                  <Route element={<PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RESELLER]} />}>
                    <Route path='/manage-credit' element={<ManageCredit isOpen={isOpen} />} />
                    <Route path='/manage-user' element={<ManageUser isOpen={isOpen} />} />
                    <Route path='/add-new-user' element={<AddNewUser />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer autoClose="2000" />
    </div >
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
