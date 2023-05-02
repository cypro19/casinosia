import { deleteRequest, getRequest, postRequest, putRequest } from "./axios";

const { REACT_APP_API_URL } = process.env;

const superAdminLogin = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/login`, data);

const getAllAdmins = ({
  limit,
  pageNo,
  orderBy,
  sort,
  search,
  superAdminId,
  superRoleId,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-admins?orderBy=${orderBy}&pageNo=${pageNo}&limit=${limit}&sort=${sort}&search=${search}&superRoleId=${superRoleId}&superAdminId=${superAdminId}`
  );

const getAllCurrencies = ({ limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-currencies?limit=${limit}&pageNo=${pageNo}`
  );

const getAllAffiliates = ({ limit, pageNo, search }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-affiliates?limit=${limit}&pageNo=${pageNo}&search=${search}`
  );

const getAffiliateById = ({ affiliateId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-affiliate?affiliateId=${affiliateId}`
  );

const getAllCms = ({ pageNo, limit, search, isActive }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-cms?pageNo=${pageNo}&limit=${limit}&search=${search}&isActive=${isActive}`
  );

const getCmsByPageId = ({ cmsPageId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-cms-details?cmsPageId=${cmsPageId}`
  );

const getAllUsers = ({ limit, pageNo, search, kycStatus }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-users?limit=${limit}&pageNo=${pageNo}&search=${search}&kycStatus=${kycStatus}`
  );

const getAllCasinoProviders = ({ limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-casino-providers?limit=${limit}&pageNo=${pageNo}`
  );

const getAllCasinoGames = ({
  bonusId,
  limit,
  pageNo,
  casinoCategoryId,
  search,
  isActive,
  selectedProvider,
  freespins,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-casino-games?limit=${limit}&pageNo=${pageNo}&casinoCategoryId=${casinoCategoryId}&search=${search}&isActive=${isActive}&providerId=${selectedProvider}&freespins=${freespins}&bonusId=${bonusId}`
  );

const updateTheme = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-theme`, data);

const createTheme = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-theme`, data);

const createCurrency = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-currency`, data);

const editCurrency = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-currency`, data);

const getCurrencyById = (currencyId) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-currency-details?currencyId=${currencyId}`
  );

const getAdminRole = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-roles`);

const getAdmin = ({ adminId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/admin-details?superAdminUserId=${adminId}`
  );
const getAllCredentials = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-all-credentials-keys`);

const getUser = ({ userId }) =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-user?userId=${userId}`);

const getAdminUserDetails = ({ adminUserId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-admin-details?adminUserId=${adminUserId}`
  );

const createCms = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-cms`, data);

const getSAdminWallet = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-wallets`);

const getGames = ({
  limit,
  pageNo,
  casinoCategoryId,
  isActive,
  orderBy,
  sort,
  providerId,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-category-games?limit=${limit}&pageNo=${pageNo}&casinoCategoryId=${casinoCategoryId}&isActive=${isActive}&orderBy=${orderBy}&sort=${sort}&providerId=${providerId}`
  );

const getMasterGames = ({
  bonusId,
  limit,
  pageNo,
  search,
  masterCasinoGameId,
  providerId,
  freespins,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-casino-games?limit=${limit}&pageNo=${pageNo}&search=${search}&masterCasinoGameId=${masterCasinoGameId}&providerId=${providerId}&freespins=${freespins}&bonusId=${bonusId}`
  );

const getCasinoSubCategories = ({
  limit,
  pageNo,
  categoryId,
  search,
  isActive,
  orderBy,
  sort,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-all-casino-sub-category?limit=${limit}&pageNo=${pageNo}&gameCategoryId=${categoryId}&search=${search}&isActive=${isActive}&orderBy=${orderBy}&sort=${sort}`
  );

const createCasinoCategory = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-casino-category`, data);

const addGamesToSubCategory = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-category-game`, data);

const createCasinoSubCategory = (data) =>
  postRequest(
    `${REACT_APP_API_URL}/api/admin/create-casino-sub-category`,
    data
  );

const updateSubCategory = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-casino-sub-category`, data);

const updateSubCategoryReOrder = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/order-casino-sub-category`, data);

const updateCategoryReOrder = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/order-casino-category`, data);

