'use strict'

function Viz (logs, from, to, showDetails = true) {
  this.logs = slice(logs, from, to)

  const cell = 12

  function slice (logs, from, to) {
    const a = []
    for (const id in logs) {
      const log = logs[id]
      if (log.time.offset < from) { continue }
      if (log.time.offset > to) { continue }
      a.push(log)
    }
    return a
  }

  function offset (recent, before, trail = 1) {
    const print = recent - before > 0 ? `+${(recent - before).toFixed(trail)}` : `${(recent - before).toFixed(trail)}`
    return print !== '-0.0' && print !== '+0.0' ? print : '0.0'
  }

  function _perc (val, sum) {
    return ((val / sum) * 100).toFixed(1)
  }

  function _legend (logs) {
    if (!showDetails) { return '' }
    const horaire = new Horaire(logs)
    const sum = horaire.sectors.leisure + horaire.sectors.research + horaire.sectors.programming

    return `
    <rect class="Leisure" x="${cell * 0}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 2}' y='115' style='text-anchor:start'>Leisure ${_perc(horaire.sectors.Leisure, sum)}%</text>
    <rect class="Research" x="${(cell + 1) * 9}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 11}' y='115' style='text-anchor:start'>Research ${_perc(horaire.sectors.Research, sum)}%</text>
    <rect class="Programming" x="${(cell + 1) * 18}" y="105" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 20}' y='115' style='text-anchor:start'>Programming ${_perc(horaire.sectors.Programming, sum)}%</text>
    <text x='675' y='115' style='text-anchor:end'>${horaire.fhs.toFixed(0)} Hours</text>`
  }

  this.draw = function () {
    return ''
  }

  this.toString = function () {
    if (this.logs.length < 1) { return '' }

    const data = { recent: [], before: [] }
    // Split the last 14 days
    for (const id in this.logs) {
      const log = this.logs[id]
      const offset = log.time.offset
      if (offset > 0) { continue }
      if (offset > -(this.logs.length / 2)) { data.recent[data.recent.length] = log } else { data.before[data.before.length] = log }
    }

    return `
    <svg class='viz'>
      ${_legend(this.logs)}
      ${this.draw()}
    </svg>`
  }
}

function ActivityViz (logs) {
  Viz.call(this, logs, -365, 0)

  function parse (logs) {
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      if (offset > 0) { continue }
      if (offset < -364) { break }
      h[log.time.offset] = log
    }
    return h
  }

  this.draw = function () {
    const data = parse(this.logs)
    const cell = 12
    let html = ''
    let week = 0
    while (week < 52) {
      const x = parseInt(week * (cell + 1))
      let day = 0
      while (day < 7) {
        const y = parseInt(day * (cell + 1))
        const offset = (365 - (week * 7) - (day + 1)) * -1
        const log = data[offset + 1]
        html += log && log.sector ? `<rect class='${log.sector} ${log.time.offset === 0 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2" title='${log.time}' data-goto='${log.term}'></rect>` : `<rect class='missing ${day === 6 && week === 51 ? 'today' : ''}' x='${x}' y='${y}' width='${cell}' height='${cell}' rx="2" ry="2"></rect>`
        day += 1
      }
      week += 1
    }

    return html
  }
}

function BarViz (logs) {
  Viz.call(this, logs, -365 * 10, 0)

  function distribute (logs, parts = 51) {
    const limit = logs[logs.length - 1].time.offset * -1
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      const pos = parts - (((offset * -1) / limit) * parts)
      const share = (pos - Math.floor(pos))

      if (!h[Math.floor(pos)]) { h[Math.floor(pos)] = { leisure: 0, research: 0, programming: 0 } }
      if (!h[Math.ceil(pos)]) { h[Math.ceil(pos)] = { leisure: 0, research: 0, programming: 0 } }
      if (!h[Math.floor(pos)][log.sector]) { h[Math.floor(pos)][log.sector] = 0 }
      if (!h[Math.ceil(pos)][log.sector]) { h[Math.ceil(pos)][log.sector] = 0 }

      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch) / 2) * (1 - share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch) / 2) * share
    }
    return h
  }

  this.draw = function () {
    const segments = distribute(this.logs)
    const cell = 12
    const mod = 0.16
    return Object.keys(segments).reduce((acc, val, id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell + 1)
      const leisure_h = clamp(seg.leisure * mod, 4, 100)
      const leisure_y = Leisure_h + 35
      const research_h = clamp(seg.research * mod, 4, 100)
      const research_y = (research_h + leisure_y) + 0.5
      const programming_h = clamp(seg.research * mod, 4, 100)
      const programming_y = (programming_h + research_y) + 0.5
      return `${acc}
      <rect class='leisure' x='${x}' y='${125 - leisure_y}' width='${cell}' height='${leisure_h}' rx="2" ry="2"></rect>
      <rect class='research' x='${x}' y='${125 - research_y}' width='${cell}' height='${research_h}' rx="2" ry="2"></rect>
      <rect class='programming' x='${x}' y='${125 - programming_y}' width='${cell}' height='${programming_h}' rx="2" ry="2"></rect>`
    }, '')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

