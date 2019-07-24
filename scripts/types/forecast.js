'use strict'

function Forecast (logs) {
  function predict (logs) {
    const section = trim(logs)
    const offset = {
      leisure: section.habit.sectors.leisure - section.recent.sectors.leisure,
      research: section.habit.sectors.research - section.recent.sectors.research,
      programming: section.habit.sectors.programming - section.recent.sectors.programming
    }

    const sectors = sortHash(offset)
    const normalized = normalize(sectors)
    const sector = normalized[0]
    const sector_code = ['leisure', 'research', 'programming'].indexOf(sector[0]) + 1
    const sector_value = 1 - normalized[1][1]
    const code = `-${sector_code}${parseInt(section.recent.ch)}${parseInt(sector_value * 10)}`
    return new Log({ code: code })
  }

  function trim (logs) {
    const habits = []
    const recents = []

    for (const id in logs) {
      const log = logs[id]
      if (id < 14 * 2) { recents.push(log); continue }
      if (id < 14 * 10) { habits.push(log); continue }
      break
    }

    return { habit: new Horaire(habits), recent: new Horaire(recents) }
  }

  function normalize (sectors) {
    const bump = -sectors[sectors.length - 1][1]
    const sectors_mined = sectors.map((val) => { return [val[0], val[1] + bump] })
    const limit = sectors_mined[0][1]
    return sectors_mined.map((val) => { return [val[0], val[1] / limit] })
  }

  return predict(logs)
}
