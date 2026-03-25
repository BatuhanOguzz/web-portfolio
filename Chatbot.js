import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // __dirname burada tanımlanıyor

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Kök dizindeki statik dosyaları sunma
app.use(express.static(path.join(__dirname))); // __dirname, dosyanın bulunduğu dizini belirtir

app.use(express.json()); // JSON gövde verilerini işlemek için middleware ekleniyor

app.post('/api/chat', async (req, res) => {
    const message = req.body.message;
    
    // HTML dosyasını okuma işlemi
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

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

                    Web sitesi içeriği: ${htmlContent}

                    Batuhan Hakkında:
                    - Doğum: 25/09/2002, Kadıköy, İstanbul. Şu an Eryaman'da yaşıyor.
                    - Başkent Üniversitesi - Yönetim Bilişim Sistemleri (2020-2025)
                    - Fenerbahçe taraftarı, sevgilisi var

                    Deneyim:
                    - ERY Systems (2023-2024): IT Intern
                    - U2 Soft (2024-2025): Software Developer
                    - 411 Software (2025-Günümüz): Game Developer

                    Beceriler: C#, Unity, Blender, Notion, Canva, Temel Web Teknolojileri, Git & GitHub
                    Diller: Türkçe (Anadil), İngilizce (B2)

                    Kurallar:
                    - Her zaman Türkçe yanıt ver
                    - Samimi ve sıcak ol
                    - Batuhan'ın bilgilerine sadık kal`
                },
                { role: 'user', content: message }
            ]
        })
    });

    const data = await response.json();
    res.json(data.choices[0].message.content);
});

// Uygulamanızı başlatma
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
