const o=r=>Object.entries(r).map(([s,e])=>{const n=Object.entries(e).reduce((l,[a,t])=>{if(typeof t=="string"){const c=a.replace(/[A-Z]/g,i=>`-${i.toLowerCase()}`);return l+=`${c}:${t};`}return o(e)},"");return`${s}{${n}}`}).join("");export{o as style};
//# sourceMappingURL=style.js.map
