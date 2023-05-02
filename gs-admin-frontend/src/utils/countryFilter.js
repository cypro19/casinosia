import { countryFlag } from '../components/TopPlayers/countryFlag'

const filterWorker = (filter) => {
  const filterData = countryFlag.filter((item) => item.code === filter)[0]
  const countryImage = filterData?.image
  const countryName = filterData?.name

  return { countryImage, countryName }
}

const memoryHandler = (fWorker) => {
  const memory = {}
  return (...args) => {
    const exist = args[0]

    if (exist in memory) {
      return memory[exist]
    } else {
      const result = fWorker(exist)
      memory[exist] = result
      return result
    }
  }
}

export const countryFilter = memoryHandler(filterWorker)