const updateCasinoCategory = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-casino-category`, data);

const getCountries = ({ limit, pageNo, name }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-country-list?limit=${limit}&pageNo=${pageNo}&name=${name}`
  );

const getRestrictedItems = ({ limit, pageNo, type, countryId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-restricted-items?limit=${limit}&pageNo=${pageNo}&type=${type}&countryId=${countryId}`
  );

const getUnRestrictedItems = ({ limit, pageNo, type, countryId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-unrestricted-items?limit=${limit}&pageNo=${pageNo}&type=${type}&countryId=${countryId}`
  );

const addRestrictedItems = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-restricted-country`, data);

const updateSAdminUser = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-admin-user`, data);

const createSAdminUser = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-admin-user`, data);

const createCasinoGame = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-casino-game`, data);

const createCasinoProvider = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-casino-provider`, data);

const updateCasinoGame = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-casino-game`, data);

const updateCasinoProvider = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-casino-provider`, data);

const getSAdminDetails = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/admin-details`);

const getSiteConfigDetails = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-config`);

const getAllSAdminTransactions = ({
  limit,
  pageNo,
  search,
  startDate,
  endDate,
  currencyId,
  transactionType,
  paymentProvider,
  isUserDetail,
  userId,
  status,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-transactions?limit=${limit}&pageNo=${pageNo}&actioneeType=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}&currencyCode=${currencyId}&transactionType=${transactionType}&paymentProvider=${paymentProvider}${
      isUserDetail ? `&userId=${userId}` : ""
    }`
  );

const getSAdminTransactionUsers = ({ email }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-transaction-users?email=${email}`
  );

const getSAdminAggregators = ({ limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-aggregators?limit=${limit}&pageNo=${pageNo}`
  );

const createSAdminAggregator = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/add-aggregator`, data);

const getSAdminGameCategory = ({ limit, pageNo, search }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-all-casino-category?limit=${limit}&pageNo=${pageNo}`
  );

const getSAdminGameSubCategory = ({
  limit,
  pageNo,
  search,
  gameCategoryId,
  isActive,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-all-casino-sub-category?pageNo=${pageNo}&gameCategoryId=${gameCategoryId}&search=${search}&limit=${limit}&isActive=${isActive}`
  );

const depositToOwner = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/deposit-to-owner`, data);

const deleteGame = (data) =>
  deleteRequest(`${REACT_APP_API_URL}/api/admin/delete-category-game`, data);

const updateGame = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-category-game`, data);

const deleteRestrictedItems = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/delete-restricted-items`, data);

const getRestrictedCountries = ({ itemId, type, limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-restricted-countries?itemId=${itemId}&type=${type}&limit=${limit}&pageNo=${pageNo}`
  );

const getUnRestrictedCountries = ({ itemId, type, limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-unrestricted-countries?itemId=${itemId}&type=${type}&limit=${limit}&pageNo=${pageNo}`
  );

const deleteRestrictedCountries = (data) =>
  putRequest(
    `${REACT_APP_API_URL}/api/admin/delete-restricted-countries`,
    data
  );

const addRestrictedCountries = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-restricted-items`, data);

const addDepositToOther = ({ data }) =>
  putRequest(`${REACT_APP_API_URL}/api/${"admin"}/add-balance`, data);

const getSAdminCasinoTransactions = ({
  limit,
  pageNo,
  startDate,
  endDate,
  currencyCode,
  transactionType,
  status,
  email,
  userId,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-casino-transactions?limit=${limit}&pageNo=${pageNo}&startDate=${startDate}&endDate=${endDate}&currencyCode=${currencyCode}&transactionType=${transactionType}&status=${status}&email=${email}&userId=${userId}`
  );

