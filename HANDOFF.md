# VendSmart — Full Project Handoff

## Who You Are Working With
- **User:** Ethan Pravato (beginner developer, Purdue student)
- **Goal:** Build a polished demo app for vending machine operators to show to potential vendor clients
- **Communication style:** Keep explanations simple, beginner-friendly folder/variable names, no jargon
- **Design preferences:** Clean, professional, no emojis in UI — use Ionicons instead
- **Timeline:** Demo was needed by Tuesday (already built and working)

---

## What VendSmart Is
A React Native/Expo mobile app for vending machine operators. Two user roles:
1. **Operator** — monitors fleet, manages inventory, views sales/trends
2. **Courier** — delivery person who restocks machines (PIN-locked separate section)

Plus a standalone **customer suggestion page** (HTML file) accessed via QR code on the physical machine.

Currently runs on **dummy data**. Hardware (Arduino + IR sensors) and backend (Firebase) are planned but not built yet.

---

## How to Run the App
```bash
cd /Users/ethanpravato/Desktop/VendSmart
npx expo start --web
# Open browser at localhost:8082
```

Or double-click **VendSmart.app** on the Desktop — it opens Terminal, starts Expo, and opens Chrome automatically.

**Demo login:** `demo@vendsmart.com` / `demo1234`  
**Courier PIN:** `1234`

---

## Tech Stack
- **React Native + Expo SDK 56** (web mode only — Expo Go on iPhone incompatible with SDK 56)
- **Node v24** — must stay on SDK 56, downgrading breaks metro bundler
- `@react-navigation/native` — stack + bottom tab navigation
- `@expo/vector-icons` (Ionicons) — all icons
- `react-native-chart-kit` + `react-native-svg` — bar charts on Trends tab
- **React Context** (`MachinesContext`) — live shared state so courier restocks update operator views instantly

---

## Project Location
```
/Users/ethanpravato/Desktop/VendSmart/
```

## GitHub Repo
```
https://github.com/epravato/Smart-vend-app.git
```
Push via GitHub Desktop (already logged in as epravato). Click **Push origin** after committing.

## Live Site (GitHub Pages)
```
https://epravato.github.io/Smart-vend-app/
```
The `docs/` folder is the built web bundle. Rebuild with:
```bash
npx expo export --platform web --output-dir docs
```
Then commit and push via GitHub Desktop.

---

## Complete File Structure
```
VendSmart/
├── App.js                          # Entry — wraps app in MachinesProvider
├── app.json                        # Expo config (publicPath set for GitHub Pages)
├── HANDOFF.md                      # This file
├── docs/                           # Built web bundle for GitHub Pages
├── customer-suggestion-page/
│   └── index.html                  # Standalone customer QR page (open in browser)
├── src/
│   ├── app-routing/
│   │   └── AppNavigator.js         # All screen registrations + nav config
│   ├── context/
│   │   └── MachinesContext.js      # Shared live machine state (React Context)
│   ├── fake-data/
│   │   ├── dummyData.js            # 3 demo machines with all data
│   │   └── operatorInventory.js    # Warehouse stock operator has on hand
│   ├── shared-ui-pieces/
│   │   ├── StatCard.js
│   │   └── StatusBadge.js
│   └── screens/
│       ├── LoginScreen.js
│       ├── FleetScreen.js
│       ├── MachineScreen.js        # Bottom tab container
│       ├── machine-tabs/
│       │   ├── DashboardTab.js
│       │   ├── InventoryTab.js
│       │   ├── TrendsTab.js
│       │   ├── EarningsTab.js
│       │   └── SuggestionsTab.js
│       ├── settings/
│       │   ├── SettingsScreen.js
│       │   ├── ProfileScreen.js
│       │   ├── NotificationSettingsScreen.js
│       │   ├── AddMachineScreen.js
│       │   ├── HelpScreen.js
│       │   ├── MyInventoryScreen.js
│       │   └── EditMachineScreen.js
│       └── courier/
│           ├── CourierLoginScreen.js
│           ├── CourierHomeScreen.js
│           └── CourierRestockScreen.js
```

