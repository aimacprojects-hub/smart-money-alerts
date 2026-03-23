// AiVentures - Smart Money Alerts
// Alert Notification System
// March 22, 2026

const fs = require('fs');
const path = require('path');
const { sendWhaleAlert } = require('./telegram-bot.js');

const HELIUS_API_KEY = '2ab22721-97ce-47a8-aaec-683f239ac04e';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const DATA_FILE = path.join(__dirname, '../database/whale-data.json');
const ALERTS_FILE = path.join(__dirname, '../database/alerts.json');

// Whale wallets to monitor
const WHALE_WALLETS = [
    {
        address: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
        name: 'Jupiter Aggregator',
        type: 'DEX Protocol'
    },
    {
        address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
        name: 'Raydium Authority',
        type: 'DEX Protocol'
    },
    {
        address: 'GThUX1Atko4tqhN2NaiTazWSeFWMuiUvfFnyJyUghFMJ',
        name: 'Marinade Treasury',
        type: 'Staking Protocol'
    }
];

// Alert thresholds
const ALERT_THRESHOLDS = {
    percentChange: 5,      // Alert if balance changes by >5%
    absoluteChange: 100,   // Alert if balance changes by >100 SOL
    minBalance: 1          // Only track wallets with >1 SOL
};

// Fetch wallet balance
async function getWalletBalance(walletAddress) {
    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [walletAddress]
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        return data.result.value / 1000000000;
    } catch (error) {
        console.error(`Error fetching balance: ${error.message}`);
        return null;
    }
}

// Load previous data
function loadData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error.message);
    }
    return {};
}

// Save data
function saveData(filePath, data) {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error saving ${filePath}:`, error.message);
    }
}

// Analyze balance change and generate alert
function analyzeChange(previous, current, whaleInfo) {
    if (!previous) return null;

    const balanceChange = current - previous;
    const percentChange = (balanceChange / previous) * 100;

    // Check if change exceeds thresholds
    const exceedsPercent = Math.abs(percentChange) > ALERT_THRESHOLDS.percentChange;
    const exceedsAbsolute = Math.abs(balanceChange) > ALERT_THRESHOLDS.absoluteChange;

    if (exceedsPercent || exceedsAbsolute) {
        return {
            id: `alert_${Date.now()}_${whaleInfo.address.substring(0, 8)}`,
            timestamp: new Date().toISOString(),
            whale: whaleInfo.name,
            type: whaleInfo.type,
            address: whaleInfo.address,
            alertType: balanceChange > 0 ? 'DEPOSIT' : 'WITHDRAWAL',
            previousBalance: previous,
            currentBalance: current,
            change: balanceChange,
            percentChange: percentChange.toFixed(2),
            usdValue: (Math.abs(balanceChange) * 88.5).toFixed(2),
            severity: Math.abs(balanceChange) > 1000 ? 'HIGH' :
                     Math.abs(balanceChange) > 500 ? 'MEDIUM' : 'LOW'
        };
    }

    return null;
}

// Format alert for display
function formatAlert(alert) {
    const emoji = alert.alertType === 'DEPOSIT' ? '📈' : '📉';
    const direction = alert.alertType === 'DEPOSIT' ? 'deposited' : 'withdrawn';

    return `
${emoji} WHALE ALERT - ${alert.severity} SEVERITY

Whale: ${alert.whale} (${alert.type})
Action: ${direction.toUpperCase()}
Amount: ${Math.abs(alert.change).toLocaleString()} SOL
USD Value: $${parseFloat(alert.usdValue).toLocaleString()}
Change: ${alert.percentChange}%

Previous: ${alert.previousBalance.toLocaleString()} SOL
Current: ${alert.currentBalance.toLocaleString()} SOL

Time: ${new Date(alert.timestamp).toLocaleString()}
Wallet: ${alert.address.substring(0, 20)}...

---
Smart Money Alerts by AiVentures
`.trim();
}

// Send alert notification
async function sendNotification(alert) {
    console.log('\n' + '='.repeat(70));
    console.log('🚨 ALERT TRIGGERED:');
    console.log('='.repeat(70));
    console.log(formatAlert(alert));
    console.log('='.repeat(70));

    // Send to Telegram
    try {
        await sendWhaleAlert(alert);
    } catch (error) {
        console.error('⚠️ Failed to send Telegram alert:', error.message);
    }
}

// Monitor whales and generate alerts
async function monitorWhales() {
    console.log('\n🔍 AIVENTURES - SMART MONEY ALERTS');
    console.log('=' .repeat(70));
    console.log(`Monitoring ${WHALE_WALLETS.length} whale wallets...`);
    console.log(`Time: ${new Date().toLocaleString()}\n`);

    const previousData = loadData(DATA_FILE);
    const alerts = [];

    for (const whale of WHALE_WALLETS) {
        console.log(`📊 Checking: ${whale.name}`);

        const currentBalance = await getWalletBalance(whale.address);
        if (currentBalance === null) {
            console.log(`   ❌ Failed to fetch\n`);
            continue;
        }

        const previousBalance = previousData[whale.address]?.balance;

        console.log(`   Balance: ${currentBalance.toLocaleString()} SOL`);

        // Analyze for alerts
        const alert = analyzeChange(previousBalance, currentBalance, whale);
        if (alert) {
            alerts.push(alert);
            sendNotification(alert);
        } else {
            console.log(`   ✓ No significant change`);
        }

        console.log('');

        // Update data
        previousData[whale.address] = {
            name: whale.name,
            type: whale.type,
            balance: currentBalance,
            lastChecked: new Date().toISOString()
        };

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Save updated data
    saveData(DATA_FILE, previousData);

    // Save alerts
    if (alerts.length > 0) {
        const alertHistory = loadData(ALERTS_FILE);
        if (!alertHistory.alerts) alertHistory.alerts = [];

        alertHistory.alerts.push(...alerts);

        // Keep only last 100 alerts
        if (alertHistory.alerts.length > 100) {
            alertHistory.alerts = alertHistory.alerts.slice(-100);
        }

        saveData(ALERTS_FILE, alertHistory);
    }

    // Summary
    console.log('='.repeat(70));
    console.log(`✅ MONITORING COMPLETE`);
    console.log(`   Wallets checked: ${WHALE_WALLETS.length}`);
    console.log(`   Alerts triggered: ${alerts.length}`);
    console.log(`   Data saved: ${DATA_FILE}`);

    if (alerts.length > 0) {
        console.log(`   Alert history: ${ALERTS_FILE}`);
    }

    console.log('='.repeat(70) + '\n');

    return {
        checked: WHALE_WALLETS.length,
        alerts: alerts,
        timestamp: new Date().toISOString()
    };
}

// Continuous monitoring mode
async function startContinuousMonitoring(intervalMinutes = 5) {
    console.log(`\n🤖 Starting continuous monitoring (every ${intervalMinutes} minutes)...\n`);

    // Run immediately
    await monitorWhales();

    // Then run on interval
    setInterval(async () => {
        await monitorWhales();
    }, intervalMinutes * 60 * 1000);
}

// Export for use in other modules
module.exports = {
    monitorWhales,
    startContinuousMonitoring,
    analyzeChange,
    formatAlert
};

// If run directly, do one-time check
if (require.main === module) {
    monitorWhales().catch(error => {
        console.error('❌ MONITORING ERROR:', error);
        process.exit(1);
    });
}
