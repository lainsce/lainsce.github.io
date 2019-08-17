'use strict'; PROJECTS.template = `

; database, mostly magic until neauoire finishes migrating.
(database:create "horaire" Tablatal Log)
(database:create "lexicon" Indental Term)
(database:create-index)
(database:map)

; display

(defn display-glyph (res) (
  (if 
    (res:glyph) 
    (dom:set-attr _path "d" (res:glyph)))))

(defn set-theme (pixels) (
  (if 
    (gt (dom:get-lum pixels) 170)
    (dom:set-class _header "light")
    (dom:set-class _header "dark"))))

(defn display-photo (res) (
  (if 
    (eq res:name "HOME")
    (def photo-log (until 
      (database:select "horaire") 
      (λ (a) (tunnel a "featured"))))
    (def photo-log 
      (res:photo)))
  (def photo-path 
    (concat "media/diary/" photo-log:pict ".jpg"))
  (if 
    photo-log 
    (dom:set-class _title "visible") 
    (dom:set-class _title "hidden"))
  (dom:set-html _title 
    (concat (link "Journal" photo-log:name) " — " (photo-log:time)))
  (if
    photo-log 
    (dom:get-pixels photo-path 0.1 set-theme)
    (dom:set-class _header "light"))
  (if photo-log
    (dom:del-class _header "no_photo")
    (dom:add-class _header "no_photo"))
  (if 
    photo-log
    (dom:set-html _photo (concat "<media id='media' style='background-image: url(" photo-path ")'></media>"))
    (dom:set-html _photo ""))))

(defn display-main (res) (
  (def _head 
    (res:head))
  (def __portal 
    (res:_portal))
  (if 
    (is:real res:data)
    (def _body 
      (concat (res:body) (res:horaire)))
    (
      (def similar-terms
        (similars (uc res:name) (keys database:index)))
      (def similar-text 
        (concat 
          "Did you mean " 
          (bold (link (tc (tunnel similar-terms:0 "word")))) ", " 
          (link (tc (tunnel similar-terms:1 "word"))) ", or " 
          (link (tc (tunnel similar-terms:2 "word"))) "? "))
      (def pull-request-text
        (concat 
          "You can create the page by submitting a " 
          (link "" "pull request") 
          ", or if you think this is an error, please contact " 
          (link "https://twitter.com/lainsdev" "@lainsdev") "."))
      (def _body 
        (wrap (concat similar-text pull-request-text) "p"))))
  (if 
    (eq __portal "")
    (dom:set-class _portal "hidden")
    (dom:set-class _portal "visible"))
  (dom:set-html _portal (res:_portal))
  (dom:set-html _content (concat _head _body))))

(defn display-sidebar (res) (
  (def __links 
    (wrap 
      (join (for (entries res:links) 
        (λ (a) (wrap (link a:1 a:0) "li")))) "ul" "links"))
  (def span-from 
    (if 
      (gt (len res:diaries) 0) 
      (tunnel res "span" "from") 
      (:time (last (database:select "horaire")))))
  (def span-to 
    (if 
      (gt (len res:diaries) 1) 
      (tunnel res "span" "to") 
      (:time (first (database:select "horaire")))))
  (def __date 
    (wrap (concat span-from " — " span-to) "h2"))
  (def navi-stem 
    (if 
      (gt (len res:children) 0) 
      res 
      (either (tunnel res "parent") (database:find "home"))))
  (def __stem 
    (wrap (link (tunnel navi-stem:parent "name") navi-stem:name) "li" "parent"))
  (def __children 
    (join (for navi-stem:children 
      (λ (a) (if  
        (eq (index a:tags "hidden") -1)
        (concat "<li class='" (if (eq a:name res:name) "active") "'>" (link a:name) "</li>"))))))
  (def __directory 
    (wrap (concat __stem __children) "ul" "directory"))
  (dom:set-html _sidebar (concat __date __directory __links))))

(defn display (q) (
  (def res 
    (database:find q))
  (dom:set-title (concat "LAINS — " (tc res:name)))
  (dom:set-hash res:name)
  (dom:set-class dom:body (concat "loading " res:theme))
  (dom:scroll 0)
  (wait 0.1 (λ ()
    ((display-photo res)
      (display-glyph res)
      (display-sidebar res)
      (display-main res)
      (wait 0.1 (λ () 
        (dom:set-class dom:body (concat "ready " res:theme))))
      )))
  ))

; repl

(defn run-repl (q) (
  (dom:set-class _terminal "active")
  (dom:set-html _termhand (concat (arvelie) " " (neralie) " " q (link "(services:close)" "close" "right")))
  (dom:set-html _termview (interpreter:run (replace q "%20" " ")))))

; goto

(defn goto (data-goto) (
  (if 
    (eq data-goto "")
    (def data-goto "home"))
  (if 
    (eq (substr data-goto 0 1) "(")
    (run-repl data-goto)
    (display data-goto))
  (dom:set-value _search data-goto)))

; search

(defn search (e) (
  (if 
    (eq e:key "Enter") 
    (goto (tunnel e "target" "value")))
  (if 
    (eq e:key "Escape") 
    (dom:set-class _terminal ""))))

(dom:bind _search "keydown" search)

(on:start goto)
(on:click goto)
(on:change goto)
`