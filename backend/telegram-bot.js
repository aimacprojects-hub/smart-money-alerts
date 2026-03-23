// AiVentures - Smart Money Alerts
// Telegram Bot Notification System
// March 22, 2026

const TELEGRAM_BOT_TOKEN = '8664907137:AAEpZfrjHa4DmQGyBGpcVI6MOkCx5az9oUk';
const TELEGRAM_CHAT_ID = '1992343537';     // Mac's chat ID

// Send message to Telegram
async function sendTelegramMessage(message) {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.log('⚠️ Telegram bot not configured. Set TELEGRAM_BOT_TOKEN in telegram-bot.js');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        });

        const data = await response.json();

        if (!data.ok) {
            throw new Error(data.description || 'Telegram API error');
        }

        console.log('✅ Telegram message sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error.message);
        return false;
    }
}

// Format alert for Telegram
function formatTelegramAlert(alert) {
    const emoji = alert.alertType === 'DEPOSIT' ? '📈' : '📉';
    const severityEmoji = alert.severity === 'HIGH' ? '🔴' :
                         alert.severity === 'MEDIUM' ? '🟡' : '🟢';

    return `
${emoji} *WHALE ALERT* ${severityEmoji} ${alert.severity} SEVERITY

*Whale:* ${alert.whale} (${alert.type})
*Action:* ${alert.alertType}
*Amount:* ${Math.abs(alert.change).toLocaleString()} SOL
*USD Value:* $${parseFloat(alert.usdValue).toLocaleString()}
*Change:* ${alert.percentChange}%

*Previous:* ${alert.previousBalance.toLocaleString()} SOL
*Current:* ${alert.currentBalance.toLocaleString()} SOL

*Time:* ${new Date(alert.timestamp).toLocaleString()}

_Smart Money Alerts by AiVentures_
`.trim();
}

// Send whale alert to Telegram
async function sendWhaleAlert(alert) {
    const message = formatTelegramAlert(alert);
    return await sendTelegramMessage(message);
}

// Test Telegram connection
async function testTelegramConnection() {
    console.log('\n🧪 TESTING TELEGRAM BOT CONNECTION\n');

    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.log('❌ Bot token not configured');
        console.log('📝 Follow instructions in TELEGRAM-BOT-SETUP.md\n');
        return false;
    }

    const testMessage = `
🤖 *Smart Money Alerts Bot - Connection Test*

✅ Bot is online and ready!
📊 Monitoring Solana whale wallets
🔔 You'll receive alerts when big money moves

_AiVentures - Building in public_
`.trim();

    const success = await sendTelegramMessage(testMessage);

    if (success) {
        console.log('✅ Telegram bot connection successful!\n');
    } else {
        console.log('❌ Telegram bot connection failed\n');
    }

    return success;
}

// Get chat ID (for setup)
async function getMyChatId() {
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.log('❌ Bot token not configured');
        return null;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok && data.result.length > 0) {
            const chatId = data.result[0].message.chat.id;
            console.log('📱 Your Telegram Chat ID:', chatId);
            return chatId;
        } else {
            console.log('⚠️ No messages found. Send /start to your bot first!');
            return null;
        }
    } catch (error) {
        console.error('❌ Error getting chat ID:', error.message);
        return null;
    }
}

// Export functions
module.exports = {
    sendWhaleAlert,
    sendTelegramMessage,
    formatTelegramAlert,
    testTelegramConnection,
    getMyChatId
};

// If run directly, test connection
if (require.main === module) {
    testTelegramConnection().catch(error => {
        console.error('❌ TEST ERROR:', error);
        process.exit(1);
    });
}
