var I=Object.defineProperty,f=Object.defineProperties;var m=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable;var E=(t,r,e)=>r in t?I(t,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[r]=e,a=(t,r)=>{for(var e in r||={})R.call(r,e)&&E(t,e,r[e]);if(o)for(var e of o(r))v.call(r,e)&&E(t,e,r[e]);return t},p=(t,r)=>f(t,m(r));var y="9554857d-de86-490c-b840-97c0b09ec272",T=new Set(["fragment"]),d=new Set,c=t=>{let{key:r}=t;if(r){if(T.has(r))throw new Error(`This key is reserved and cannot be used in a directive: "${r}"`);if(d.has(r))throw new Error(`Directive key already in use: "${r}"`);d.add(r)}let e=Symbol(t.key||"directive-definition");return(...i)=>({directive:y,identifier:e,definition:p(a({},t),{key:t.key||""}),args:i})};var u=c({type:"attr",key:"refs",callback:t=>t.reduce((r,{node:e,args:[i]})=>{if(typeof i=="function")i(e);else{if(i in r)throw new Error(`Duplicate $ref key: "${i}"`);r[i]=e}return r},{})});var l=(t,r)=>{Object.entries(r).forEach(([e,i])=>{switch(e){case"style":Object.entries(i).forEach(([n,s])=>{t.style[n]=s});break;case"dataset":Object.entries(i).forEach(([n,s])=>{t.dataset[n]=s});break;default:if((e.startsWith("[")||e.startsWith("!["))&&e.endsWith("]"))e.startsWith("![")?t.removeAttribute(e.substring(2,e.length-1)):t.setAttribute(e.substring(1,e.length-1),String(i));else{let s=t[e];typeof s=="function"&&Array.isArray(i)?s.apply(t,i):s!==i&&(t[e]=i)}}})};var x=c({type:"attr",key:"update",callback:t=>{let r=t.reduce((e,{node:i,args:[n]})=>{if(e.has(n))throw new Error(`Duplicate $updatable key: "${n}"`);return e.set(n,i)},new Map);return e=>{Object.entries(e).forEach(([i,n])=>{let s=r.get(i);s&&l(s,n)})}}});var D=(t,r)=>{let e=t,i=typeof r=="string"?new Text(r):r;return!(t instanceof Text&&i instanceof Text&&t.textContent===i.textContent)&&t!==i&&(t.replaceWith(i),e=i),e};var A=c({type:"node",key:"updateNode",callback:t=>{let r=t.reduce((e,{node:i,args:[n]})=>{if(e.has(n))throw new Error(`Duplicate $updatableNode key: "${n}"`);return e.set(n,i)},new Map);return e=>{Object.entries(e).forEach(([i,n])=>{let s=r.get(i);s&&r.set(i,D(s,n))})}}});export{u as $ref,x as $updatable,A as $updatableNode};
//# sourceMappingURL=directives.js.map