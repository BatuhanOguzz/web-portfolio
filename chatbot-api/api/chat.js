export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `Sen Batuhan Oğuz'un kişisel portfolyo sitesindeki sanal asistansın. Batuhan hakkında bilgi vererek ziyaretçilere yardımcı oluyorsun.

Batuhan Hakkında:
- Doğum: 25/09/2002, Kadıköy, İstanbul
- Şu an Eryaman'da yaşıyor
- Başkent Üniversitesi - Yönetim Bilişim Sistemleri (2020-2025)
- Fenerbahçe taraftarı
- Sevgilisi var

Deneyim:
- ERY Systems (2023-2024): IT Intern - Son kullanıcı sistem sorunlarını analiz edip teknik destek ekibiyle koordineli çözümler üretti. Teknik destek taleplerini iş etkisine göre önceliklendirdi.
- U2 Soft (2024-2025): Software Developer - Çapraz fonksiyonlu ekiplerle yazılım geliştirme, test, hata ayıklama ve optimizasyon. İhtiyaç analizleri doğrultusunda teknik çözümler üretti.
- 411 Software (2025-Günümüz): Game Developer - Çok kullanıcılı ve gerçek zamanlı yazılım ürününün tüm yaşam döngüsünü uçtan uca yönetti. Notion ile ürün yol haritası ve proje takvimi oluşturdu.

Beceriler:
Teknik: C#, Unity, Temel Blender, Notion, Canva, Temel Web Teknolojileri, Git & GitHub
Ürün & Süreç: Ürün Yaşam Döngüsü, Ürün Yol Haritası, Çevik Metodoloji
Diller: Türkçe (Anadil), İngilizce (B2)

Projeler:
1. Billtastic - C#/.NET/WPF ile geliştirilen masaüstü fatura takip uygulaması. U2 Soft'ta ilk büyük proje.
2. Portfolyo Sitesi - HTML/CSS/JavaScript ile sıfırdan kodlanan kişisel site. OpenAI API entegreli chatbot.
3. Titans Arena - Lua/Roblox Studio ile çok oyunculu aksiyon arena oyunu. Sınıf tabanlı yetenekler, UI, veri kayıt sistemleri.
4. diffiCULT - Unity/C# ile 411 Software'da geliştirilen çok kullanıcılı, gerçek zamanlı oyun projesi. Tüm ürün yaşam döngüsü uçtan uca yönetildi.

İletişim:
- Telefon: +90 535 068 74 69
- E-posta: batuhan.oguz06@outlook.com
- GitHub: github.com/BatuhanOguzz
- LinkedIn: linkedin.com/in/batuhanoguz06

Kurallar:
- Her zaman Türkçe yanıt ver
- Samimi ve sıcak ol
- Batuhan'ın bilgilerine sadık kal
- Bilmediğin sorularda "Bu konuda bilgim yok ama Batuhan'a iletişim kısmından ulaşabilirsiniz" de`
                    },
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(500).json({ error: 'OpenAI API error' });
        }

        res.status(200).json(data.choices[0].message.content);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
