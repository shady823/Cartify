import{r as v,u as h,b as i,j as r,N as g,c as f,m as b,L as d,B as w,z as s}from"./index-CsaSfNwg.js";import{a as j}from"./auth-DcBntlR5.js";function C(){const[a,t]=v.useState({name:"",email:"",password:"",rePassword:""}),c=h(),m=i(e=>e.isAuthenticated),u=i(e=>e.setAuth);if(m)return r.jsx(g,{to:"/home",replace:!0});const l=f({mutationFn:e=>j.register(e).then(o=>o.data),onSuccess:e=>{u(e.user,e.token),s.success("Account created!"),c("/home",{replace:!0})},onError:e=>{const o=e.response?.data?.message,n=e.response?.data?.errors;if(n&&Object.keys(n).length){const p=Object.values(n)[0];s.error(p??"Registration failed")}else s.error(o??"Registration failed")}}),x=e=>{if(e.preventDefault(),a.password!==a.rePassword){s.error("Passwords do not match");return}if(!a.name||!a.email||!a.password){s.error("Please fill in all fields");return}l.mutate(a)};return r.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12",children:r.jsx(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},className:"w-full max-w-md",children:r.jsxs("div",{className:`\r
        rounded-[var(--radius-3xl)]\r
        border border-[var(--color-border)]\r
        bg-[var(--color-card)]\r
        shadow-[var(--shadow-hover)]\r
        p-8\r
      `,children:[r.jsxs("div",{className:"text-center mb-8",children:[r.jsxs(d,{to:"/home",className:"inline-flex items-center gap-2 font-bold text-2xl gradient-text",children:[r.jsx("span",{className:"text-3xl",children:"🛒"}),"Cartify"]}),r.jsx("h1",{className:"mt-6 text-2xl font-bold text-[var(--color-foreground)]",children:"Create your account"}),r.jsx("p",{className:"mt-2 text-[var(--color-muted-foreground)]",children:"Join us and start shopping"})]}),r.jsxs("form",{onSubmit:x,className:"space-y-5",children:[r.jsxs("div",{children:[r.jsx("label",{htmlFor:"name",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Name"}),r.jsx("input",{id:"name",type:"text",autoComplete:"name",value:a.name,onChange:e=>t(o=>({...o,name:e.target.value})),className:`\r
              w-full h-12 px-4\r
              rounded-[var(--radius-xl)]\r
              border border-[var(--color-border)]\r
              bg-[var(--color-card)]\r
              text-[var(--color-foreground)]\r
              focus:ring-2 focus:ring-[var(--color-primary)]\r
              outline-none transition\r
            `,placeholder:"Your name"})]}),r.jsxs("div",{children:[r.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Email"}),r.jsx("input",{id:"email",type:"email",autoComplete:"email",value:a.email,onChange:e=>t(o=>({...o,email:e.target.value})),className:`\r
              w-full h-12 px-4\r
              rounded-[var(--radius-xl)]\r
              border border-[var(--color-border)]\r
              bg-[var(--color-card)]\r
              text-[var(--color-foreground)]\r
              focus:ring-2 focus:ring-[var(--color-primary)]\r
              outline-none transition\r
            `,placeholder:"you@example.com"})]}),r.jsxs("div",{children:[r.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Password"}),r.jsx("input",{id:"password",type:"password",autoComplete:"new-password",value:a.password,onChange:e=>t(o=>({...o,password:e.target.value})),className:`\r
              w-full h-12 px-4\r
              rounded-[var(--radius-xl)]\r
              border border-[var(--color-border)]\r
              bg-[var(--color-card)]\r
              text-[var(--color-foreground)]\r
              focus:ring-2 focus:ring-[var(--color-primary)]\r
              outline-none transition\r
            `,placeholder:"••••••••"})]}),r.jsxs("div",{children:[r.jsx("label",{htmlFor:"rePassword",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Confirm password"}),r.jsx("input",{id:"rePassword",type:"password",autoComplete:"new-password",value:a.rePassword,onChange:e=>t(o=>({...o,rePassword:e.target.value})),className:`\r
              w-full h-12 px-4\r
              rounded-[var(--radius-xl)]\r
              border border-[var(--color-border)]\r
              bg-[var(--color-card)]\r
              text-[var(--color-foreground)]\r
              focus:ring-2 focus:ring-[var(--color-primary)]\r
              outline-none transition\r
            `,placeholder:"••••••••"})]}),r.jsx(w,{type:"submit",variant:"primary",size:"lg",className:"w-full",loading:l.isPending,children:"Create account"})]}),r.jsxs("p",{className:"mt-6 text-center text-sm text-[var(--color-muted-foreground)]",children:["Already have an account?"," ",r.jsx(d,{to:"/login",className:"font-semibold text-[var(--color-primary)] hover:underline",children:"Sign in"})]})]})})})}export{C as Register};
