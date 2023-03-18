const y=s=>{const e=n=>Object.entries(n).map(([l,t])=>{const a=Object.entries(t).reduce((o,[c,r])=>{if(typeof r=="string"){const i=c.replace(/[A-Z]/g,u=>`-${u.toLowerCase()}`);return o+=`${i}:${r};`}return e(t).join("")},"");return`${l}{${a}}`});return e(s).join("")};export{y as style};
//# sourceMappingURL=style.js.map
