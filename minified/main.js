class TabMenu extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.wrapper=addElement("div",{id:"wrapper"}),this.header=addElement("header",{id:"tabs"}),this.open=!this.hasAttribute("closed"),this.divs=[],[this.backgroundColor,this.inactiveBackgroundColor]=this.#a(),this.color=this.style.color,this.wrapper.appendChild(this.header)}connectedCallback(){let t=addElement("style",{textContent:`a[id^="tab-"] {padding: .25rem .5rem;border-radius: 3px 3px 0 0;background-color: ${this.inactiveBackgroundColor};color: ${this.color};cursor: pointer;user-select: none;}a[id^="tab-"]:hover {background-color: ${this.backgroundColor};}a[id^="tab-"].open {background-color: ${this.backgroundColor};}#tabs {display: flex;gap: .25rem;padding: 0 .25rem;border-bottom: solid 1px ${this.backgroundColor};color: ${this.color};}#tabs.minimized {border-bottom: solid 1px ${this.inactiveBackgroundColor};}#wrapper {display: flex;flex-direction: column;margin: 1rem 0;}#wrapper>div:not(:first-child) {display: none;padding: 1rem;box-sizing: border-box;background-color: ${this.backgroundColor};color: ${this.color};}#wrapper>div:not(:first-child).open {display: block}#wrapper .disabled {opacity: .25;cursor: not-allowed;}`});Object.entries(this.children).forEach(([t,e])=>{let i=addElement("a",{id:`tab-${t}`,textContent:`${this.hasAttribute("numbered")?`${t}: `:""}${e.getAttribute("name")}`,onclick:()=>e.hasAttribute("disabled")?{}:e.classList.contains("open")?this.minimize():this.openTab(t)});e.hasAttribute("disabled")&&i.classList.add("disabled"),this.header.appendChild(i),this.wrapper.appendChild(e),this.divs.push([i,e])}),this.open&&this.openTab(this.getTab(this.getAttribute("open"))),this.shadowRoot.append(t,this.wrapper)}getTab(t){return t?this.divs.findIndex(([e,i])=>i.getAttribute("name")==t):0}minimize(){this.header.classList.add("minimized"),this.divs.forEach(([t,e])=>{t.classList.remove("open"),e.classList.remove("open")})}openTab(t){this.header.classList.remove("minimized"),this.divs.forEach(([e,i])=>{i==this.divs[t][1]?(e.classList.add("open"),i.classList.add("open")):(e.classList.remove("open"),i.classList.remove("open"))})}#a(){let t="rgba(200, 200, 200, 1)",e=/[\d\.]+/g,i=this.style.backgroundColor.match(e)||t.match(e),o=i?i.map(Number):t,a=o.length>3?o.pop():1,r=`rgba(${o.join(", ")}, ${a})`,s=`rgba(${o.join(", ")}, ${Math.max(0,a-.2)})`;return[r,s]}}customElements.define("tab-menu",TabMenu);export function addElement(t,e={}){return Object.assign(document.createElement(t),e)}let dialogExitStyle=`.dialog-exit {position:absolute;top:1rem; right:1rem;display:flex;justify-content:center;width:1.5rem;height:1.5rem;cursor:pointer;--color: #000;}.dialog-exit:hover { --color: #222; }.dialog-exit::before, .dialog-exit::after {content:'';position:absolute;top:-.2rem;transform:rotate(45deg);width:5px;height:2rem;border-radius:5px;background:var(--color);}.dialog-exit::after { transform:rotate(-45deg); }`;class ModalDialog extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.dialog,this.dialogElement=addElement("div",{classList:"dialog",role:"dialog"}),this.open=!1,this.template=Object.values(this.children).map(t=>t.hasAttribute("slot")?addElement("slot"):t),this.shadowRoot.append(addElement("style",{textContent:`* {margin:0;padding:0;box-sizing:border-box;}.backdrop {position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background-color:var(--modal-bd-color, #0008);}.dialog {position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;gap:.5rem;padding:1rem;min-width: calc(320px - 1rem);border-radius:5px;background-color:var(--modal-bg-color, #fff);color: var(--modal-color, #000);}.content {display:flex;flex-direction:column;gap:.5rem;}${dialogExitStyle}.dialog-exit { --color:var(--modal-x-color, currentColor); }.dialog-exit:hover { --color:var(--modal-x-hover-color, #222); }#wrapper {position:fixed;top:0;bottom:0;left:0;right:0;z-index:3;display:none;}`}))}close=()=>{[this.wrapper,this.dialog].forEach(t=>{t.innerHTML="",t.remove()})};hide=()=>this.wrapper.style.display="none";show=()=>{this.wrapper.style.display="flex",this.wrapper.focus()};connectedCallback(){Object.entries({exit:()=>this.close(),hide:()=>this.hide()}).forEach(([t,e])=>{let i=this.querySelectorAll(`[data-name="${t}"]`);i&&i.forEach(t=>this.#b(t,e))})}display(t,e=!1){if(this.#c(e),!e){let i=this.dialog.appendChild(addElement("div",{classList:"dialog-exit",title:"Exit Dialog"}));this.#b(i,this.close)}this.dialog.querySelectorAll("[data-name='hidden']").forEach(t=>t.remove()),Object.entries(t).forEach(([t,e])=>{let i=this.dialog.querySelector(`[data-name=${t}]`);i&&(i.innerHTML=e)})}#b(d,l){d.tabIndex=0,d.onclick=l,d.onkeydown=t=>["Enter"," "].includes(t.key)?l():0}#c(n){this.open&&this.close(),this.wrapper=addElement("div",{id:"wrapper",style:"display: flex",tabIndex:-1}),this.wrapper.appendChild(addElement("div",{classList:"backdrop",onclick:n?0:()=>this.close()})),this.dialog=this.wrapper.appendChild(this.dialogElement),this.dialog.append(...this.template),this.shadowRoot.append(this.wrapper),this.open=!0,this.wrapper.focus()}}class NonModalDialog extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.wrapper=addElement("div",{classList:"wrapper"});let t=addElement("style",{textContent:`* { box-sizing: border-box; }.content {position: absolute;top: 0;left: 50%;transform: translateX(-50%);overflow: hidden;display: flex;flex-direction: column;align-items: center;padding: 1rem;padding-right: 3rem;margin: .5rem;width: 50%;max-width: 80vw;background-color: var(--nm-bg-color, #ddd);box-shadow: 0 0 4px #000;border-radius: 5px;--bg: #222;}.wrapper {display: none;z-index: 3;justify-content: center;width: 100%;color: var(--nm-color, #000);}.wrapper.top {position: fixed;top: 0;left: 50%;transform: translateX(-50%);}${dialogExitStyle}.dialog-exit {top: 25%;--color: var(--nm-x-color, currentColor);}.dialog-exit:hover { --color: var(--nm-x-hover-color, #222); }@keyframes modal-lifetime {from {width: 100%;}to {width: 0;}}`});this.wrapper.classList.add("top"),this.shadowRoot.append(t,this.wrapper)}display(t,e=10){let i=this.wrapper.appendChild(addElement("div",{classList:"content"}));i.appendChild(addElement("div",{classList:"content-body",textContent:t})),i.appendChild(addElement("div",{classList:"dialog-exit",onclick:()=>this.close()})),i.appendChild(addElement("div",{style:`position: absolute;bottom: 0;left: 0;height: 4px;width: 100%;background: var(--nm-bar-color, #aaa);animation: modal-lifetime ${e}s linear;`})),this.wrapper.style.display="flex",e>0&&setTimeout(()=>this.close(),1e3*e)}close(){this.wrapper.innerHTML="",this.wrapper.display="none"}}customElements.define("modal-dialog",ModalDialog),customElements.define("nm-dialog",NonModalDialog);export class Color{#d="";constructor(t,e,i,o){[this.r,this.g,this.b,this.a]=[t,e,i,o]}get rgba(){return this.#d||(this.#d=`rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`),this.#d}get rgbArray(){return[this.r,this.g,this.b]}brightness(t){return new Color(...this.rgbArray.map(e=>Math.max(0,e+t)),this.a)}opacity(t){return this.a+=t,this.a>1&&(this.a=1),this.a<0&&(this.a=0),this}static parseRGBA(t){let e=t.match(/[\d\.]+/g),[i,o,a,r]=e?e.map(Number):[0,0,0,0];return r||(r=1),new Color(i,o,a,r)}static fromComputedStyle(t,e=null,i="background"){let o=getComputedStyle(t)[i];return"none"==o&&(o=e),this.parseRGBA(o)}static fromRGBA(t){return this.parseRGBA(t)}}