class TabMenu extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.divs=[],this.wrapper=addElement("div",{classList:"wrapper"}),this.header=addElement("header",{classList:"tabs"});let e=addElement("style",{textContent:`a[class^="tab-"] {padding: .25rem .5rem;border-radius: 3px 3px 0 0;background-color: var(--tab-inactive-bg-color, #999);color: var(--tab-inactive-color, currentColor);cursor: pointer;user-select: none;}a[class^="tab-"]:hover {background-color: var(--tab-menu-bg-color, #ccc);color: var(--tab-color, currentColor);}a[class^="tab-"].open {background-color: var(--tab-menu-bg-color, #ccc);color: var(--tab-color, currentColor);}.tabs {display: flex;gap: .25rem;padding: 0 .25rem;border-bottom: solid 1px var(--tab-menu-bg-color, #ccc);color: var(--tab-color, currentColor);}.tabs.minimized {border-bottom: solid 1px var(--tab-inactive-bg-color, #999);}.wrapper {display: flex;flex-direction: column;margin: 1rem 0;}.wrapper>div:not(:first-child) {display: none;padding: 1rem;box-sizing: border-box;background-color: var(--tab-menu-bg-color, #ccc);color: var(--tab-color, currentColor);}.wrapper>div:not(:first-child).open { display: block; }.wrapper .disabled { opacity: .25; cursor: not-allowed; }`});this.wrapper.appendChild(this.header),this.shadowRoot.append(e,this.wrapper)}connectedCallback(){Object.entries(this.children).forEach(e=>{let[t,o]=e,i=addElement("a",{classList:`tab-${t}`,textContent:this.tabName(e),onclick:()=>o.hasAttribute("disabled")?0:o.classList.contains("open")?this.minimize():this.openTab(t)});o.hasAttribute("disabled")&&i.classList.add("disabled"),this.header.appendChild(i),this.wrapper.appendChild(o),this.divs.push([i,o])}),this.hasAttribute("closed")||this.openTab(this.tabIndex(this.getAttribute("open")))}tabIndex=e=>e?this.divs.findIndex(([t,o])=>o.getAttribute("name")==e):0;minimize(){this.header.classList.add("minimized"),this.divs.forEach(e=>e.map(e=>e.classList.remove("open")))}openTab(e){this.header.classList.remove("minimized"),this.divs.forEach(([t,o])=>{o==this.divs[e][1]?(t.classList.add("open"),o.classList.add("open")):(t.classList.remove("open"),o.classList.remove("open"))})}tabName(e){let[t,o]=e,i=this.getAttribute("sep")||": ";return t=parseInt(t),this.hasAttribute("numbered")?t+=1:t=i="",`${t}${i}${o.getAttribute("name")}`}}customElements.define("tab-menu",TabMenu);export function addElement(e,t={}){return Object.assign(document.createElement(e),t)}let dialogExitStyle=`.dialog-exit {position:absolute;top:1rem; right:1rem;display:flex;justify-content:center;width:1.5rem;height:1.5rem;cursor:pointer;--color: #000;}.dialog-exit:hover { --color: #222; }.dialog-exit::before, .dialog-exit::after {content:'';position:absolute;top:-.2rem;transform:rotate(45deg);width:5px;height:2rem;border-radius:5px;background:var(--color);}.dialog-exit::after { transform:rotate(-45deg); }`;class ModalDialog extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.dialog,this.dialogElement=addElement("div",{classList:"dialog",role:"dialog"}),this.open=!1,this.template=Object.values(this.children).map(e=>e.hasAttribute("slot")?addElement("slot"):e),this.shadowRoot.append(addElement("style",{textContent:`* {margin:0;padding:0;box-sizing:border-box;}.backdrop {position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;background-color:var(--modal-bd-color, #0008);}.dialog {position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);display:flex;flex-direction:column;gap:.5rem;padding:1rem;min-width: calc(320px - 1rem);border-radius:5px;background-color:var(--modal-bg-color, #fff);color: var(--modal-color, #000);}.content {display:flex;flex-direction:column;gap:.5rem;}${dialogExitStyle}.dialog-exit { --color:var(--modal-x-color, currentColor); }.dialog-exit:hover { --color:var(--modal-x-hover-color, #222); }#wrapper {position:fixed;top:0;bottom:0;left:0;right:0;z-index:3;display:none;}`}))}close=()=>{[this.wrapper,this.dialog].forEach(e=>{e.innerHTML="",e.remove()})};hide=()=>this.wrapper.style.display="none";show=()=>{this.wrapper.style.display="flex",this.wrapper.focus()};connectedCallback(){Object.entries({exit:()=>this.close(),hide:()=>this.hide()}).forEach(([e,t])=>{let o=this.querySelectorAll(`[data-name="${e}"]`);o&&o.forEach(e=>this.#a(e,t))})}display(e,t=!1){if(this.#b(t),!t){let o=this.dialog.appendChild(addElement("div",{classList:"dialog-exit",title:"Exit Dialog"}));this.#a(o,this.close)}this.dialog.querySelectorAll("[data-name='hidden']").forEach(e=>e.remove()),Object.entries(e).forEach(([e,t])=>{let o=this.dialog.querySelector(`[data-name=${e}]`);o&&(o.innerHTML=t)})}#a(e,t){e.tabIndex=0,e.onclick=t,e.onkeydown=e=>["Enter"," "].includes(e.key)?t():0}#b(o){this.open&&this.close(),this.wrapper=addElement("div",{id:"wrapper",style:"display: flex",tabIndex:-1}),this.wrapper.appendChild(addElement("div",{classList:"backdrop",onclick:o?0:()=>this.close()})),this.dialog=this.wrapper.appendChild(this.dialogElement),this.dialog.append(...this.template),this.shadowRoot.append(this.wrapper),this.open=!0,this.wrapper.focus()}}class NonModalDialog extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.wrapper=addElement("div",{classList:"wrapper"});let e=addElement("style",{textContent:`* { box-sizing: border-box; }.content {position: absolute;top: 0;left: 50%;transform: translateX(-50%);overflow: hidden;display: flex;flex-direction: column;align-items: center;padding: 1rem;padding-right: 3rem;margin: .5rem;width: 50%;max-width: 80vw;background-color: var(--nm-bg-color, #ddd);box-shadow: 0 0 4px #000;border-radius: 5px;--bg: #222;}.wrapper {display: none;z-index: 3;justify-content: center;width: 100%;color: var(--nm-color, #000);}.wrapper.top {position: fixed;top: 0;left: 50%;transform: translateX(-50%);}${dialogExitStyle}.dialog-exit {top: 25%;--color: var(--nm-x-color, currentColor);}.dialog-exit:hover { --color: var(--nm-x-hover-color, #222); }@keyframes modal-lifetime {from {width: 100%;}to {width: 0;}}`});this.wrapper.classList.add("top"),this.shadowRoot.append(e,this.wrapper)}display(e,t=10){let o=this.wrapper.appendChild(addElement("div",{classList:"content"}));o.appendChild(addElement("div",{classList:"content-body",textContent:e})),o.appendChild(addElement("div",{classList:"dialog-exit",onclick:()=>this.close()})),o.appendChild(addElement("div",{style:`position: absolute;bottom: 0;left: 0;height: 4px;width: 100%;background: var(--nm-bar-color, #aaa);animation: modal-lifetime ${t}s linear;`})),this.wrapper.style.display="flex",t>0&&setTimeout(()=>this.close(),1e3*t)}close(){this.wrapper.innerHTML="",this.wrapper.display="none"}}customElements.define("modal-dialog",ModalDialog),customElements.define("nm-dialog",NonModalDialog);