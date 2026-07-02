---
name: feedback-result-cards
description: Pattern for success/error feedback cards — left-border indicator, no green/red outside palette
metadata:
  type: feedback
---

Success and error state cards MUST NOT use green or red (outside the strict palette). Use left-border (`border-l-2`) as the semantic differentiator:
- Success: `border-l-2 border-[#CFAE68] bg-[#CFAE68]/5` with `text-[#CFAE68]` body
- Error: `border-l-2 border-[#872F31] bg-[#872F31]/10` with `text-[#CFAE68]` body (NOT `text-[#872F31]` — insufficient contrast on dark)

**Why:** Palette is strict — no Tailwind color names. `#872F31` on `#010101` fails contrast for body text. `#CFAE68` ensures readability in both card types while the border color provides the semantic signal.

**How to apply:** Any component with success/error feedback states should use this left-border pattern. Never use `border-green-*`, `bg-green-*`, `text-green-*`, `text-red-*` etc.
