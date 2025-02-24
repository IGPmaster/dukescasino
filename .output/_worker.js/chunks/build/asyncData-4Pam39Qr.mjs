import{a4 as a,a5 as e,r as t,a6 as s,a7 as r,a8 as n,a9 as l,aa as i,u as o}from"./server.mjs";function useAsyncData(...c){var d,u,y,f,p,m,_,D;const v="string"==typeof c[c.length-1]?c.pop():void 0;"string"!=typeof c[0]&&c.unshift(v);let[g,h,P={}]=c;if("string"!=typeof g)throw new TypeError("[nuxt] [asyncData] key must be a string.");if("function"!=typeof h)throw new TypeError("[nuxt] [asyncData] handler must be a function.");const w=a(),k=h;P.server=null==(d=P.server)||d,P.default=null!=(u=P.default)?u:()=>e.value,P.getCachedData=null!=(y=P.getCachedData)?y:()=>w.isHydrating?w.payload.data[g]:w.static.data[g],P.lazy=null!=(f=P.lazy)&&f,P.immediate=null==(p=P.immediate)||p,P.deep=null!=(m=P.deep)?m:e.deep,P.dedupe=null!=(_=P.dedupe)?_:"cancel";const x=P.getCachedData(g,w),C=null!=x;if(!w._asyncData[g]||!P.immediate){null!=(D=w.payload._errors)[g]||(D[g]=e.errorValue);const a=P.deep?t:s;w._asyncData[g]={data:a(C?x:P.default()),pending:t(!C),error:r(w.payload._errors,g),status:t("idle"),_default:P.default}}const V={...w._asyncData[g]};delete V._default,V.refresh=V.execute=(a={})=>{var t,s;if(w._asyncDataPromises[g]){if("defer"===(s=null!=(t=a.dedupe)?t:P.dedupe)||!1===s)return w._asyncDataPromises[g];w._asyncDataPromises[g].cancelled=!0}if(a._initial||w.isHydrating&&!1!==a._initial){const e=a._initial?x:P.getCachedData(g,w);if(null!=e)return Promise.resolve(e)}V.pending.value=!0,V.status.value="pending";const r=new Promise(((a,e)=>{try{a(k(w))}catch(a){e(a)}})).then((async a=>{if(r.cancelled)return w._asyncDataPromises[g];let t=a;P.transform&&(t=await P.transform(a)),P.pick&&(t=function(a,e){const t={};for(const s of e)t[s]=a[s];return t}(t,P.pick)),w.payload.data[g]=t,V.data.value=t,V.error.value=e.errorValue,V.status.value="success"})).catch((a=>{if(r.cancelled)return w._asyncDataPromises[g];V.error.value=i(a),V.data.value=o(P.default()),V.status.value="error"})).finally((()=>{r.cancelled||(V.pending.value=!1,delete w._asyncDataPromises[g])}));return w._asyncDataPromises[g]=r,w._asyncDataPromises[g]},V.clear=()=>function(a,t){t in a.payload.data&&(a.payload.data[t]=void 0);t in a.payload._errors&&(a.payload._errors[t]=e.errorValue);a._asyncData[t]&&(a._asyncData[t].data.value=void 0,a._asyncData[t].error.value=e.errorValue,a._asyncData[t].pending.value=!1,a._asyncData[t].status.value="idle");t in a._asyncDataPromises&&(a._asyncDataPromises[t]&&(a._asyncDataPromises[t].cancelled=!0),a._asyncDataPromises[t]=void 0)}(w,g);if(!1!==P.server&&w.payload.serverRendered&&P.immediate){const a=V.refresh({_initial:!0});n()?l((()=>a)):w.hook("app:created",(async()=>{await a}))}const b=Promise.resolve(w._asyncDataPromises[g]).then((()=>V));return Object.assign(b,V),b}export{useAsyncData as u};
//# sourceMappingURL=asyncData-4Pam39Qr.mjs.map