const getAllClients = ({ orderBy, limit, pageNo, sort, search }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-admin-users?orderBy=${orderBy}&limit=${limit}&pageNo=${pageNo}&sort=${sort}&search=${search}`
  );

const updateSAdminCMS = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-cms`, data);

const isDomainExist = ({ domain }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/check-domain-exist?domain=${domain}`
  );

const toggleStatus = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-status`, data);

const superAdminViewToggleStatus = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-status`, data);

const deleteCategory = (data) =>
  deleteRequest(`${REACT_APP_API_URL}/api/admin/delete-casino-category`, data);

const deleteSubCategory = (data) =>
  deleteRequest(
    `${REACT_APP_API_URL}/api/admin/delete-casino-sub-category`,
    data
  );

const getAllWithdrawRequestSAdmin = ({
  name,
  status,
  page,
  limit,
  startDate,
  endDate,
  paymentProvider,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-all-withdraw-request?search=${name}&status=${status}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&paymentProvider=${paymentProvider}`
  );
const getAllSAProviders = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-all-providers`);

const getAllTAProviders = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-all-providers`);

const getGlobalRegistration = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-global-registration`);

const updateGlobalRegistration = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-global-registration`, data);

const getSAConvertAmount = ({ currencyFields, currencyCode }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/convert-amount?currencyFields=${JSON.stringify(
      currencyFields
    )}&currentCurrencyCode=${currencyCode}`
  );

const getAllBonus = ({ limit, pageNo, bonusType, isActive, search, userId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-bonus?limit=${limit}&pageNo=${pageNo}&search=${search}&isActive=${isActive}&bonusType=${bonusType}&userId=${userId}`
  );

const createBonus = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/create-bonus`, data);

const updateBonus = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/${"admin"}/update-bonus`, data);

const getBonus = ({ bonusId, userBonusId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-bonus-detail?bonusId=${bonusId}&userBonusId=${userBonusId}`
  );

const issueBonus = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/issue-bonus`, data);

const getUserBonus = ({ limit, pageNo, bonusType, status, userId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-user-bonus?limit=${limit}&pageNo=${pageNo}&bonusType=${bonusType}&status=${status}&userId=${userId}`
  );

const cancelBonus = ({ data }) =>
  putRequest(`${REACT_APP_API_URL}/api/${"admin"}/cancel-bonus`, data);

const getUserDocument = (userId, flag) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${flag}/get-user-document?userId=${userId}`
  );

const verifyUserDocument = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/verify-user-document`, data);

const getDocumentLabel = (userId) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-document-label?userId=${userId}`
  );

const updateDocumentLabel = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-document-label`, data);

const createDocumentLabel = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/create-document-label`, data);

const requestDocument = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/request-document`, data);

const cancelDocumentRequest = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/cancel-document-request`, data);

const getSAdminPlayerManagement = ({
  endDate,
  startDate,
  limit,
  dateOptions,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-top-players?startDate=${startDate}&endDate=${endDate}&limit=${limit}&dateOptions=${dateOptions}`
  );
const getPaymentMethod = ({ flag }) =>
  getRequest(`${REACT_APP_API_URL}/api/${flag}/get-payment-methods`);

const getSAdminLivePlayerReport = ({ limit } = {}) =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-live-player-report`);

const getSAPlayerLiability = ({ startDate, endDate, dateOptions }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-players-liability?startDate=${startDate}&endDate=${endDate}&dateOptions=${dateOptions}`
  );

const getSAKPISummary = ({ startDate, endDate }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-kpi-summary?startDate=${startDate}&endDate=${endDate}`
  );

const getSAKPIReport = ({ startDate, endDate, dateOptions, selectedTab }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-kpi-report?tab=${selectedTab}&customStartDate=${startDate}&customEndDate=${endDate}&dateOptions=${dateOptions}`
  );

const getSAGameReport = ({ startDate, endDate, dateOptions, selectedTab }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-game-report?customStartDate=${startDate}&customEndDate=${endDate}&dateOptions=${dateOptions}&tab=${selectedTab}`
  );

const getSAPlayerGameReport = ({
  userId,
  limit,
  startDate,
  endDate,
  dateOptions,
  selectedTab,
}) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-game-report?userId=${userId}&limit=${limit}&customStartDate=${startDate}&customEndDate=${endDate}&dateOptions=${dateOptions}&tab=${selectedTab}`
  );

const getFreeSpinGames = ({ providerId, bonusId, limit, pageNo, search }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-freespin-games?providerId=${providerId}&bonusId=${bonusId}&limit=${limit}&pageNo=${pageNo}&search=${search}`
  );

