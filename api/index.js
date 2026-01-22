export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
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
