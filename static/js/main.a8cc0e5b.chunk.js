(this["webpackJsonpgogocode-playground"]=this["webpackJsonpgogocode-playground"]||[]).push([[2],{488:function(e,t,n){},489:function(e,t,n){},566:function(e,t){},633:function(e,t){},635:function(e,t){},657:function(e,t,n){"use strict";n.r(t);var c=n(31),i=n.n(c),r=n(269),a=n.n(r),o=(n(488),n(20)),u=(n(489),n(289)),s=n(284),l=n(90);var d=function(e){var t=Object(c.useRef)(),n=Object(s.a)(),i=n.width,r=n.height,a=n.ref;return Object(c.useEffect)((function(){var e;null===(e=t.current)||void 0===e||e.layout()}),[i,r]),Object(l.jsx)("div",{ref:a,className:"w-full h-full",children:Object(l.jsx)(u.b,{language:e.language,theme:"vs-dark",value:e.code,options:{minimap:{enabled:!1}},onChange:e.onChange,editorDidMount:function(e){return t.current=e}})})};n(468).languages.typescript.typescriptDefaults.setDiagnosticsOptions({noSemanticValidation:!0,noSyntaxValidation:!0});var h=function(e){var t=Object(c.useRef)(),n=Object(s.a)(),i=n.width,r=n.height,a=n.ref;return Object(c.useEffect)((function(){var e;null===(e=t.current)||void 0===e||e.layout()}),[i,r]),Object(l.jsx)("div",{ref:a,className:"w-full h-full",children:Object(l.jsx)(u.a,{language:"typescript",theme:"vs-dark",original:e.code1,value:e.code2,editorDidMount:function(e){return t.current=e},onChange:e.onCode1Change||function(e){}})})},f=n(423),j=n(469),b=n.n(j),g=n(470),O=n.n(g),x=n(471),v=n.n(x),m=n(472),p=n.n(m),w=n(730);function C(e){try{return O.a.format(e,{trailingComma:"es5",tabWidth:2,semi:!1,singleQuote:!0,printWidth:40,plugins:[v.a,p.a]})}catch(t){return t.toString()}}var y=function(){var e=Object(c.useState)(!0),t=Object(o.a)(e,2),n=t[0],i=t[1],r=Object(c.useState)("function transform($, sourceCode) {\n  // \u5728\u8fd9\u91cc\u8fd4\u56de\u4f60\u751f\u6210\u7684\u4ee3\u7801\n  return $(sourceCode).replace('const a = $_$', 'const a = 2').generate();\n}"),a=Object(o.a)(r,2),u=a[0],s=a[1],j=Object(c.useState)("const a = 1\nconst b = 2"),g=Object(o.a)(j,2),O=g[0],x=g[1],v=function(e,t){try{return new Function("return "+t)()(b.a,e)}catch(n){return"/**\n\u51fa\u9519\u4e86\uff01\n"+n+"\n**/"}}(O,u),m=Object(c.useMemo)((function(){return n?C(O):O}),[n,O]),p=Object(c.useMemo)((function(){return n?C(v):v}),[n,v]),y=function(){var e=Object(c.useState)({width:0,height:0}),t=Object(o.a)(e,2),n=t[0],i=t[1];return Object(c.useEffect)((function(){function e(){i({width:window.innerWidth,height:window.innerHeight})}return window.addEventListener("resize",e),e(),function(){return window.removeEventListener("resize",e)}}),[]),n}(),S=y.width,N=y.height;return Object(l.jsxs)("div",{className:"min-h-screen flex flex-col",children:[Object(l.jsx)("div",{className:"text-xl bg-dark flex-none px-6 py-4 text-white",children:"GoGoCode PlayGround"}),Object(l.jsx)("div",{className:"relative flex-auto",children:Object(l.jsxs)(f.a,{split:"horizontal",defaultSize:"50%",minSize:100,maxSize:N-100,children:[Object(l.jsxs)(f.a,{className:"h-full w-full",split:"vertical",defaultSize:"50%",minSize:100,maxSize:S-100,children:[Object(l.jsx)("div",{className:"h-full flex-1",children:Object(l.jsx)(d,{code:O,onChange:x,language:"typescript"})}),Object(l.jsx)("div",{className:"h-full flex-1",children:Object(l.jsx)(d,{code:u,onChange:s,language:"javascript"})})]}),Object(l.jsxs)("div",{className:"h-full w-full",children:[Object(l.jsxs)("div",{className:"bg-dark flex justify-between px-6 py-2 text-white border-gray-800 border-t",children:[Object(l.jsx)("div",{children:"\u5bf9\u6bd4\u7ed3\u679c"}),Object(l.jsx)("div",{children:Object(l.jsx)(w.a,{checkedChildren:"\u683c\u5f0f\u5316",unCheckedChildren:"\u683c\u5f0f\u5316",checked:n,onChange:i})})]}),Object(l.jsx)(h,{code1:m,code2:p})]})]})})]})},S=function(e){e&&e instanceof Function&&n.e(75).then(n.bind(null,734)).then((function(t){var n=t.getCLS,c=t.getFID,i=t.getFCP,r=t.getLCP,a=t.getTTFB;n(e),c(e),i(e),r(e),a(e)}))};a.a.render(Object(l.jsx)(i.a.StrictMode,{children:Object(l.jsx)(y,{})}),document.getElementById("root")),S()}},[[657,3,4]]]);
//# sourceMappingURL=main.a8cc0e5b.chunk.js.map