const getEmailTemplates = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/get-all-email-templates`);

const getEmailTemplate = ({ emailTemplateId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-email-template?emailTemplateId=${emailTemplateId}`
  );

const updateEmailTemplate = ({ data }) =>
  putRequest(`${REACT_APP_API_URL}/api/${"admin"}/update-email-template`, data);

const primaryEmailTemplate = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/mark-email-primary`, data);

const getDynamicKeys = ({ type }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-email-dynamic-options?type=${type}`
  );

const createEmailTemplate = ({ data }) =>
  postRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/create-email-template`,
    data
  );

const getloyaltyLevel = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-loyalty-level`);

const updateloyaltyLevel = ({ loyaltyLevel }) =>
  putRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/update-loyalty-level`,
    loyaltyLevel
  );

const getLanguages = ({ limit, pageNo, active }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-languages?limit=${limit}&pageNo=${pageNo}&active=${active}`
  );

const updateProfile = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-profile`, data);

const getAdminChildren = ({ superAdminId, superRoleId }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-admin-childs?superAdminId=${superAdminId}&superRoleId=${superRoleId}`
  );

const getAllGroups = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/get-all-group`);

const getImageGallery = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/get-image-gallery`);

const deleteFromGallery = ({ data }) =>
  deleteRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/delete-gallery-image`,
    data
  );

const testEmailTemplateEndPoint = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/test-email-template`, data);

const setDailyLimit = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-daily-limit`, data);

const setDepositLimit = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-deposit-limit`, data);

const setLossLimit = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-loss-limit`, data);

const getOwnerPermissions = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-owner-permission`);

const setEmailCreds = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/set-email-credentials`, data);

const setSiteConfig = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-config`, data);

const disableUser = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-disable-until`, data);

const setSessionLimit = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-session-time`, data);

const getCMSDynamicKeys = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/cms-dynamic-data`);

const getAllSABanners = ({ limit, pageNo }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/admin/get-banner?limit=${limit}&pageNo=${pageNo}`
  );

const uploadSABanner = (data) =>
  postRequest(`${REACT_APP_API_URL}/api/admin/upload-banner`, data);

const updateSABanner = (data) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/update-banner`, data);
const deleteEmailTemplateLanguage = ({ data }) =>
  deleteRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/delete-email-template-language`,
    data
  );

const getEmailTypes = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/email-dynamic-data`);

const deleteCMSLanguage = ({ data }) =>
  deleteRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/delete-cms-language`,
    data
  );

const updateReorderGames = ({ data }) =>
  putRequest(`${REACT_APP_API_URL}/api/admin/order-category-games`, data);

const addInternalTag = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/set-user-internal`, data);

const getLanguageSupportKeys = ({ language }) =>
  getRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/get-language-support-keys?language=${language}`
  );

const uploadLanguageCSV = ({ data }) =>
  postRequest(`${REACT_APP_API_URL}/api/${"admin"}/load-language-file`, data);

const updateLanguageSupport = ({ data }) =>
  putRequest(
    `${REACT_APP_API_URL}/api/${"admin"}/update-language-support`,
    data
  );

