'use strict'

RIVEN.create = (append = true) => {
  const lib = RIVEN.lib

  Ø('mouse').create({ x: 0, y: 4 }, lib.Mouse)

  Ø('init').create({ x: 0, y: 0 }, lib.Init)
  Ø('query').create({ x: 6, y: 6 }, lib.Query)

  Ø('model').create({ x: 12, y: 4 }, lib.Mesh, [
    Ø('router').create({ x: 3, y: 0 }, lib.Router),
    Ø('database').create({ x: 0, y: 4 }, lib.Database),
    Ø('lexicon').create({ x: 3, y: 8 }, lib.Table, indental, Term),
    Ø('horaire').create({ x: 6, y: 8 }, lib.Table, tablatal, Log),
    Ø('issues').create({ x: 9, y: 8 }, lib.Table, indental, Issue),
    Ø('map').create({ x: 3, y: 4 }, lib.Map)
  ])

  Ø('controller').create({ x: 32, y: 4 }, lib.Mesh, [
    Ø('template').create({ x: 0, y: 0 }, lib.Template),
    Ø(':default').create({ x: 0, y: 4 }, lib.DefaultTemplate),
    Ø(':journal').create({ x: 3, y: 4 }, lib.JournalTemplate),
    Ø(':calendar').create({ x: 6, y: 4 }, lib.CalendarTemplate),
    Ø(':tracker').create({ x: 9, y: 4 }, lib.TrackerTemplate),
    Ø('static').create({ x: 3, y: 8 }, lib.StaticService)
  ])

  Ø('view').create({ x: 49, y: 4 }, lib.Mesh, [
    Ø('document').create({ x: 0, y: 0 }, lib.Document, append),
    Ø('header').create({ x: 0, y: 4 }, lib.Dom),
    Ø('photo').create({ x: 0, y: 8 }, lib.Photo, 'photo'),
    Ø('menu').create({ x: 3, y: 8 }, lib.Dom),
    Ø('logo').create({ x: 6, y: 12 }, lib.Dom, 'a', null, { 'data-goto': 'home', href: '#home', class: 'sprite_logo' }),
    Ø('activity').create({ x: 3, y: 12 }, lib.Dom, 'ul'),
    Ø('info').create({ x: 0, y: 12 }, lib.Dom),
    Ø('glyph').create({ x: 3, y: 16 }, lib.Path),
    Ø('title').create({ x: 0, y: 16 }, lib.Dom),
    Ø('core').create({ x: 12, y: 4 }, lib.Dom),
    Ø('content').create({ x: 15, y: 8 }, lib.Dom),
    Ø('main').create({ x: 12, y: 12 }, lib.Dom),
    Ø('tracker').create({ x: 15, y: 12 }, lib.Dom),
    Ø('calendar').create({ x: 18, y: 12 }, lib.Dom),
    Ø('journal').create({ x: 21, y: 12 }, lib.Dom),
    Ø('sidebar').create({ x: 12, y: 8 }, lib.Dom),
    Ø('navi').create({ x: 18, y: 8 }, lib.Dom),
    Ø('footer').create({ x: 21, y: 4 }, lib.Dom),
    Ø('credits').create({ x: 21, y: 8 }, lib.Dom, 'div', `
    <a target='_blank' rel='noreferrer' href='https://twitter.com/lainsdev' class='icon twitter sprite_twitter external'></a>
    <a target='_blank' rel='noreferrer' href='https://github.com/lainsce' class='icon github sprite_github external'></a>
    <img class='icon' style="vertical-align: middle; margin-right: 20px;" width="32" height="32" src="/media/generic/me.svg" alt="My Icon" >
    <a href='/'>Lains</a> © ${new Arvelie('17M05').toString(true)}—${arvelie()}<hr>
    `)
  ])

  Ø('init').syphon(['database', 'document', 'query'])

  Ø('mouse').connect('query')

  // Model
  Ø('router').syphon('database')
  Ø('router').connect('template')
  Ø('database').syphon(['issues', 'horaire', 'lexicon'])
  Ø('query').connect('router')
  Ø('database').connect('map')
  Ø('template').connect('document')

  // Controller
  Ø('template').syphon([':default', ':calendar', ':journal', ':tracker'])

  // Dom
  Ø('header').bind(['photo', 'menu'])
  Ø('menu').bind(['info', 'logo', 'activity'])
  Ø('info').bind(['glyph', 'title'])
  Ø('document').bind(['header', 'core', 'footer'])
  Ø('core').bind(['sidebar', 'content', 'navi'])
  Ø('content').bind(['main', 'journal', 'tracker', 'calendar'])

  Ø('footer').bind(['credits'])

  // Start
  Ø('init').request()
  Ø('init').bang()
}