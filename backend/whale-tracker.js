// AiVentures - Smart Money Alerts
// Multi-Wallet Whale Tracker
// March 22, 2026

const fs = require('fs');
const path = require('path');

const HELIUS_API_KEY = '2ab22721-97ce-47a8-aaec-683f239ac04e';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const DATA_FILE = path.join(__dirname, '../database/whale-data.json');

// Top Solana whale wallets to track
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

        const balanceSOL = data.result.value / 1000000000;
        return balanceSOL;
    } catch (error) {
        console.error(`Error fetching balance for ${walletAddress}:`, error.message);
        return null;
    }
}

// Fetch recent transaction
async function getLatestTransaction(walletAddress) {
    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getSignaturesForAddress',
                params: [walletAddress, { limit: 1 }]
            })
        });

        const data = await response.json();
        if (data.error || !data.result || data.result.length === 0) return null;

        const tx = data.result[0];
        return {
            signature: tx.signature,
            timestamp: new Date(tx.blockTime * 1000).toISOString(),
            status: tx.err ? 'failed' : 'success'
        };
    } catch (error) {
        console.error(`Error fetching transaction for ${walletAddress}:`, error.message);
        return null;
    }
}

// Load previous data
function loadPreviousData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading previous data:', error.message);
    }
    return {};
}

// Save data
function saveData(data) {
    try {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error.message);
    }
}

// Detect significant changes
function detectChanges(previous, current) {
    if (!previous) return null;

    const balanceChange = current.balance - previous.balance;
    const percentChange = (balanceChange / previous.balance) * 100;

    // Alert if balance changed by more than 5% or more than 100 SOL
    if (Math.abs(percentChange) > 5 || Math.abs(balanceChange) > 100) {
        return {
            type: balanceChange > 0 ? 'DEPOSIT' : 'WITHDRAWAL',
            amount: Math.abs(balanceChange),
            percentChange: percentChange.toFixed(2),
            previousBalance: previous.balance,
            currentBalance: current.balance
        };
    }

    return null;
}

// Main tracking function
async function trackWhales() {
    console.log('\n🐋 AIVENTURES - WHALE TRACKER');
    console.log('=' .repeat(70));
    console.log(`Tracking ${WHALE_WALLETS.length} whale wallets...`);
    console.log(`Time: ${new Date().toISOString()}\n`);

    const previousData = loadPreviousData();
    const currentData = {};
    const alerts = [];

    for (const whale of WHALE_WALLETS) {
        console.log(`📊 Checking: ${whale.name} (${whale.type})`);

        // Get current balance
        const balance = await getWalletBalance(whale.address);
        if (balance === null) {
            console.log(`   ❌ Failed to fetch balance\n`);
            continue;
        }

        // Get latest transaction
        const latestTx = await getLatestTransaction(whale.address);

        // Calculate USD value
        const usdValue = (balance * 88.5).toFixed(2);

        // Store current data
        currentData[whale.address] = {
            name: whale.name,
            type: whale.type,
            balance: balance,
            usdValue: usdValue,
            latestTransaction: latestTx,
            lastChecked: new Date().toISOString()
        };

        console.log(`   Balance: ${balance.toLocaleString()} SOL ($${parseFloat(usdValue).toLocaleString()})`);

        // Check for significant changes
        const change = detectChanges(previousData[whale.address], currentData[whale.address]);
        if (change) {
            console.log(`   🚨 ALERT: ${change.type} detected!`);
            console.log(`   Amount: ${change.amount.toLocaleString()} SOL (${change.percentChange}%)`);
            alerts.push({
                whale: whale.name,
                ...change
            });
        }

        if (latestTx) {
            console.log(`   Latest TX: ${latestTx.signature.substring(0, 20)}... (${latestTx.status})`);
        }

        console.log('');

        // Rate limiting - wait 200ms between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Save current data
    saveData(currentData);

    // Summary
    console.log('=' .repeat(70));
    console.log('✅ TRACKING COMPLETE');
    console.log(`   Wallets tracked: ${Object.keys(currentData).length}`);
    console.log(`   Alerts generated: ${alerts.length}`);

    if (alerts.length > 0) {
        console.log('\n🚨 ALERTS:');
        alerts.forEach((alert, i) => {
            console.log(`   ${i + 1}. ${alert.whale}: ${alert.type} of ${alert.amount.toLocaleString()} SOL (${alert.percentChange}%)`);
        });
    }

    console.log('\n💾 Data saved to:', DATA_FILE);
    console.log('🔄 Run again to detect changes!\n');

    return {
        tracked: Object.keys(currentData).length,
        alerts: alerts.length,
        data: currentData
    };
}

// Run tracker
trackWhales().catch(error => {
    console.error('❌ TRACKER ERROR:', error);
    process.exit(1);
});
