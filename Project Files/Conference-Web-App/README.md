# 📁 Project Structure & Organization Guide

This document explains **where files belong**, **why they belong there**, and **the rules we follow** to keep the project organized, scalable, and easy to maintain.

If you’re unsure where something should go, start here.

---

## 🧠 High-Level Philosophy

This project follows **colocation** and **separation of concerns**:

- UI stays with UI
- Logic stays with logic
- Infrastructure stays out of components
- If you delete a feature, you should delete one folder

---

## 📦 Folder Overview

src/  
&nbsp;└─ assets/  
&nbsp;└─ components/  
&nbsp;└─ pages/  
&nbsp;└─ firebase/  
&nbsp;└─ utils/    
&nbsp;└─ data/  
&nbsp;└─ App.tsx  
&nbsp;└─ main.tsx  
&nbsp;└─ index.css  

---

## `src/components/` — Reusable UI Components

Reusable UI elements that appear in **more than one page**.

**Examples**
- Buttons
- Modals
- Form inputs
- Cards

**Structure**
components/  
&nbsp;└─ Button/  
&nbsp;&nbsp;&nbsp;└─ Button.tsx  
&nbsp;&nbsp;&nbsp;└─ Button.module.css  
&nbsp;&nbsp;&nbsp;└─ index.ts  


**Rules**
- Use `.tsx` for components
- Use `.module.css` for styles
- Export a **default component**
- No Firebase, API, or database logic

---

## `src/pages/` — Application Pages / Screens

Pages represent **routes** in the application.

**Examples**
- Home
- Dashboard
- Login
- Profile

**Structure**
pages/  
&nbsp;└─ Home/  
&nbsp;&nbsp;&nbsp;└─ Home.tsx  
&nbsp;&nbsp;&nbsp;└─ Home.module.css  
&nbsp;&nbsp;&nbsp;└─ index.ts  


**Rules**
- Pages compose components
- Page-specific styles live here
- Page-only components can live inside the page folder
- Pages may interact with Firebase and routing

---

## `src/firebase/` — Firebase Configuration & Services

Firebase setup and logic.

**Structure**
firebase/  
&nbsp;└─firebase.ts // Firebase initialization  
&nbsp;└─ auth.ts // Authentication logic  
&nbsp;└─ db.ts // Firestore access  
&nbsp;└─ storage.ts // Optional: file uploads  


**Rules**
- Firebase is initialized once
- No UI code
- Use `.ts` only (no JSX)

---

## `src/utils/` — Shared Helper Functions

Reusable, framework-agnostic helpers.

**Examples**
- Formatting helpers
- Validation functions

utils/  
&nbsp;└─ formatDate.ts  
&nbsp;└─ validateEmail.ts  


**Rules**
- No JSX
- No side effects
- Safe to use anywhere

---

## `src/data/` — Static or Mock Data

Temporary or static data used during development.

**Examples**
- Mock data
- Constants

data/  
&nbsp;└─ mockUsers.ts  
&nbsp;└─ constants.ts  


**Rules**
- No live Firebase calls
- No UI logic

---

## `src/assets/` — Static Assets

Static files used by the UI.

**Examples**
- Images
- Icons
- Fonts

assets/  
&nbsp;└─ images/  
&nbsp;└─ icons/  


---

## 🧩 Entry Files

### `main.tsx`
- Application bootstrap
- Creates the React root
- Wraps global providers
- Imports `index.css`

Keep this file minimal.

---

### `App.tsx`
- Routing
- Global layout
- Auth guards

No page styling or Firebase initialization here.

---

### `index.css`
Global styles only:
- CSS reset
- Fonts
- CSS variables
- Base element styles

Do **not** add component or page styles here.

---

## 📐 Colocation Rules

**If it’s shared → `components/`**  
**If it’s unique to one page → keep it inside that page folder**

### Examples

✅ Good
pages/Dashboard/DashboardChart.tsx


❌ Bad
components/DashboardChart.tsx


---

## 📄 File Type Rules

| Use Case | File Type |
|--------|----------|
| React components | `.tsx` |
| Logic / helpers | `.ts` |
| Component styles | `.module.css` |
| Global styles | `index.css` |

No `.js` or `.jsx` files are used in this project.

---

## 📤 Export Rules

- Pages and components use **default exports**
- Each folder has an `index.ts` barrel file

Example:
export { default } from './Home';


Clean imports:
import Home from '@/pages/Home';


---

## 🧭 When in Doubt

Ask:
1. Is this UI?
2. Is it shared?
3. Is it page-specific?
4. Is it infrastructure?

If it’s unclear, ask before adding it.

---

## ✅ Goal of This Structure

- Predictable file locations
- Easy onboarding
- Safe refactors
- Clean handoff to other developers
- Future React Native compatibility
