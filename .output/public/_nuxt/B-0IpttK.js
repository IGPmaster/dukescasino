import{r as _,m as c,n as C,p as T,c as r,a as t,t as d,u as a,F as g,q as v,s as f,v as y,x as b,o,y as h,z,A as N,B as A,C as w,d as H,D as u}from"./Caal3ueE.js";import{u as V}from"./DSlpxCgX.js";const B={class:"section-even lg:py-10"},D={class:"row bg-primary_bg lg:mb-4 pt-20"},E={class:"container grid grid-cols-1 lg:grid-cols-8 lg:gap-10 items-center mx-auto p-4"},I={class:"col-span-full lg:col-span-6"},F={class:"gamesSectionHead text-center lg:text-left text-3xl text-primary py-4 px-4"},L={class:"info_content text-primary font-extralight py-5 px-4"},U={class:"lg:block lg:col-span-2 p-4"},j={class:"flex justify-between items-center"},M=["href"],q={class:"text-center w-full"},R={class:"row lg:mb-4 py-5"},J={class:"container mx-auto grid grid-cols-1 gap-0 lg:grid-cols-3 lg:gap-4 px-4"},K={class:"relative w-full py-4 lg:py-0"},O=["value"],Q={class:"relative w-full py-4 lg:py-0"},W=["value"],X={class:"relative w-full py-4 lg:py-0"},Y=["value"],Z={class:"px-4 sm:px-6 lg:px-0 py-10"},$={class:"container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"},ee={class:""},se={class:"show show-first first-content-border"},te=["href"],le=["src","onError","alt","title"],re={class:"mask"},ae=["href"],oe={class:"gameDescr"},ie={key:0,class:"px-2"},ne={key:1,class:"large material-icons"},ge={__name:"all-games",setup(de){let i=_("all"),n=_("all"),p=_("all"),x=c(()=>{if(n.value==="all"){let l=u.value.map(s=>s.provider);return[...new Set(l)]}else{let l=u.value.filter(s=>s.subProvider===n.value).map(s=>s.provider);return[...new Set(l)]}}),k=c(()=>{if(i.value==="all"){let l=u.value.map(s=>s.subProvider);return[...new Set(l)]}else{let l=u.value.filter(s=>s.provider===i.value).map(s=>s.subProvider);return[...new Set(l)]}}),P=c(()=>{if(i.value==="all"&&n.value==="all"){let l=u.value.map(s=>s.gameType);return[...new Set(l)]}else{let s=u.value.filter(e=>(e.provider===i.value||i.value==="all")&&(e.subProvider===n.value||n.value==="all")).map(e=>e.gameType);return[...new Set(s)]}}),G=c(()=>u.value.filter(l=>!(i.value!=="all"&&l.provider!==i.value||n.value!=="all"&&l.subProvider!==n.value||p.value!=="all"&&l.gameType!==p.value))),S=c(()=>[...G.value].sort((l,s)=>l.gameName.localeCompare(s.gameName)));C(async()=>{await T()});const m=()=>{};return V({title:"All Games - Hippozino",meta:[{hid:"description",name:"description",content:"Explore all the best games available at Hippozino!"},{name:"keywords",content:"allgames, games, casino, Hippozino"}]}),(l,s)=>(o(),r("div",B,[t("div",D,[t("div",E,[t("div",I,[t("p",F,d(a(h).all_games),1),(o(!0),r(g,null,v("promotionsPosts"in l?l.promotionsPosts:a(z),e=>(o(),r("div",{key:e.id},[t("div",L,d(e.acf.slot_games_info),1)]))),128))]),t("div",U,[t("div",j,[t("a",{href:a(N),class:"bg-secondary_bg w-full rounded-md py-3 flex text-secondary hover:text-primary hover:bg-tertiary_dark uppercase cursor-pointer transition ease-in-out duration-500 hover:scale-110"},[t("span",q,d(a(h).sign_up),1),s[3]||(s[3]=t("i",{class:"material-icons items-center pr-2 font-extralight"},"arrow_forward",-1))],8,M)])])])]),t("div",R,[t("div",J,[t("div",K,[f(t("select",{"onUpdate:modelValue":s[0]||(s[0]=e=>b(i)?i.value=e:i=e),onChange:m,class:"uppercase block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"},[s[4]||(s[4]=t("option",{value:"all"},"All providers",-1)),(o(!0),r(g,null,v(a(x),e=>(o(),r("option",{value:e,key:e},d(e),9,O))),128))],544),[[y,a(i)]]),s[5]||(s[5]=t("i",{class:"material-icons absolute top-1/2 right-3 transform -translate-y-1/2"},"arrow_drop_down",-1))]),t("div",Q,[f(t("select",{"onUpdate:modelValue":s[1]||(s[1]=e=>b(n)?n.value=e:n=e),onChange:m,class:"block uppercase appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"},[s[6]||(s[6]=t("option",{value:"all"},"All subProviders",-1)),(o(!0),r(g,null,v(a(k),e=>(o(),r("option",{value:e,key:e},d(e),9,W))),128))],544),[[y,a(n)]]),s[7]||(s[7]=t("i",{class:"material-icons absolute top-1/2 right-3 transform -translate-y-1/2"},"arrow_drop_down",-1))]),t("div",X,[f(t("select",{"onUpdate:modelValue":s[2]||(s[2]=e=>b(p)?p.value=e:p=e),onChange:m,class:"block uppercase appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"},[s[8]||(s[8]=t("option",{value:"all"},"All game types",-1)),(o(!0),r(g,null,v(a(P),e=>(o(),r("option",{value:e,key:e},d(e),9,Y))),128))],544),[[y,a(p)]]),s[9]||(s[9]=t("i",{class:"material-icons absolute top-1/2 right-3 transform -translate-y-1/2"},"arrow_drop_down",-1))])])]),t("div",Z,[t("div",$,[(o(!0),r(g,null,v(a(S),e=>(o(),r("div",{key:e.id,class:A("item-"+e.excludedCountries)},[t("div",ee,[t("div",se,[t("a",{href:a(w)+e.serverGameId,target:"_blank"},[t("img",{style:{"min-width":"100%"},class:"",src:e.image,loading:"lazy",onError:ue=>e.image="newGameImg.jpg",alt:"Image of "+e.gameName+" online slot. "+e.description,title:e.gameName+" - "+e.id},null,40,le)],8,te),t("div",re,[t("a",{href:a(w)+e.serverGameId,target:"_blank"},[t("div",oe,[e&&e.description&&e.description.length>0?(o(),r("div",ie,[H(d(e.description)+" From ",1),t("strong",null,d(e.subProvider),1)])):(o(),r("i",ne,"play_arrow"))])],8,ae)])])])],2))),128))])])]))}};export{ge as default};