import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/whatsapp_Dashboard_Background.jpg'

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (url) => {
    navigate(url);
  };
  const MsgCategory = [
    {
      id: 1,
      cardName: "WA Virtual Quick / CSV Campaign",
      cardCredit: 0,
      bg: "#383387",
      redirectUrl: "/virtual-quick-csv",
      charName: 'WV',
      requiredPermission: "virtual"
    },
    {
      id: 2,
      cardName: "WA Virtual Button Campaign",
      cardCredit: 0,
      bg: "#383387",
      redirectUrl: "/virtual-button",
      charName: 'WVB',
      requiredPermission: "virtual"
    },
    {
      id: 3,
      cardName: "WA Virtual DP Campaign",
      cardCredit: 0,
      bg: "#383387",
      redirectUrl: "/virtual-dp",
      charName: 'WVD',
      requiredPermission: "virtual"
    },
    {
      id: 4,
      cardName: "WA Virtual Poll Campaign",
      cardCredit: 0,
      bg: "#383387",
      redirectUrl: "/virtual-poll",
      charName: 'WVP',
      requiredPermission: "virtual"
    },
    {
      id: 5,
      cardName: "WA Personal Quick / CSV Campaign",
      cardCredit: 0,
      bg: "#25D366",
      redirectUrl: "/personal-quick-csv",
      charName: 'WP',
      requiredPermission: "personal"
    },
    {
      id: 6,
      cardName: "WA Personal Button Campaign",
      cardCredit: 0,
      bg: "#25D366",
      redirectUrl: "/personal-button",
      charName: 'WPB',
      requiredPermission: "personal"
    },
    {
      id: 7,
      cardName: "WA Personal Group / Community Campaign",
      cardCredit: 0,
      bg: "#25D366",
      redirectUrl: "/personal-group-community",
      charName: 'WPG',
      requiredPermission: "personal"
    },
    {
      id: 8,
      cardName: "WA Channel Create & Send Bulk Message Campaign",
      cardCredit: 0,
      bg: "#25D366",
      redirectUrl: "/personal-channel-create-bulk-sms",
      charName: 'WPCG',
      requiredPermission: "personal"
    },
    {
      id: 9,
      cardName: "WA Personal Poll Campaign",
      cardCredit: 0,
      bg: "#25D366",
      redirectUrl: "/personal-poll",
      charName: 'WPP',
      requiredPermission: "personal"
    },
    {
      id: 10,
      cardName: "WA International Virtual Quick / CSV Campaign",
      cardCredit: 0,
      bg: "#7b1111",
      redirectUrl: "/international-virtual-quick-csv",
      charName: 'WIV',
      requiredPermission: "internationalVirtual"
    },
    {
      id: 11,
      cardName: "WA International Virtual Button Campaign",
      cardCredit: 0,
      bg: "#7b1111",
      redirectUrl: "/international-virtual-button",
      charName: 'WIVB',
      requiredPermission: "internationalVirtual"
    },
    {
      id: 12,
      cardName: "WA International Personal Quick / CSV Campaign",
      cardCredit: 0,
      bg: "#52117b",
      redirectUrl: "/international-virtual-button",
      charName: 'WIP',
      requiredPermission: "internationalPersonal"
    },
    {
      id: 13,
      cardName: "WA International Personal Button Campaign",
      cardCredit: 0,
      bg: "#52117b",
      redirectUrl: "/international-personal-button",
      charName: 'WIPB',
      requiredPermission: "internationalPersonal"
    },
    {
      id: 14,
      cardName: "WA International Personal Poll Campaign",
      cardCredit: 0,
      bg: "#52117b",
      redirectUrl: "/international-personal-poll",
      charName: 'WIPP',
      requiredPermission: "internationalPersonal"
    },
    {
      id: 15,
      cardName: "Whatsapp Offical Dashboard",
      cardCredit: 0,
      bg: "#128b7f",
      redirectUrl: "/whatsapp-dashboard",
      charName: 'WOD',
      requiredPermission: "whatsappOfficial"
    },
    {
      id: 16,
      cardName: "Personal Developer API",
      cardCredit: 0,
      bg: "#128b7f",
      redirectUrl: "/personal/developer-api",
      charName: 'PDA',
      requiredPermission: "developerAPI"
    },
    {
      id: 17,
      cardName: "International Developer API",
      cardCredit: 0,
      bg: "#128b7f",
      redirectUrl: "/international/developer-api",
      charName: 'IDA',
      requiredPermission: "developerAPI"
    },
    {
      id: 18,
      cardName: "Membership Valid Till",
      cardCredit: 0,
      bg: "#f03c15",
      redirectUrl: "/membership-validity",
      charName: "M",
      requiredPermission: null // visible to all
    }
  ];

  const userRolePermission = {
    permissions: {
      virtual: true,
      personal: true,
      internationalVirtual: true,
      internationalPersonal: true,
      whatsappOfficial: true,
      developerAPI: true
    },
  };

  const filteredMsgCategory = MsgCategory.filter(item => {
    if (!item.requiredPermission) return true;

    return userRolePermission.permissions[item.requiredPermission];
  });

  return (
    <>
      <section className="container py-5 w-full select-none" style={{ backgroundColor: "#fff", minHeight: "100%" }}>
        <div className="row g-4 ">
          {filteredMsgCategory.map((item, index) => (
            <div className="group col-12 col-md-6 col-lg-4 cursor-pointer" key={index}>
              <div className="shadow-md hover:shadow-xl  border-gray-400 border rounded-lg px-4 flex flex-col justify-between h-32 overflow-hidden relative transition-all duration-500 ease-in-out transform hover:scale-105 hover:translate-y-[-5px]"
                style={{
                  backgroundImage: `url(${backgroundImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'

                }}>

                {/* Background animation */}
                <div className="absolute top-0 left-0 w-full h-full bg-transparent transform translate-y-[-100%] transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>

                {/* Card Content */}
                <div className="flex justify-between items-center h-full w-full gap-4 relative z-10">
                  <div className='w-[82%]' onClick={() => handleCardClick(item.redirectUrl)}>
                    <h2 className="text-primary font-bold leading-snug text-[16px] whitespace-pre-wrap transition-colors duration-300 hover:text-blue-500 group-hover:underline underline-offset-4">
                      {item.cardName}
                    </h2>
                    <h3 className="text-primary font-semibold text-lg transition-colors duration-300 hover:text-blue-500">
                      {item.id === 15 ? `Date - ${item.cardDate}` : `Balance - ${item.cardCredit}`}
                    </h3>
                  </div>

                  <div className="absolute translate-y-[4%] right-0 w-[4rem] h-[4rem] uppercase rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md transform transition-transform duration-300 hover:scale-125"
                    style={{ backgroundColor: item.bg }} >
                    {item.charName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default UserDashboard;

// Created an SVG to display the show card on the right side.
// const SvgCard = ({ cardColor }) => {
//   return (
//     <svg
//       stroke="currentColor"
//       fill="currentColor"
//       strokeWidth="0"
//       viewBox="0 0 16 16"
//       className="transform transition-transform duration-300 hover:scale-125 text-[3rem]"
//       height="1em"
//       width="1em"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{
//         color: cardColor,      // Dynamically setting the color
//         fontSize: "3rem",      // Fixed font size

//       }}
//     >
//       <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5H0zm11.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM0 11v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1z"></path>
//     </svg>
//   );
// };
