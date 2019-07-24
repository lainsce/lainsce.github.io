'use strict'

function Horaire (logs) {
  const h = { fhs: 0, chs: 0, osc: 0, terms: {}, tasks: {}, sectors: { audio: 0, visual: 0, research: 0 } }
  const range = { from: logs[logs.length - 1], to: logs[0] }

  for (const id in logs) {
    const log = logs[id]
    // Raw
    h.fhs += log.fh
    h.chs += log.ch
    h.osc += Math.abs(log.fh - log.ch)
    // Collections
    h.tasks[log.task] = h.tasks[log.task] ? h.tasks[log.task] + log.fh : log.fh
    h.terms[log.term] = h.terms[log.term] ? h.terms[log.term] + log.fh : log.fh
    h.sectors[log.sector] = h.sectors[log.sector] ? h.sectors[log.sector] + log.fh : log.fh
  }

  const balance = (1 - ((Math.abs(3.3333 - (h.sectors.audio / logs.length)) + Math.abs(3.3333 - h.sectors.visual / logs.length) + Math.abs(3.3333 - h.sectors.research / logs.length)) / 13.3333)) * 100

  return {
    range: range,
    // Raw
    fhs: h.fhs,
    chs: h.chs,
    osc: h.osc,
    // Average
    fh: h.fhs / logs.length, // Stamina
    ch: h.chs / logs.length, // Focus
    os: h.osc / logs.length, // Balance
    // Collections
    sectors: h.sectors,
    tasks: h.tasks,
    terms: h.terms,
    // Compiled
    balance: balance
  }
}
