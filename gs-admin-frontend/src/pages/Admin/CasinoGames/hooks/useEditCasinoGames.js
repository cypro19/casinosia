import { useDispatch, useSelector } from 'react-redux'
import { updateGameStart } from '../../../../store/redux-slices/superAdminCasinoManagement'

const useEditCasinoGames = () => {
  const { loading } = useSelector((state) => state.superAdminCasino)
  const dispatch = useDispatch()

  const editGames = ({
    data,
    limit,
    pageNo,
    casinoCategoryId,
    isActive,
    providerId
  }) =>
    dispatch(updateGameStart({
      data,
      limit,
      pageNo,
      casinoCategoryId: casinoCategoryId === null ? '' : casinoCategoryId,
      isActive,
      providerId
    }))

  return {
    editGames,
    loading
  }
}

export default useEditCasinoGames
