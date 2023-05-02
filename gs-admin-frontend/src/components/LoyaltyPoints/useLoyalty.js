import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getloyaltyLevelStart,
  updateloyaltyLevelStart,
} from "../../store/redux-slices/superAdminSettings";

const useLoyalty = () => {
  const dispatch = useDispatch();
  const { loading, loyaltyLevel } = useSelector(
    (state) => state.superAdminSettings
  );
  const [myLevels, setMyLevels] = useState(loyaltyLevel);

  useEffect(() => {
    !loyaltyLevel && dispatch(getloyaltyLevelStart());

    loyaltyLevel &&
      setMyLevels(
        loyaltyLevel.map((lvl) => ({
          ...lvl,
          cashback_multiplier: (lvl.cashback_multiplier * 100).toFixed(),
        }))
      );
  }, [loyaltyLevel]);

  const updateloyaltyLevel = (loyaltyLevel) => {
    const tempLoyaltyLevel = {
      loyaltyLevel: loyaltyLevel.loyaltyLevel.map((lvl) => ({
        ...lvl,
        cashback_multiplier: +lvl.cashback_multiplier / 100,
      })),
    };
    dispatch(updateloyaltyLevelStart({ loyaltyLevel: tempLoyaltyLevel }));
  };

  const addLevels = (levels) => {
    const lastLevel = levels?.[levels.length - 1]?.level;
    setMyLevels([
      ...levels,
      {
        level: lastLevel + 1,
        startPoint: "",
        endPoint: "",
        cashback_multiplier: "",
      },
    ]);
  };

  const deleteLevel = (levels) => {
    setMyLevels(levels.slice(0, levels?.length - 1));
  };

  return {
    loading,
    myLevels,
    updateloyaltyLevel,
    addLevels,
    deleteLevel,
  };
};

export default useLoyalty;
