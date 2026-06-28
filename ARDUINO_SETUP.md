# VendSmart — Arduino/ESP32 Setup Guide

Hey! This guide will get your Arduino sending real vending machine data into the VendSmart app.
Follow these steps and you'll have live data flowing in no time.

---

## What You Need

- An Arduino with a **WiFi chip** (ESP8266, ESP32, or Arduino with WiFi shield)
- **Arduino IDE** installed on your computer (free at arduino.cc)
- A USB cable to connect Arduino to your computer
- Your WiFi network name and password
- The machine ID and slot list from Ethan (see bottom of this guide)

---

## Step 1 — Install Arduino IDE

Download and install from: https://www.arduino.cc/en/software

---

## Step 2 — Install the Right Board

In Arduino IDE:
1. Go to **File → Preferences**
2. In "Additional Boards Manager URLs" paste:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Tools → Board → Boards Manager**
4. Search **esp32** and install it (by Espressif Systems)

---

## Step 3 — Install Required Libraries

In Arduino IDE go to **Sketch → Include Library → Manage Libraries** and install:

- **ArduinoJson** (by Benoit Blanchon)

---

## Step 4 — The Code

Copy this entire sketch into a new Arduino IDE file.
Fill in the blanks at the top marked with `<-- FILL IN`.

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ─── FILL THESE IN ───────────────────────────────────────────
const char* WIFI_SSID     = "YourWiFiName";       // <-- FILL IN
const char* WIFI_PASSWORD = "YourWiFiPassword";   // <-- FILL IN
const char* MACHINE_ID    = "machine-1";          // <-- FILL IN (get from Ethan)
// ─────────────────────────────────────────────────────────────

// VendSmart Firebase — do not change these
const char* FIREBASE_PROJECT = "vend-smart";

// How often to send data — 30 seconds
const int SEND_INTERVAL = 30000;
unsigned long lastSend = 0;

// ─── YOUR SLOT CONFIGURATION ─────────────────────────────────
// This must match what Ethan has set up in the app.
// Each slot has an ID, a name, and a max capacity.
// You will fill in the current stock from your sensors in loop().
struct Slot {
  const char* id;
  const char* name;
  int capacity;
  float price;
  int stock; // filled in by your sensors
};

// Update this list to match your machine's actual slots (get from Ethan)
Slot slots[] = {
  { "A1", "Lays Classic",          10, 1.75, 0 },
  { "A2", "Doritos Nacho",         10, 1.75, 0 },
  { "A3", "Cheez-Its",             10, 1.50, 0 },
  { "A4", "Peanut Butter Crackers",10, 1.25, 0 },
  { "B1", "Water (16oz)",          12, 1.50, 0 },
  { "B2", "Gatorade Blue",         12, 2.25, 0 },
  { "B3", "Diet Coke",             12, 1.75, 0 },
  { "B4", "Red Bull",               8, 3.50, 0 },
};
const int NUM_SLOTS = sizeof(slots) / sizeof(slots[0]);
// ─────────────────────────────────────────────────────────────

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ─── READ YOUR SENSORS HERE ──────────────────────────────
  // Replace these fake numbers with real readings from your sensors.
  // Each slots[i].stock should be set to the actual item count
  // your sensors detect for that slot.
  slots[0].stock = 8;  // A1 — replace with real sensor read
  slots[1].stock = 3;  // A2 — replace with real sensor read
  slots[2].stock = 0;  // A3 — replace with real sensor read
  slots[3].stock = 9;  // A4 — replace with real sensor read
  slots[4].stock = 5;  // B1 — replace with real sensor read
  slots[5].stock = 7;  // B2 — replace with real sensor read
  slots[6].stock = 3;  // B3 — replace with real sensor read
  slots[7].stock = 1;  // B4 — replace with real sensor read
  // ─────────────────────────────────────────────────────────

  if (millis() - lastSend >= SEND_INTERVAL) {
    lastSend = millis();
    sendDataToFirestore();
  }
}

