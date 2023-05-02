import { useSelector } from 'react-redux'

const useCheckPermission = () => {
  const { adminPermissions } = useSelector(state => state.admins)
  const isHidden = ({ module }) => {
    return !(adminPermissions && (Object.keys(adminPermissions).includes(module.key) && adminPermissions[module.key].includes(module.value)))
  }
  return { isHidden }
}
export default useCheckPermission
