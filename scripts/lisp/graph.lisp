'use strict'; PROJECTS.graph = `
; In the real world, it didn’t matter if I was there or not.
; When I realized that, I was no longer afraid of losing my body.
(dom:set-class dom:body "loading")
(def _terminal (dom:create "terminal"))
(def _termhand (dom:create "termhand"))
(def _termview (dom:create "termview" "textarea"))
; header
(def _header (dom:create "header"))
(def _photo (dom:create "photo"))
(def _menu (dom:create "menu"))
(def _info (dom:create "info"))
(def _activity (dom:create "activity" "ul"))
(def _logo (dom:create "logo" "a" "sprite_logo"))
(def _search (dom:create "search" "input"))
(def _title (dom:create "title"))
(def _glyph (dom:create-ns "glyph" "svg"))
(def _path (dom:create-ns "path" "path"))
; core
(def _core (dom:create "core"))
(def _sidebar (dom:create "sidebar"))
(def _content (dom:create "content"))
(def _portal (dom:create "portal"))
; footer
(def _footer (dom:create "footer"))
; set
(dom:set-attr _logo "data-goto" "home")
(dom:set-attr _path "transform" "scale(0.165,0.165) translate(-50,-50)")
(dom:set-attr _termview "spellcheck" "false")
(dom:set-html _activity 
  (concat 
    (wrap (link "calendar" "Calendar" "local calendar sprite_calendar") "li") 
    (wrap (link "journal" "Journal" "local journal sprite_journal") "li") 
    (wrap (link "tracker" "Tracker" "local tracker sprite_tracker") "li")))
; footer
(def __socials 
  (concat 
    (link "https://twitter.com/lainsdev" "" "icon twitter sprite_twitter external") 
    (link "https://github.com/lainsce" "" "icon github sprite_github external") 
    (link "https://merveilles.town/@lains" "" "icon merveilles sprite_merveilles external")
    (link "Lains") " © 17M05 — " (arvelie)))
; assemble
(dom:set-html _footer (wrap (concat __socials) "div" "wr"))
(dom:append _terminal (_termhand _termview))
(dom:append _glyph (_path))
(dom:append _info (_glyph _title))
(dom:append _menu (_info _logo _search _activity))
(dom:append _header (_photo _menu))
(dom:append _core (_sidebar _content _portal))
(dom:append dom:body (_terminal _header _core _footer))
`