void sendDataToFirestore() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost. Skipping send.");
    return;
  }

  // Calculate totals
  int totalStock = 0;
  int alerts = 0;
  for (int i = 0; i < NUM_SLOTS; i++) {
    totalStock += slots[i].stock;
    float ratio = (float)slots[i].stock / slots[i].capacity;
    if (slots[i].stock == 0 || ratio <= 0.3) alerts++;
  }

  // Build Firestore JSON payload
  // Format: https://firestore.googleapis.com/v1/projects/{project}/databases/(default)/documents/{collection}/{doc}
  StaticJsonDocument<4096> doc;
  JsonObject fields = doc.createNestedObject("fields");

  // itemsInStock
  fields["itemsInStock"]["integerValue"] = String(totalStock);

  // alerts
  fields["alerts"]["integerValue"] = String(alerts);

  // status
  fields["status"]["stringValue"] = "online";

  // lastUpdated timestamp (epoch seconds as string)
  fields["lastUpdated"]["integerValue"] = String(millis() / 1000);

  // slots array
  JsonObject slotsField = fields.createNestedObject("slots");
  JsonArray slotsArray = slotsField.createNestedArray("arrayValue").createNestedArray("values");

  for (int i = 0; i < NUM_SLOTS; i++) {
    JsonObject slotMap = slotsArray.createNestedObject();
    JsonObject mapFields = slotMap.createNestedObject("mapValue").createNestedObject("fields");

    mapFields["id"]["stringValue"]       = slots[i].id;
    mapFields["name"]["stringValue"]     = slots[i].name;
    mapFields["stock"]["integerValue"]   = String(slots[i].stock);
    mapFields["capacity"]["integerValue"]= String(slots[i].capacity);
    mapFields["price"]["doubleValue"]    = slots[i].price;
    mapFields["reorderUrl"]["stringValue"] = "https://www.costco.com";
  }

  String body;
  serializeJson(doc, body);

  // Fields to update (only update these, leave the rest alone)
  String url = "https://firestore.googleapis.com/v1/projects/";
  url += FIREBASE_PROJECT;
  url += "/databases/(default)/documents/machines/";
  url += MACHINE_ID;
  url += "?updateMask.fieldPaths=slots";
  url += "&updateMask.fieldPaths=itemsInStock";
  url += "&updateMask.fieldPaths=alerts";
  url += "&updateMask.fieldPaths=status";
  url += "&updateMask.fieldPaths=lastUpdated";

  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");

  int code = http.sendRequest("PATCH", body);

  if (code > 0) {
    Serial.println("Sent! HTTP " + String(code));
    Serial.println("Total stock: " + String(totalStock) + " | Alerts: " + String(alerts));
  } else {
    Serial.println("Error: " + String(code));
  }

  http.end();
}
```

---

## Step 5 — Upload to Your Arduino

1. Connect your Arduino via USB
2. **Tools → Board** — select your board (e.g. "ESP32 Dev Module")
3. **Tools → Port** — select the correct COM port
4. Click **Upload** (the arrow button)
5. Open **Tools → Serial Monitor**, set baud to **115200**
6. You should see "WiFi connected!" then "Sent! HTTP 200" every 30 seconds

---

## Step 6 — Check the App

After the first successful send, open **https://epravato.github.io/Smart-vend-app/** and navigate to your machine. Stock levels update in real time — no refresh needed.

---

## What Data Gets Sent

Every 30 seconds the Arduino sends:

| Field | What it is |
|---|---|
| `slots` | Full list of slots with current stock per slot |
| `itemsInStock` | Total items across all slots |
| `alerts` | Number of empty or low slots |
| `status` | Always "online" while Arduino is running |
| `lastUpdated` | Timestamp of last sync |

The app shows a **"Last synced"** label on each machine so you can see if the Arduino is still alive.

---

## Replacing Fake Numbers with Real Sensors

Right now the code sends hardcoded numbers. Once your sensors are wired up, replace the stock values in the `loop()` section with real reads. For example with an ultrasonic sensor:

```cpp
slots[0].stock = measureStock(TRIG_PIN_A1, ECHO_PIN_A1, MAX_CM);
```

Tell Ethan what sensors you have and he'll help wire it up.

---

## Machine + Slot Info (from Ethan)

**Machine ID:** `machine-1`

| Slot ID | Product | Capacity |
|---|---|---|
| A1 | Lays Classic | 10 |
| A2 | Doritos Nacho | 10 |
| A3 | Cheez-Its | 10 |
| A4 | Peanut Butter Crackers | 10 |
| B1 | Water (16oz) | 12 |
| B2 | Gatorade Blue | 12 |
| B3 | Diet Coke | 12 |
| B4 | Red Bull | 8 |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| WiFi not connecting | Check SSID/password, must be 2.4GHz not 5GHz |
| HTTP -1 | Can't reach internet — check router |
| HTTP 403 | Firebase rules issue — tell Ethan |
| HTTP 404 | Wrong MACHINE_ID — double check with Ethan |
| App not updating | Make sure slot IDs match exactly |
