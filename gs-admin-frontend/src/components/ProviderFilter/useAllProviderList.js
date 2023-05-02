import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSAProvidersStart } from "../../store/redux-slices/superAdminCasinoManagement";

const useAllProviderList = () => {
  const dispatch = useDispatch();
  const { allProviders } = useSelector((state) => state.superAdminCasino);

  useEffect(() => {
    if (!allProviders) {
      dispatch(getAllSAProvidersStart());
    }
  }, []);

  return {
    allProviders,
  };
};

export default useAllProviderList;