---

## Architecture: How Data Flows

### MachinesContext (`src/context/MachinesContext.js`)
All machine data lives here as React state. Every screen reads from it via `useMachines()`. 

```js
const { machines, restockMachine } = useMachines();
```

When a courier submits a restock, `restockMachine(machineId, filledMap)` runs:
- Updates each slot's stock: `min(capacity, stock + unitsAdded)`
- Recalculates `alerts` and `itemsInStock` automatically
- Fleet screen, Courier Home, and Machine Detail all update instantly

### Dummy Data (`src/fake-data/dummyData.js`)
3 machines: Main Lobby (Purdue Union), Engineering Hall (WALC), Rec Center (Co-Rec).

Each machine has:
```js
{
  id, name, location, address, buildingNotes,
  status, revenueToday, itemsInStock, alerts,
  slots: [{ id, name, stock, capacity, price, reorderUrl }],
  weekSales: [{ day, sales }],
  peakHours: [{ hour, sales }],
  earnings: { monthToDate, lastMonth, thisWeek, avgPerDay, itemsSoldMonth, avgSalePrice, recentSales }
}
```

### Warehouse Inventory (`src/fake-data/operatorInventory.js`)
Items the operator has in their warehouse (not inside any machine). The Inventory tab cross-checks each slot against this to show "Use My Stock" vs "Reorder".

---

## Every Screen — What It Does

### LoginScreen
- Email + password form
- "Use Demo Account" auto-fills credentials
- "I'm a Courier — Enter PIN" button at bottom → CourierLogin

### FleetScreen
- Summary bar: Total Machines, Revenue Today, Total Alerts, Offline count
- Machine cards: name, location, online/offline pill, revenue, stock, alert count
- Yellow alert banner on cards needing restock
- **"Edit Machine Details"** button on each card → EditMachineScreen
- Settings gear (top right) → SettingsScreen
- **Uses `useMachines()` — live data**

### MachineScreen
- Bottom tab navigator with 5 tabs
- Looks up live machine from context by ID (not frozen route param)
- Header shows machine name, location, online/offline status

### DashboardTab
- Online/Offline status, revenue, stock, alert count
- Alert list: which slots are empty/low with red/yellow badges
- Reorder link per slot → Costco

### InventoryTab
- Every slot with stock level, capacity, fill bar
- Blue banner: "You have X items in your warehouse"
- "Use My Stock" (blue) — item found in operatorInventory
- "Reorder" (green, cart icon) — not in warehouse

### TrendsTab
- Bar chart: daily sales last 7 days
- Bar chart: peak hours

### EarningsTab
- Month-to-date, last month, this week, daily average
- Items sold, average sale price
- Recent sales log with item, qty, time, revenue

### SuggestionsTab
- Customer suggestions ranked by votes
- Thumbs-up voting (interactive, updates live)
- Snack/Drink category badges
- "Order Now" → Amazon search
- "View QR Code" button in header

### SettingsScreen
- Sections: Account (Profile, Notifications, Change Password), Machines (Add, Manage, My Warehouse Inventory), Support (Help, Rate, Terms), Log Out

### ProfileScreen
- Edit name, email, phone, business name

### NotificationSettingsScreen
- Toggles for low stock, offline alerts, daily summaries

### AddMachineScreen
- Register new machine with name, location, address

### HelpScreen
- FAQ and contact info

### MyInventoryScreen
- Warehouse inventory CRUD
- Summary stats: total units, running low (≤6), out of stock
- Search bar, +/− quantity buttons, add/edit modal, delete
- "Running Low" (yellow) and "Out of Stock" (red) badges

### EditMachineScreen
- Accessed from "Edit Machine Details" on fleet cards
- Fields: Machine Name, Location Label, Street Address, Finding the Machine (building directions)
- Save button only activates when something changed
- Building notes feed into what couriers see

### CourierLoginScreen
- 4-digit PIN pad, correct PIN = `1234`
- Dots fill as user types, red shake on wrong PIN

