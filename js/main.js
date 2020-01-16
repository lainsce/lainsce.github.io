$(function () {
    today = new Date();
    $("#year").text(arvelie(today));
});

function arvelie (date = new Date()) {
    const start = new Date(date.getFullYear(), 0, 0)
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000)
    const doty = Math.floor(diff / 86400000) - 1
    const l = Math.floor(((doty) / 364) * 26)
    const y = date.getFullYear().toString().substr(2, 2)
    const m = doty === 364 || doty === 365 ? '+' : String.fromCharCode(97 + l).toUpperCase()
    const d = `${(doty === 365 ? 1 : doty === 366 ? 2 : (doty % 14)) + 1}`.padStart(2, '0')
    return `${y}${m}${d}`
}
function neralie (d = new Date(), e = new Date(d)) {
    const ms = e - d.setHours(0, 0, 0, 0)
    const val = (ms / 8640 / 10000).toFixed(6)
    return `${val.substr(2, 3)}:${val.substr(5, 3)}`
}
function arne(){
    today = new Date();
    document.getElementById('time').innerHTML = arvelie(today);
    document.getElementById('date').innerHTML = neralie(today);
};
window.setInterval(arne, 2000);

const gridClass = 'card-holder-nx';
const itemClass = 'card';
const grid = document.getElementsByClassName(gridClass);
const recalc = () => {
    Array.from(grid).forEach(gr => {
        // const items = gr.querySelectorAll(`:scope > .${itemClass}`);
        const items = gr.getElementsByClassName(itemClass);
        Array.from(items)
        .filter(el => el.parentElement === gr)
        .forEach(it => {
            it.style.setProperty('grid-row-end', 'span 1');
            const h = parseInt(Math.ceil(it.children[0].getBoundingClientRect().height));
            const gap = parseInt(getComputedStyle(it).getPropertyValue('--gap'));
            const raster = !!parseInt(getComputedStyle(it).getPropertyValue('--raster'), 10)
            let span;
            if (raster) {
                span = parseInt(Math.ceil((h + gap) / gap) * gap);
            } else {
                span = parseInt(Math.ceil(h + gap));
            }
            it.style.setProperty('grid-row-end', `span ${span}`);
        })
    })
}
window.addEventListener('resize', recalc);
window.addEventListener('load', recalc);
recalc()

var birth = new Date('1993-06-06');
function getAge(birth) {
  ageMS = Date.parse(Date()) - Date.parse(birth);
  age = new Date();
  age.setTime(ageMS);
  ageYear = age.getFullYear() - 1970;
  return ageYear;
}
document.getElementById('age').innerHTML = getAge(birth);
