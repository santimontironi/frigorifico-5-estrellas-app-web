---
name: component-importproducts-concept
description: Visual concept and decisions for ImportProducts component — dark self-contained panel with gold drop zone
metadata:
  type: project
---

ImportProducts — visual concept: dark panel isolated from the admin's cream background, with a gold-dashed drop zone that shifts to carmesí on hover, a solid carmesí CTA button, and semantic result cards using left-border indicators (gold for success, carmesí for error).

Key decisions:
- Wrapper: `bg-[#010101] border border-[#CFAE68]/15 p-6 md:p-8 max-w-xl` — self-contained dark panel
- Drop zone: `border-2 border-dashed border-[#CFAE68]/30 ... hover:border-[#872F31] hover:bg-[#872F31]/5` — dashed gold → carmesí hover
- Icon: `bi-file-earmark-spreadsheet` with `aria-hidden="true"` (decorative)
- CTA import button: `bg-[#872F31] text-[#F7EA79] hover:ring-2 hover:ring-[#F7EA79]/40` — no border-radius (intentional, more premium feel)
- Clear button: thin `border border-[#F7EA79]/25` style, brightens on hover
- Success card: `border-l-2 border-[#CFAE68] bg-[#CFAE68]/5` — gold left-border indicator
- Error card: `border-l-2 border-[#872F31] bg-[#872F31]/10` — carmesí left-border, text in `#CFAE68` for accessible contrast
- Error text uses `text-[#CFAE68]` NOT `text-[#872F31]` — carmesí on dark has insufficient contrast for body text

Related: [[project-admin-layout]]
