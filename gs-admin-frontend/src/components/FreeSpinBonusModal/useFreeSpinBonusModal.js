import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllBonusStart } from "../../store/redux-slices/admins";
import { issueBonusStart } from "../../store/redux-slices/bonus";
import {
  getAllCasinoGamesStart,
  getAllMasterGamesStart,
} from "../../store/redux-slices/superAdminCasinoManagement";
import { useDidMountEffect } from "../../utils/useDidMountEffect";

const useFreeSpinBonusModal = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const {
    casinoGamesData,
    masterGames,
    loading: superAdminLoading,
  } = useSelector((state) => state.superAdminCasino);
  const [search, setSearch] = useState("");
  const isInitialRender = useDidMountEffect();
  const [gameIds, setGameIds] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  const { bonusList } = useSelector((state) => state.admins);

  const getTAGames = () => {
    dispatch(
      getAllMasterGamesStart({
        limit: "",
        pageNo: "",
        search,
        casinoCategoryId: "",
        providerId: "",
        freespins: true,
      })
    );
  };

  const getSAGames = () => {
    dispatch(
      getAllCasinoGamesStart({
        limit: "",
        pageNo: "",
        casinoCategoryId: "",
        search,
        isActive: "",
        selectedProvider: "",
        freespins: true,
        bonusId: "",
      })
    );
  };

  useEffect(() => {
    getSAGames();
    dispatch(
      getAllBonusStart({
        adminId: "",
        limit: "",
        pageNo: "",
        search: "",
        bonusType: JSON.stringify(["freespins"]),
        isActive: "",
        userId,
      })
    );
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        getSAGames();
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelect = (e, id) => {
    if (!e.target.checked) {
      setGameIds(gameIds.filter((gameId) => gameId != id));
    } else {
      const data = [...gameIds];
      data.unshift(id);
      setGameIds(data);
    }
  };

  const availableGames = casinoGamesData || masterGames;
  const getData = (type, gameId) => {
    const data = gamesData?.find((game) => game.masterCasinoGameId === gameId);
    if (type === "name") {
      return data?.name;
    } else {
      return data?.masterCasinoGameId;
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const data = [...gameIds];
      for (const index in availableGames) {
        const id = availableGames?.[index]?.masterCasinoGameId;
        !data.includes(id) && data.push(id);
      }
      setGameIds(data);
    } else {
      let data = [...gameIds];
      for (const index in availableGames) {
        const gameId = availableGames?.[index]?.masterCasinoGameId;
        data = data.filter((id) => id !== gameId);
      }
      setGameIds(data);
    }
  };

  const bonusOptions = [];
  bonusList?.length > 0 &&
    bonusList.forEach(function (element) {
      bonusOptions.push({
        label: `${element.promotionTitle?.EN} (${element.bonusId})`,
        value: element.bonusId,
      });
    });

  const submitData = (formValues) => {
    dispatch(
      issueBonusStart({
        data: {
          ...formValues,
          gameIds,
          userId,
        },
      })
    );
  };

  return {
    masterGames,
    casinoGamesData,
    search,
    setSearch,
    bonusList,
    handleSelect,
    handleSelectAll,
    gameIds,
    setGameIds,
    availableGames,
    getData,
    bonusOptions,
    submitData,
    gamesData,
    setGamesData,
    loading: superAdminLoading,
  };
};

export default useFreeSpinBonusModal;
