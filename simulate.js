/**
 * VendSmart — Vending Machine Simulator
 *
 * Simulates real dispense events from vending machines.
 * Run with: node simulate.js
 * Stop with: Ctrl+C
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyAH4ofgtAVtfT341MxSOBZy6vFYmLvsqRU',
  authDomain: 'vend-smart.firebaseapp.com',
  projectId: 'vend-smart',
  storageBucket: 'vend-smart.firebasestorage.app',
  messagingSenderId: '80172679067',
  appId: '1:80172679067:web:d350617706d89ead836b3e',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DISPENSE_INTERVAL = 8000;
const OFFLINE_CHANCE = 25;
const MAX_RECENT_SALES = 20;

let cycleCount = 0;

function log(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${msg}`);
}

function timeStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2025-06-28"
}

async function getMachines() {
  const snap = await getDocs(collection(db, 'machines'));
  return snap.docs.map(d => ({ firestoreId: d.id, ...d.data() }));
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function dispenseEvent() {
  cycleCount++;

  try {
    const machines = await getMachines();
    if (!machines.length) { log('No machines found.'); return; }

    const machine = pickRandom(machines);
    const slots = machine.slots || [];
    if (!slots.length) { log(`${machine.name} has no slots.`); return; }

    // Occasionally go offline
    if (cycleCount % OFFLINE_CHANCE === 0) {
      log(`⚠️  ${machine.name} going offline...`);
      await updateDoc(doc(db, 'machines', machine.firestoreId), { status: 'offline' });
      setTimeout(async () => {
        await updateDoc(doc(db, 'machines', machine.firestoreId), { status: 'online' });
        log(`✅ ${machine.name} back online`);
      }, 6000);
      return;
    }

    const availableSlots = slots.filter(s => s.stock > 0);
    if (!availableSlots.length) { log(`${machine.name} — all empty`); return; }

    const slot = pickRandom(availableSlots);
    const price = slot.price || 1.75;
    const today = todayKey();

    // Update slots
    const newSlots = slots.map(s =>
      s.id === slot.id ? { ...s, stock: Math.max(0, s.stock - 1) } : s
    );
    const itemsInStock = newSlots.reduce((sum, s) => sum + s.stock, 0);
    const alerts = newSlots.filter(s => s.stock === 0 || s.stock / s.capacity <= 0.3).length;

    // Build new sale entry
    const newSale = {
      item: slot.name,
      qty: 1,
      time: timeStr(),
      revenue: price,
      slotId: slot.id,
      date: today,
    };

    // Append to recentSales, keep last MAX_RECENT_SALES
    const existingSales = Array.isArray(machine.recentSales) ? machine.recentSales : [];
    const recentSales = [newSale, ...existingSales].slice(0, MAX_RECENT_SALES);

    // Update earnings totals
    const earnings = machine.earnings || {};
    const revenueToday = parseFloat(((machine.revenueToday || 0) + price).toFixed(2));
    const monthToDate = parseFloat(((earnings.monthToDate || 0) + price).toFixed(2));
    const thisWeek = parseFloat(((earnings.thisWeek || 0) + price).toFixed(2));
    const itemsSoldMonth = (earnings.itemsSoldMonth || 0) + 1;

    // Update week sales (today's bar)
    const weekSales = Array.isArray(machine.weekSales) ? [...machine.weekSales] : [];
    const dayLabel = new Date().toLocaleDateString('en', { weekday: 'short' });
    const dayIdx = weekSales.findIndex(d => d.day === dayLabel);
    if (dayIdx >= 0) {
      weekSales[dayIdx] = { ...weekSales[dayIdx], sales: weekSales[dayIdx].sales + 1 };
    }

    // Update peak hours (current hour's bar)
    const peakHours = Array.isArray(machine.peakHours) ? [...machine.peakHours] : [];
    const hourLabel = new Date().toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(' ', '').toLowerCase();
    const hourIdx = peakHours.findIndex(h => h.hour === hourLabel);
    if (hourIdx >= 0) {
      peakHours[hourIdx] = { ...peakHours[hourIdx], sales: peakHours[hourIdx].sales + 1 };
    }

    await updateDoc(doc(db, 'machines', machine.firestoreId), {
      slots: newSlots,
      itemsInStock,
      alerts,
      revenueToday,
      recentSales,
      weekSales,
      peakHours,
      lastUpdated: Math.floor(Date.now() / 1000),
      status: 'online',
      earnings: {
        ...earnings,
        monthToDate,
        thisWeek,
        itemsSoldMonth,
        avgPerDay: parseFloat((monthToDate / 28).toFixed(2)),
        avgSalePrice: parseFloat((monthToDate / Math.max(itemsSoldMonth, 1)).toFixed(2)),
        recentSales,
      },
    });

    const stockAfter = slot.stock - 1;
    const warn = stockAfter === 0 ? ' 🚨 EMPTY' : stockAfter <= Math.floor(slot.capacity * 0.3) ? ' ⚠️  LOW' : '';
    log(`🟢 ${machine.name} — [${slot.id}] ${slot.name} $${price.toFixed(2)}${warn} | Stock: ${stockAfter}/${slot.capacity} | Today: $${revenueToday}`);

  } catch (err) {
    log(`❌ Error: ${err.message}`);
  }
}

console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║   VendSmart Machine Simulator            ║');
console.log('║   Firing dispense events every 8s        ║');
console.log('║   Press Ctrl+C to stop                   ║');
console.log('╚══════════════════════════════════════════╝');
console.log('');
log('Starting — open the app to watch live updates');
console.log('');

dispenseEvent();
setInterval(dispenseEvent, DISPENSE_INTERVAL);
