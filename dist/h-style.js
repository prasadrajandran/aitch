const S=s=>{const e=n=>Object.entries(n).map(([a,t])=>{const l=Object.entries(t).reduce((o,[c,r])=>typeof r=="string"?o+=`${c.replace(/[A-Z]/g,i=>`-${i.toLowerCase()}`)}:${r};`:e(t).join(""),"");return`${a}{${l}}`});return e(s).join("")};export{S as hStyle};
//# sourceMappingURL=h-style.js.map
