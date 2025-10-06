const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pieceValues = {
    p: 1, n: 3, b: 3, r: 5, q: 9, k: 0, // black pieces
    P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0, // white pieces
};

function calculateScore(board) {
    let whiteScore = 0;
    let blackScore = 0;

    for (const row of board) {
        for (const piece of row) {
            if (pieceValues.hasOwnProperty(piece)) {
                if (piece === piece.toUpperCase()) {
                    whiteScore += pieceValues[piece];
                } else if (piece === piece.toLowerCase()) {
                    blackScore += pieceValues[piece];
                }
            }
        }
    }

    let message = "equal";
    if (whiteScore > blackScore) {
        message = "white is better";
    } else if (blackScore > whiteScore) {
        message = "black is better";
    }

    return { whiteScore, blackScore, message };
}


app.post('/evaluate', (req, res) => {
    const { board } = req.body;

    if (!board || !Array.isArray(board)) {
        return res.status(400).json({ error: "(ง'̀-'́)ง Formato de tabuleiro inválido. Esperando um array de strings." });
    }

    const result = calculateScore(board);
    res.json(result);
});


app.listen(PORT, () => {
    console.log(`( ◡̀_◡́)ᕤ Servidor rodando na porta  http://localhost:${PORT}`);
});