'use strict'

function Viz (logs, from, to, showDetails = true) {
  this.logs = slice(logs, from, to)

  const cell = 13

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
    <rect class="leisure" x="${cell * 0}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 2}' y='125' style='text-anchor:start'>Leisure ${_perc(horaire.sectors.leisure, sum)}%</text>
    <rect class="research" x="${(cell + 1) * 9}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 11}' y='125' style='text-anchor:start'>Research ${_perc(horaire.sectors.research, sum)}%</text>
    <rect class="programming" x="${(cell + 1) * 18}" y="115" width="13" height="13" rx="2" ry="2" title="17O11"></rect>
    <text x='${(cell + 1) * 20}' y='125' style='text-anchor:start'>Programming ${_perc(horaire.sectors.programming, sum)}%</text>
    <text x='725' y='125' style='text-anchor:end'>${horaire.fhs.toFixed(0)} Hours</text>`
  }

  function _status (data) {
    if (!showDetails || data.recent.length < 2 || data.before.length < 2) { return '' }

    const recent = new Horaire(data.recent)
    const before = new Horaire(data.before)

    return `
    <line x1='0' y1='${cell * 11.5}' x2='730' y2='${cell * 11.5}'/>
    <text class='display' x='${0}' y='${cell * 16.5}'>${recent.ch.toFixed(2)}</text>
    <text class='display small' x='${cell * 7}' y='${cell * 15.1}'>${offset(recent.ch, before.ch)}</text>
    <text class='display small' x='${cell * 7}' y='${cell * 16.5}' style='font-family: var(--mono);'>ch/day</text>

    <text class='display' x='${180}' y='${cell * 16.5}'>${recent.fh.toFixed(2)}</text>
    <text class='display small' x='${180 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.fh, before.fh)}</text>
    <text class='display small' x='${180 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>fh/day</text>

    <text class='display' x='${360}' y='${cell * 16.5}'>${recent.os.toFixed(2).substr(0, 4)}</text>
    <text class='display small' x='${360 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.os, before.os)}</text>
    <text class='display small' x='${360 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>focus</text>

    <text class='display' x='${550}' y='${cell * 16.5}'>${recent.balance.toFixed(2).substr(0, 4)}</text>
    <text class='display small' x='${550 + (cell * 7)}' y='${cell * 15.1}'>${offset(recent.balance, before.balance)}</text>
    <text class='display small' x='${550 + (cell * 7)}' y='${cell * 16.5}' style='font-family: var(--mono);'>balance</text>
    `
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
    <svg class='viz ${data.recent.length < 2 || data.before.length < 2 ? 'no_status' : ''}'>
      ${_legend(this.logs)}
      ${_status(data)}
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
    const cell = parseInt(700 / 52)
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
        html += log && log.pict ? `<circle cx='${x + (cell / 2)}' cy='${y + (cell / 2)}' r='2.5' class='photo'></circle>` : ''
        html += log && log.isEvent ? `<circle cx='${x + (cell / 2)}' cy='${y + (cell / 2)}' r='2' class='event'></circle>` : ''
        day += 1
      }
      week += 1
    }

    return html
  }
}

function BarViz (logs) {
  Viz.call(this, logs, -365 * 10, 0)

  function parse (logs, parts = 51) {
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
    const segments = parse(this.logs)
    const cell = 13
    const mod = 0.18
    return Object.keys(segments).reduce((acc, val, id) => {
      const seg = segments[val]
      const x = parseInt(id) * (cell + 1)
      const leisure_h = clamp(seg.leisure * mod, 4, 100)
      const leisure_y = leisure_h + 30
      const research_h = clamp(seg.research * mod, 4, 100)
      const research_y = (research_h + leisure_y) + 0.5
      const programming_h = clamp(seg.programming * mod, 4, 100)
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
  Viz.call(this, logs, -52 * 2, 0)

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

  function make_balance (logs, offset) {
    const sliced_logs = slice(logs, offset - 52, offset)
    const sectors = { leisure: 0, research: 0, programming: 0, sum: 0 }

    for (const id in sliced_logs) {
      const log = sliced_logs[id]
      if (!log.term) { continue }
      sectors[log.sector] += (log.fh + log.ch) / 2
      sectors.sum += (log.fh + log.ch) / 2
    }

    return {
      leisure: sectors.leisure > 0 ? (sectors.leisure / sectors.sum) : 0,
      research: sectors.research > 0 ? (sectors.research / sectors.sum) : 0,
      programming: sectors.programming ? (sectors.programming / sectors.sum) : 0
    }
  }

  function parse (logs) {
    const days = []
    let day = 53
    while (day > 0) {
      days.push(make_balance(logs, -day))
      day -= 1
    }
    return days
  }

  this.draw = function () {
    const data = parse(this.logs)

    let html = ''
    let day = 52
    const cell = 13
    const height = 95
    const y = 0
    while (day > 0) {
      const x = parseInt(day * (cell + 1) - (cell))
      const bal = data[day]
      const h_programming = parseInt(100 * bal.programming)
      const h_research = parseInt(100 * bal.research)
      const h_leisure = height - h_research - h_programming
      html += `<rect class='programming' x='${x}' y='${y}' width='${cell}' height='${clamp(h_programming, 0)}' rx="2" ry="2"></rect>`
      html += `<rect class='research' x='${x}' y='${h_programming + 1}' width='${cell}' height='${clamp(h_research, 0)}' rx="2" ry="2"></rect>`
      html += `<rect class='leisure' x='${x}' y='${h_programming + h_research + 2}' width='${cell}' height='${clamp(h_leisure, 0)}' rx="2" ry="2"></rect>`
      day -= 1
    }

    return html
  }

  function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
}