### CourierHomeScreen
- All machines sorted by urgency (most alerts first)
- Urgency: Urgent (4+ alerts, red), Needs Restock (2+, yellow), All Good (green)
- Empty + low slot counts per machine
- **Uses `useMachines()` — live data**

### CourierRestockScreen
- **Uses live machine from context by ID**
- Blue machine card with Get Directions button → Google Maps
- "Finding the Machine" card (operator's building notes)
- Progress bar updates as slots checked off
- **"Needs Restocking" section:** slots where stock = 0 or ≤30% capacity
  - Checkbox, item name, stock bar (current/capacity), units-to-add input **pre-filled with exact amount needed**
  - Empty = red badge, Low = yellow badge
- **"Already Stocked" section:** read-only list of all other slots with green fill bars
- Notes text field (optional)
- Submit disabled until all restock slots checked
- On submit: calls `restockMachine()` → updates live state across entire app
- Success screen: timestamp, slots restocked, location

---

## Customer Suggestion Page
**File:** `customer-suggestion-page/index.html`  
Open directly in browser — no server needed.

Three sections:
1. **⚡ "We already have these"** (green) — warehouse items not in this machine. Customers vote to prioritize. Shows "In our warehouse" badge.
2. **🔥 "Others are asking for these"** (yellow) — trending new product requests with vote counts
3. **💡 "Suggest something new"** — open text form for anything not listed

Votes increment live on tap. Submit → success state → "Vote on something else."

For demo: hardcoded to show Red Bull, Doritos, Kit Kat as warehouse items (items in operatorInventory but not in Rec Center machine).

---

## Demo Data Summary

| Machine | Location | Status | Alerts |
|---|---|---|---|
| Main Lobby | Purdue Union – 1st Floor | Online | 2 |
| Engineering Hall | WALC – 3rd Floor | Online | 1 |
| Rec Center | Co-Rec – Lobby | Offline | 4 |

**Warehouse (operatorInventory.js):** Lay's Classic, Red Bull, Doritos Nacho, Water (16oz), Gatorade Blue, Cheez-Its, Snickers, Kit Kat

---

## Design System
- **Primary blue:** `#1e40af`
- **Light blue:** `#bfdbfe`, `#eff6ff`
- **Green:** `#16a34a`
- **Yellow/warning:** `#d97706`
- **Red/danger:** `#dc2626`
- **Background:** `#f0f4f8`
- **Text:** `#1e293b` (dark), `#64748b` (muted)
- All icons: Ionicons from `@expo/vector-icons`
- No emojis anywhere in the React Native app (user preference)
- Font weights: 900 for titles, 800 for section headers, 700 for labels

---

## What's NOT Built Yet
- Firebase backend (real-time data sync)
- Arduino + IR sensor hardware integration
- Push notifications (machine offline / slot empty alerts)
- Multi-operator accounts
- Real QR code generation for customer page
- iPhone testing (Expo Go incompatible with SDK 56 — web browser only for now)
- The "Edit Machine Details" screen saves to local state only (no persistence between sessions)
- Warehouse inventory edits save to local state only

---

## Key Things to Know
1. **Never downgrade Expo SDK** — Node v24 breaks anything below SDK 56
2. **Always use `--legacy-peer-deps`** when installing new packages
3. **Port 8082** — if 8081 is busy, Expo switches to 8082 automatically
4. The app is React Native running in a web browser — some web-specific quirks apply
5. The `docs/` folder must be rebuilt and pushed whenever UI changes need to go live on GitHub Pages
6. `MachinesContext` is the single source of truth — never import directly from `dummyData.js` in screens (always use `useMachines()`)

---

## Common Commands
```bash
# Start dev server
npx expo start --web

# Rebuild GitHub Pages bundle
npx expo export --platform web --output-dir docs

# Install a new package
npm install <package> --legacy-peer-deps
```

---

## Files on Desktop (Non-Code)
- `VendSmart_Progress.md` — build summary
- `VendSmart_Overview.html` — 5-page overview document (open in browser → print to PDF)
- `VendSmart.app` — one-click launcher (opens Claude, Terminal, Chrome)
