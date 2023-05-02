import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setEmailCredsStart,
  setProfileTab,
  setSiteConfigurationStart,
  updateProfileStart,
} from "../../store/redux-slices/login";
import { getSAdminDetails, getSiteConfigDetails } from "../../utils/apiCalls";

const useProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [editableCreds, setEditableCreds] = useState(false);
  const [siteConfigEditable, setSiteConfigEditable] = useState(false);
  const [details, setDetails] = useState();
  const [type, setType] = useState("password");
  const {
    loading,
    profileTab: selectedTab,
    siteConfigLoading,
  } = useSelector((state) => state.login);
  const { adminDetails } = useSelector((state) => state.admins);

  const setSelectedTab = (val) => {
    dispatch(setProfileTab(val));
  };
  const updateData = (data) => {
    dispatch(
      updateProfileStart({
        data,
      })
    );
    setEditable(false);
  };

  const [preview, setPreview] = useState({
    image_preview: null,
    image_file: null,
  });

  const handleImagePreview = (e) => {
    if (e.target.files[0]) {
      const imageAsBase64 = URL.createObjectURL(e.target.files[0]);
      const imageAsFiles = e.target.files[0];
      setPreview({
        image_preview: imageAsBase64,
        image_file: imageAsFiles,
      });
    }
  };

  const updateCredentials = ({ data }) => {
    dispatch(
      setEmailCredsStart({
        data: {
          sendgridKey: Buffer.from(data.sendgridKey).toString("base64"),
          sendgridEmail: Buffer.from(data.sendgridEmail).toString("base64"),
        },
      })
    );
    setEditableCreds(false);
  };

  const updateSiteConfig = ({ data }) => {
    dispatch(
      setSiteConfigurationStart({
        data: {
          site_name: data?.siteName,
          support_email: data?.supportEmailAddress,
          origin: data?.siteUrl,
          image: data?.siteLogo,
        },
        setEditable: setSiteConfigEditable,
      })
    );
  };

  useEffect(() => {
    async function fetchData() {
      await getSAdminDetails().then((res) => {
        setDetails(res?.data?.data?.adminDetails);
      });
      await getSiteConfigDetails().then((res) => {
        setDetails((det) => ({
          ...det,
          siteConfig: res?.data?.data?.getConfig,
        }));
      });
    }
    fetchData();
    // return(() => dispatch(setProfileTab('overview')))
  }, []);

  return {
    details,
    selectedTab,
    setSelectedTab,
    navigate,
    editable,
    setEditable,
    updateData,
    loading,
    type,
    setType,
    editableCreds,
    updateCredentials,
    adminDetails,
    setEditableCreds,
    siteConfigEditable,
    setSiteConfigEditable,
    updateSiteConfig,
    preview,
    handleImagePreview,
    siteConfigLoading,
  };
};

export default useProfilePage;
