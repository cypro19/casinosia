import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllBonusStart } from '../../../../store/redux-slices/admins'
import { updateSABonusStatusStart } from '../../../../store/redux-slices/bonus'
import { useDidMountEffect } from '../../../../utils/useDidMountEffect'

const useBonus = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isInitialRender = useDidMountEffect()

  const { bonusList, loading } = useSelector((state) => state.admins)
  const [show, setShow] = useState(false)
  const [active, setActive] = useState('')
  const [bonusId, setBonusId] = useState(false)
  const [limit, setLimit] = useState(15)
  const [page, setPage] = useState(1)
  const [bonusTyp, setBonusTyp] = useState('')
  const [search, setSearch] = useState('')
  const [isActive, setIsActive] = useState('')
  const totalPages = Math.ceil(bonusList?.count / limit)

  const handleShow = (id, active) => {
    setBonusId(id)
    setActive(!active)
    setShow(true)
  }

  const handleYes = () => {
    dispatch(
      updateSABonusStatusStart({
        data: {
          code: 'BONUS',
          status: active,
          bonusId
        },
        limit,
        pageNo: page,
        search,
        bonusType: bonusTyp === '' ? '' : JSON.stringify([bonusTyp]),
        isActive
      })
    )
    setShow(false)
  }

  useEffect(() => {
    !isInitialRender && dispatch(getAllBonusStart({
      limit,
      pageNo: page,
      search,
      bonusType: bonusTyp === '' ? '' : JSON.stringify([bonusTyp]),
      isActive
    }))
  }, [page])
  useEffect(() => {
    setPage(1)
    dispatch(getAllBonusStart({
      limit,
      pageNo: 1,
      search,
      bonusType: bonusTyp === '' ? '' : JSON.stringify([bonusTyp]),
      isActive
    }))
  }, [limit, bonusTyp, isActive])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isInitialRender) {
        if (page === 1) {
          dispatch(getAllBonusStart({
            limit,
            pageNo: page,
            search,
            bonusType: bonusTyp === '' ? '' : JSON.stringify([bonusTyp]),
            isActive
          })
          )
        } else {
          setPage(1)
        }
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return {
    navigate,
    loading,
    bonusList,
    handleShow,
    handleYes,
    show,
    setShow,
    active,
    limit,
    setLimit,
    setPage,
    page,
    totalPages,
    bonusTyp,
    setBonusTyp,
    search,
    setSearch,
    isActive,
    setIsActive
  }
}

export default useBonus
