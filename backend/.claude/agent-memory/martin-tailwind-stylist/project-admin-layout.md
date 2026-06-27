---
name: project-admin-layout
description: Admin panel layout context — sidebar dark brown, content area warm cream beige, affects how components should be styled
metadata:
  type: project
---

AdminPanel layout structure:
- Sidebar (`SideNavAdmin`): `bg-[#1C1714]` — very dark warm brown
- Content area (`<main>`): `bg-[#F5F0EB]` — warm cream/beige
- Loading spinner uses `border-[#9B2335]`

**Why:** Components like ImportProducts, AddProduct, WelcomeAdmin render inside the beige main area. Knowing this informs whether a component needs its own dark background treatment.

**How to apply:** When styling admin panel content components, give them a self-contained dark panel (`bg-[#010101] border border-[#CFAE68]/15`) so the design system's dark aesthetic is preserved as a contained element inside the warm beige layout. Do NOT assume the component inherits a dark background.

Related: [[component-importproducts-concept]]