const getCMSLanguage = () =>
  getRequest(`${REACT_APP_API_URL}/api/admin/get-cms-language`);

const getElasticHealth = () =>
  getRequest(`${REACT_APP_API_URL}/api/${"admin"}/elastic-health-check`);

export {
  superAdminLogin,
  getAllAdmins,
  getAllCurrencies,
  createCurrency,
  editCurrency,
  getAllAffiliates,
  getAllCms,
  getAllUsers,
  updateGame,
  getAdminRole,
  getAdmin,
  getCurrencyById,
  getUser,
  updateTheme,
  createTheme,
  getAllCredentials,
  getAdminUserDetails,
  createCms,
  getSAdminWallet,
  getAffiliateById,
  getCmsByPageId,
  getCasinoSubCategories,
  updateCasinoCategory,
  getAllCasinoProviders,
  getAllCasinoGames,
  getCountries,
  createSAdminUser,
  updateSAdminUser,
  getSAdminDetails,
  createCasinoGame,
  createCasinoProvider,
  updateCasinoGame,
  updateCasinoProvider,
  getAllSAdminTransactions,
  getSAdminTransactionUsers,
  getSAdminAggregators,
  createSAdminAggregator,
  getSAdminGameCategory,
  getSAdminGameSubCategory,
  createCasinoSubCategory,
  updateSubCategory,
  getGames,
  depositToOwner,
  getMasterGames,
  addGamesToSubCategory,
  deleteGame,
  updateSubCategoryReOrder,
  updateCategoryReOrder,
  getRestrictedItems,
  getUnRestrictedItems,
  addRestrictedItems,
  deleteRestrictedItems,
  getRestrictedCountries,
  getUnRestrictedCountries,
  deleteRestrictedCountries,
  addRestrictedCountries,
  addDepositToOther,
  getSAdminCasinoTransactions,
  getAllClients,
  createCasinoCategory,
  isDomainExist,
  updateSAdminCMS,
  superAdminViewToggleStatus,
  deleteCategory,
  deleteSubCategory,
  getAllWithdrawRequestSAdmin,
  getAllSAProviders,
  getAllTAProviders,
  getGlobalRegistration,
  updateGlobalRegistration,
  getSAConvertAmount,
  getAllBonus,
  createBonus,
  updateBonus,
  getBonus,
  issueBonus,
  getUserBonus,
  cancelBonus,
  getUserDocument,
  verifyUserDocument,
  getDocumentLabel,
  updateDocumentLabel,
  createDocumentLabel,
  requestDocument,
  cancelDocumentRequest,
  getPaymentMethod,
  getSAdminPlayerManagement,
  getSAdminLivePlayerReport,
  getSAPlayerLiability,
  getSAKPISummary,
  getSAKPIReport,
  getSAGameReport,
  getSAPlayerGameReport,
  getFreeSpinGames,
  getloyaltyLevel,
  updateloyaltyLevel,
  getLanguages,
  getEmailTemplates,
  getEmailTemplate,
  primaryEmailTemplate,
  updateEmailTemplate,
  createEmailTemplate,
  getDynamicKeys,
  getAdminChildren,
  updateProfile,
  getAllGroups,
  getImageGallery,
  deleteFromGallery,
  testEmailTemplateEndPoint,
  setDailyLimit,
  setDepositLimit,
  setLossLimit,
  getOwnerPermissions,
  setEmailCreds,
  disableUser,
  setSessionLimit,
  getCMSDynamicKeys,
  toggleStatus,
  deleteEmailTemplateLanguage,
  getEmailTypes,
  getAllSABanners,
  uploadSABanner,
  updateSABanner,
  deleteCMSLanguage,
  updateReorderGames,
  addInternalTag,
  getLanguageSupportKeys,
  uploadLanguageCSV,
  updateLanguageSupport,
  getCMSLanguage,
  getElasticHealth,
  setSiteConfig,
  getSiteConfigDetails,
};
