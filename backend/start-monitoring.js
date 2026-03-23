// AiVentures - Smart Money Alerts
// Start Continuous Monitoring
// March 23, 2026

const { startContinuousMonitoring } = require('./alert-system.js');

console.log('🚀 SMART MONEY ALERTS - STARTING 24/7 MONITORING');
console.log('='.repeat(70));
console.log('AiVentures Autonomous Whale Tracker');
console.log('Monitoring interval: Every 5 minutes');
console.log('Telegram alerts: ENABLED');
console.log('='.repeat(70) + '\n');

// Start continuous monitoring (checks every 5 minutes)
startContinuousMonitoring(5);

// Keep process alive
process.on('SIGINT', () => {
    console.log('\n\n🛑 Monitoring stopped by user');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n🛑 Monitoring stopped');
    process.exit(0);
});

console.log('✅ Monitoring service started successfully!');
console.log('📱 You will receive Telegram alerts when whales move');
console.log('⏸️  Press Ctrl+C to stop\n');
