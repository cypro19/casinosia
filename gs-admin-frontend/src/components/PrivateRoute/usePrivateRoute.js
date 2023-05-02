import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAdminRoleStart } from "../../store/redux-slices/login";
import { getSAdminDetailsStart } from "../../store/redux-slices/admins";
import { getLoginToken } from "../../utils/storageUtils";
import { AdminRoutes } from "../../routes";

const usePrivateRoute = () => {
  const accessToken = getLoginToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.login);

  useEffect(() => {
    if (accessToken) {
      dispatch(getAdminRoleStart());
      dispatch(getSAdminDetailsStart());
    } else {
      navigate(AdminRoutes.AdminSignin);
    }
  }, [accessToken]);

  return {
    accessToken,
    loading,
  };
};

export default usePrivateRoute;
