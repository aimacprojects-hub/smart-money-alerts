// AiVentures - Smart Money Alerts
// Helius API Test - Track Solana Whale Wallets
// March 22, 2026

const HELIUS_API_KEY = '2ab22721-97ce-47a8-aaec-683f239ac04e';
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

// Test wallet: A known Solana whale address
const TEST_WHALE_WALLET = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'; // Jupiter Aggregator wallet

async function getWalletBalance(walletAddress) {
    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [walletAddress]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const balanceLamports = data.result.value;
        const balanceSOL = balanceLamports / 1000000000; // Convert lamports to SOL

        return {
            wallet: walletAddress,
            balance: balanceSOL,
            balanceUSD: (balanceSOL * 88.5).toFixed(2), // Assuming $88.50/SOL
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        throw error;
    }
}

async function getRecentTransactions(walletAddress, limit = 5) {
    try {
        const response = await fetch(HELIUS_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getSignaturesForAddress',
                params: [
                    walletAddress,
                    { limit: limit }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.result.map(tx => ({
            signature: tx.signature,
            timestamp: new Date(tx.blockTime * 1000).toISOString(),
            status: tx.err ? 'failed' : 'success'
        }));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}

async function trackWhaleWallet() {
    console.log('🐋 AIVENTURES - WHALE TRACKER TEST\n');
    console.log('=' .repeat(60));
    console.log(`Testing Helius API Connection...`);
    console.log(`Tracking wallet: ${TEST_WHALE_WALLET}\n`);

    // Get balance
    console.log('📊 Fetching wallet balance...');
    const balanceInfo = await getWalletBalance(TEST_WHALE_WALLET);

    console.log('\n✅ BALANCE RETRIEVED:');
    console.log(`   Wallet: ${balanceInfo.wallet}`);
    console.log(`   Balance: ${balanceInfo.balance.toLocaleString()} SOL`);
    console.log(`   USD Value: $${balanceInfo.balanceUSD.toLocaleString()}`);
    console.log(`   Checked at: ${balanceInfo.timestamp}`);

    // Get recent transactions
    console.log('\n📜 Fetching recent transactions...');
    const transactions = await getRecentTransactions(TEST_WHALE_WALLET, 5);

    console.log('\n✅ RECENT TRANSACTIONS:');
    transactions.forEach((tx, index) => {
        console.log(`   ${index + 1}. ${tx.signature.substring(0, 20)}...`);
        console.log(`      Status: ${tx.status}`);
        console.log(`      Time: ${tx.timestamp}\n`);
    });

    console.log('=' .repeat(60));
    console.log('✅ HELIUS API TEST SUCCESSFUL!');
    console.log('🚀 Ready to build Smart Money Alerts!');
}

// Run the test
trackWhaleWallet().catch(error => {
    console.error('❌ TEST FAILED:', error);
    process.exit(1);
});
