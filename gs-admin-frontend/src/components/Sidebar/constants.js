import {
  faAtlas,
  faCog,
  faCogs,
  faCompass,
  faCreditCard,
  faDollarSign,
  faEuroSign,
  faGamepad,
  faHouseUser,
  faIdCard,
  faImage,
  faLanguage,
  faListAlt,
  faLock,
  faMailBulk,
  faMoneyBillAlt,
  faMoneyBillWaveAlt,
  faMoneyCheckAlt,
  faPhotoVideo,
  faStream,
  faTable,
  faTasks,
  faUser,
  faUserCog,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { 
  UilEnvelopes,
  UilEuro,
  UilUserArrows,
  UilShieldPlus,
  UilUsersAlt,
  UilServer,
  UilScenery,
  UilAwardAlt,
  UilMeetingBoard,
  UilPostcard,
  UilCompass,
  UilGameStructure,
  UilTransaction
} from '@iconscout/react-unicons'
import { AdminRoutes } from '../../routes'

export const SANavItems = [
  {
    label: 'EmailTemplate',
    value: {
      title: 'Email Template',
      link: AdminRoutes.EmailTemplate,
      Icon: UilEnvelopes,
      isUniIcon: true
    }
  },
  {
    label: 'Currencies',
    value: {
      title: 'Currencies',
      link: AdminRoutes.Currencies,
      Icon: UilEuro,
      isUniIcon: true
    }
  },
  {
    label: 'Admins',
    value: {
      title: 'Staff',
      link: AdminRoutes.Admins,
      Icon: UilUserArrows,
      isUniIcon: true
    }
  },
  {
    label: 'CMS',
    value: {
      title: 'CMS',
      link: AdminRoutes.CMS,
      Icon: UilShieldPlus,
      isUniIcon: true
    }
  },
  {
    label: 'Users',
    value: {
      title: 'Players',
      link: AdminRoutes.Users,
      Icon: UilUsersAlt,
      isUniIcon: true
    }
  },
  {
    label: 'RegistrationField',
    value: {
      title: 'Registration Fields',
      link: AdminRoutes.FormFields,
      Icon: UilServer,
      isUniIcon: true
    }
  }, {
    label: 'CasinoManagement',
    value: {
      title: 'Casino Management',
      Icon: UilGameStructure,
      eventKey: 'casinoManagement/',
      isUniIcon: true
    },
    isCollapsible: true,
    options: [
      {
        label: 'Aggregators',
        value: {
          title: 'Aggregators',
          link: AdminRoutes.Aggregators,
          Icon: faTable
        }
      },
      {
        label: 'Providers',
        value: {
          title: 'Providers',
          link: AdminRoutes.CasinoProviders,
          Icon: faUser
        }
      },
      {
        label: 'Categories',
        value: {
          title: 'Categories',
          link: AdminRoutes.CasinoCategory,
          Icon: faStream
        }
      },
      {
        label: 'Sub Categories',
        value: {
          title: 'Sub Categories',
          link: AdminRoutes.CasinoSubCategory,
          Icon: faListAlt
        }
      },
      {
        label: 'Games',
        value: {
          title: 'Games',
          link: AdminRoutes.CasinoGames,
          Icon: faGamepad
        }
      },
      {
        label: 'CasinoManagement',
        value: {
          title: 'Banner Management',
          Icon: faPhotoVideo,
          link: AdminRoutes.BannerManagement
        }
      }
    ]
  },
  {
    label: 'Transactions',
    value: {
      title: 'Transactions',
      Icon: UilTransaction,
      eventKey: 'Transactions/',
      isUniIcon: true
    },
    isCollapsible: true,
    options: [
      {
        label: 'Transactions Banking',
        value: {
          title: 'Transactions Banking',
          link: AdminRoutes.TransactionsBanking,
          Icon: faDollarSign
        }
      },
      {
        label: 'Casino Transactions',
        value: {
          title: 'Casino Transactions',
          link: AdminRoutes.CasinoTransactions,
          Icon: faCreditCard
        }
      },
      {
        label: 'Withdraw Requests',
        value: {
          title: 'Withdraw Requests',
          link: AdminRoutes.WithdrawRequests,
          Icon: faMoneyBillWaveAlt
        }
      }
    ]
  },
  {
    label: 'KycLabel',
    value: {
      title: 'KYC Labels',
      link: AdminRoutes.KYCLabels,
      Icon: UilPostcard,
      isUniIcon: true
    }
  },
  {
    label: 'RestrictedCountry',
    value: {
      title: 'Countries',
      link: AdminRoutes.Countries,
      Icon: UilCompass,
      isUniIcon: true
    }
  },
  {
    label: 'Bonus',
    value: {
      title: 'Bonus',
      link: AdminRoutes.Bonus,
      Icon: UilAwardAlt,
      isUniIcon: true
    }
  },
  {
    label: 'LoyaltyProgram',
    value: {
      title: 'Loyalty Program',
      link: AdminRoutes.Loyalty,
      Icon: UilMeetingBoard,
      isUniIcon: true
    }
  },
  {
    label: 'ImageGallery',
    value: {
      title: 'Image Gallery',
      link: AdminRoutes.ImageGallery,
      Icon: UilScenery,
      isUniIcon: true
    }
  }
]