function BalanceViz (logs) {
  Viz.call(this, logs, -365 * 10, 0)

  function distribute (logs, parts = 51) {
    const limit = logs[logs.length - 1].time.offset * -1
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const offset = log.time.offset
      const pos = parts - (((offset * -1) / limit) * parts)
      const share = (pos - Math.floor(pos))
      if (!h[Math.floor(pos)]) { h[Math.floor(pos)] = { leisure: 0, research: 0, programming: 0 } }
      if (!h[Math.ceil(pos)]) { h[Math.ceil(pos)] = { leisure: 0, research: 0, programming: 0 } }
      if (!h[Math.floor(pos)][log.sector]) { h[Math.floor(pos)][log.sector] = 0 }
      if (!h[Math.ceil(pos)][log.sector]) { h[Math.ceil(pos)][log.sector] = 0 }
      h[Math.floor(pos)][log.sector] += ((log.fh + log.ch) / 2) * (1 - share)
      h[Math.ceil(pos)][log.sector] += ((log.fh + log.ch) / 2) * share
    }
    return h
  }

  this.draw = function () {
    const segments = distribute(this.logs)
    const cell = 12
    const mod = 0.16
    return Object.keys(segments).reduce((acc, val, id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell + 1)
      const sum = seg.leisure + seg.research + seg.programming
      const leisure_h = Math.floor(clamp((seg.leisure / sum) * 90, 4, 125))
      const leisure_y = 0
      const research_h = Math.floor(clamp((seg.research / sum) * 90, 4, 125))
      const research_y = leisure_h + 0.5
      const programming_h = 89 - leisure_h - research_h
      const programming_y = (leisure_h + research_h) + 1
      return `${acc}
      <rect class='leisure' x='${x}' y='${leisure_y}' width='${cell}' height='${leisure_h}' rx="2" ry="2"></rect>
      <rect class='research' x='${x}' y='${research_y}' width='${cell}' height='${research_h}' rx="2" ry="2"></rect>
      <rect class='programming' x='${x}' y='${programming_y}' width='${cell}' height='${programming_h}' rx="2" ry="2"></rect>`
    }, '')
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}

function HoraireViz (logs) {
  const w = 160
  const end = new Date() // 5 years ago
  const start = new Date(new Date() - (31536000 * 1000 * 5)) // 5 years ago
  const offset = Math.ceil((new Date(2009) - new Date()) / 86400000)

  function distribute (logs, parts) {
    const limit = logs[logs.length - 1].time.offset * -1
    const h = {}
    for (const id in logs) {
      const log = logs[id]
      const ratio = (log.time.date - start) / (end - start)
      if (ratio < 0) { continue }
      const pos = ratio * parts
      const share = (pos - Math.floor(pos))
      const low = Math.floor(pos)
      const high = Math.ceil(pos)
      const value = log.ch / log.fh
      if (!h[low]) { h[low] = 0 }
      if (!h[high]) { h[high] = 0 }
      h[low] += value * (1 - share)
      h[high] += value * share
    }
    return h
  }

  this.toString = function (parts = 28, height = 20) {
    const segments = distribute(logs, parts)
    let html = ''
    let prev = 0
    let max = Math.max(...Object.values(segments))
    const real = []
    for (let i = 0; i < parts; i++) {
      const v = !isNaN(segments[i]) ? segments[i] : 0
      real.push((1 - (v / max)) * height)
    }
    for (const i in real) {
      const x = (parseInt(i) * 3) + 2
      const y = real[i]
      const before = !isNaN(real[i - 1]) ? real[i - 1] : height
      const after = !isNaN(real[i + 1]) ? real[i + 1] : height
      const soften = ((y + before + after) / 3)
      html += `M${x},${height} L${x},${parseInt(soften)} `
    }
    return `<svg class='horaire' style='width:${parts * 3}px; height: ${height + 4}px'><path d="${html}"/></svg>`
  }
}