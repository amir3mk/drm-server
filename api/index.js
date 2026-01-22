export default function handler(req, res) {
    // إعدادات CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    // 1. كلمة السر الخاصة بك (غيرها لأي حاجة صعبة)
    const MY_SECRET_PASSWORD = "Amir-Vip-2026-Secret";

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. التحقق من كلمة السر القادمة من التطبيق
    const authHeader = req.headers['x-app-auth'];
    
    if (authHeader !== MY_SECRET_PASSWORD) {
        // لو كلمة السر غلط أو مش موجودة، اطرده
        return res.status(403).json({ error: "Access Denied: App Only" });
    }

    try {
        const { keyid, key } = req.query;

        if (!keyid || !key) {
            return res.status(400).json({ error: "Missing keys" });
        }

        const hexToBase64 = (str) => {
            return Buffer.from(str.trim(), 'hex')
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');
        };

        const kid = hexToBase64(keyid);
        const k = hexToBase64(key);

        const drmData = {
            keys: [{ kty: "oct", k: k, kid: kid }],
            type: "temporary"
        };

        return res.status(200).json(drmData);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
