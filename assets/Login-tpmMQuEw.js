import{r as h,u as v,a as f,b as i,j as r,N as g,c as b,m as j,L as c,B as N,z as t}from"./index-CagwMh7D.js";import{a as y}from"./auth-DEqnWZHC.js";function k(){const[o,n]=h.useState({email:"",password:""}),d=v(),m=f(),u=i(e=>e.isAuthenticated),x=i(e=>e.setAuth),s=m.state?.from?.pathname??"/home";if(u)return r.jsx(g,{to:s,replace:!0});const l=b({mutationFn:e=>y.login(e).then(a=>a.data),onSuccess:e=>{x(e.user,e.token),t.success("Welcome back!"),d(s,{replace:!0})},onError:e=>{t.error(e.response?.data?.message??"Login failed")}}),p=e=>{if(e.preventDefault(),!o.email||!o.password){t.error("Please fill in all fields");return}l.mutate(o)};return r.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[var(--color-background)]px-4",children:r.jsx(j.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},className:"w-full max-w-md",children:r.jsxs("div",{className:`\r
          rounded-[var(--radius-3xl)]\r
          border border-[var(--color-border)]\r
          bg-[var(--color-card)]\r
          shadow-[var(--shadow-hover)]\r
          p-8\r
        `,children:[r.jsxs("div",{className:"text-center mb-8",children:[r.jsxs(c,{to:"/home",className:"inline-flex items-center gap-2 font-bold text-2xl gradient-text",children:[r.jsx("span",{className:"text-3xl ",children:"🛒"}),"Cartify"]}),r.jsx("h1",{className:"mt-6 text-2xl font-bold text-[var(--color-foreground)]",children:"Sign in to your account"}),r.jsx("p",{className:"mt-2 text-[var(--color-muted-foreground)]",children:"Enter your credentials to continue"})]}),r.jsxs("form",{onSubmit:p,className:"space-y-5",children:[r.jsxs("div",{children:[r.jsx("label",{htmlFor:"email",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Email"}),r.jsx("input",{id:"email",type:"email",autoComplete:"email",value:o.email,onChange:e=>n(a=>({...a,email:e.target.value})),className:`\r
                w-full h-12 px-4\r
                rounded-[var(--radius-xl)]\r
                border border-[var(--color-border)]\r
                bg-[var(--color-card)]\r
                text-[var(--color-foreground)]\r
                focus:ring-2 focus:ring-[var(--color-primary)]\r
                outline-none transition\r
              `,placeholder:"you@example.com"})]}),r.jsxs("div",{children:[r.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-[var(--color-muted-foreground)] mb-1.5",children:"Password"}),r.jsx("input",{id:"password",type:"password",autoComplete:"current-password",value:o.password,onChange:e=>n(a=>({...a,password:e.target.value})),className:`\r
                w-full h-12 px-4\r
                rounded-[var(--radius-xl)]\r
                border border-[var(--color-border)]\r
                bg-[var(--color-card)]\r
                text-[var(--color-foreground)]\r
                focus:ring-2 focus:ring-[var(--color-primary)]\r
                outline-none transition\r
              `,placeholder:"••••••••"})]}),r.jsx(N,{type:"submit",variant:"primary",size:"lg",className:"w-full",loading:l.isPending,children:"Sign in"})]}),r.jsxs("p",{className:"mt-6 text-center text-sm text-[var(--color-muted-foreground)]",children:["Don't have an account?"," ",r.jsx(c,{to:"/register",className:"font-semibold text-[var(--color-primary)] hover:underline",children:"Sign up"})]})]})})})}export{k as Login};
