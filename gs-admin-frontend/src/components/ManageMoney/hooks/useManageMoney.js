import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addDepositToOtherStart } from "../../../store/redux-slices/players";

const useManageMoney = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  const deposit = (data) => {
    dispatch(
      addDepositToOtherStart({
        data: {
          addAmount:
            data?.transactionType === "add-money"
              ? parseFloat(data?.addAmount.toFixed(2))
              : parseFloat(data?.addAmount?.toFixed(2)) * -1,
          walletType: data?.walletType === "cash" ? "CASH" : "NONCASH",
          userId,
        },
      })
    );
  };

  return {
    deposit,
  };
};

export default useManageMoney;
