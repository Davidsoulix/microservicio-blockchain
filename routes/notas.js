// routes/notas.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const blockchain = require('../blockchainInstance');

// Ruta: POST /notas/registrar
router.post('/registrar', async (req, res) => {
    const { lote, id_proveedor, fecha } = req.body;

    if (!lote || !id_proveedor || !fecha) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    //const qrUrl = `http://localhost:3000/notas/lote/${lote}/vista`;
    const qrUrl = `https://sw2-par2-back-production.up.railway.app/notas/lote/${encodeURIComponent(lote)}/vista`;

    try {
        console.log('Generando QR para:', qrUrl);

        const qrImage = await QRCode.toDataURL(qrUrl);
        console.log('QR generado con éxito');

        const block = await blockchain.addBlock({ lote, id_proveedor, fecha }, qrImage);
        res.status(201).json({
            message: 'Nota registrada en blockchain',
            block,
            qrImageBase64: qrImage
        });
    } catch (error) {
        console.error('ERROR al generar QR:', error); // 👈 importante
        res.status(500).json({ error: 'Error generando QR' });
    }
});


// Ruta: GET /notas/lote/:lote/vista antiguo
/*router.get('/lote/:lote/vista', (req, res) => {
    const lote = req.params.lote;
    const history = blockchain.getLoteHistory(lote);

    if (history.length === 0) {
        return res.send(`<h2>No se encontró información del lote ${lote}</h2>`);
    }

    let html = `<h1>Historial del Lote: ${lote}</h1><ul>`;
    history.forEach(b => {
        html += `<li><b>Fecha:</b> ${new Date(b.timestamp).toLocaleString()}<br> 
        <b>Proveedor (ID):</b> ${b.data.id_proveedor}<br>
        <b>Hash:</b> ${b.hash}</li><br>
        <b>QR:</b><br><img src="${b.data.qrImageBase64}" width="150"/></li><br>`;
    });
    html += '</ul>';
    res.send(html);
});*/

// Ruta: GET /notas/lote/:lote/vista nuevo
router.get('/lote/:lote/vista', async (req, res) => {
    const lote = req.params.lote;
    try {
        const history = await blockchain.getLoteHistory(lote);

        if (!Array.isArray(history) || history.length === 0) {
            return res.send(`<h2>No se encontró información del lote ${lote}</h2><ul>`);
        }

        let html = `<h1>Historial del Lote: ${lote}</h1><ul>`;
        
        history.forEach(b => {
            const fecha = b.timestamp ? new Date(b.timestamp).toLocaleString() : 'Desconocida';
            const proveedor = b.data?.id_proveedor ?? 'N/A';
            const hash = b.hash ?? 'N/A';
            const qr = b.qrImageBase64 ?? null;

            html += `<li>
                <b>Fecha:</b> ${fecha}<br>
                <b>Proveedor (ID):</b> ${proveedor}<br>
                <b>Hash:</b> ${hash}<br>`;

            if (qr) {
                html += `<b>QR:</b><br><img src="${qr}" width="150"/><br>`;
            } else {
                html += `<b>QR:</b> No disponible<br>`;
            }

            html += `</li><br>`;
        });

        html += `</ul>`;
        res.send(html);

    } catch (error) {
        console.error('Error al obtener historial del lote:', error);
        res.status(500).send('Error interno del servidor');
    }
});



module.exports = router;
