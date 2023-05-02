import { toast } from '../components/Toast'

export const downloadFile = (url) => {
  const element = document.createElement('a')
  console.log('url, ', url)
  element.setAttribute('href', url)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()
  document.body.removeChild(element)

  toast('CSV downloaded', 'success', 'csvDownloadSuccess')
}
