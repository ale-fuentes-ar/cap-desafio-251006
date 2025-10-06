// Mapeamento dos símbolos para os caracteres Unicode das peças de xadrez
const pieceUnicode = {
    'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
    'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
};

// --- Seleção dos Elementos do DOM ---
const boardInputElement = document.getElementById('boardInput');
const evaluateBtnElement = document.getElementById('evaluateBtn');
const resultElement = document.getElementById('result');
const chessboardElement = document.getElementById('chessboard');

// --- Event Listener para o Botão ---
evaluateBtnElement.addEventListener('click', handleEvaluation);

async function handleEvaluation() {
    // 1. Obter e formatar a entrada do usuário
    const boardText = boardInputElement.value.trim();
    if (!boardText) {
        alert("Por favor, insira a representação do tabuleiro.");
        return;
    }
    const boardArray = boardText.split('\n');

    // Validação simples
    if (boardArray.length !== 8) {
        alert("A entrada deve conter exatamente 8 linhas.");
        return;
    }

    try {
        // 2. Enviar os dados para a API (Backend)
        const response = await fetch('/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ board: boardArray }),
        });

        if (!response.ok) {
            throw new Error('Erro na comunicação com o servidor.');
        }

        const data = await response.json();

        // 3. Exibir o resultado da avaliação
        resultElement.textContent = `${data.message} ${data.whiteScore} ${data.blackScore}`;

        // 4. Renderizar o tabuleiro visual
        renderChessboard(boardArray);

    } catch (error) {
        console.error('Falha na avaliação:', error);
        resultElement.textContent = 'Ocorreu um erro ao avaliar o tabuleiro.';
    }
}

function renderChessboard(board) {
    // Limpa o tabuleiro anterior
    chessboardElement.innerHTML = '';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');

            // Define a cor da casa (clara ou escura)
            const isLight = (i + j) % 2 === 0;
            square.classList.add(isLight ? 'light' : 'dark');
            
            // Pega o caractere da peça
            const pieceChar = board[i][j];

            // Se for uma peça válida, cria o elemento da peça
            if (pieceChar && pieceChar.trim() !== '' && pieceChar !== '.') {
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                
                // Adiciona a classe 'white' ou 'black'
                const isWhitePiece = pieceChar === pieceChar.toUpperCase();
                pieceElement.classList.add(isWhitePiece ? 'white' : 'black');
                
                // Define o caractere Unicode da peça
                pieceElement.textContent = pieceUnicode[pieceChar] || '';
                
                square.appendChild(pieceElement);
            }

            chessboardElement.appendChild(square);
        }
    }
}

// --- Função de Inicialização ---
// Executa quando o DOM está completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    const initialBoardState = [
        "rnbqkbnr",
        "pppppppp",
        "........",
        "........",
        "........",
        "........",
        "PPPPPPPP",
        "RNBQKBNR"
    ];
    
    // Converte o array em uma string com quebras de linha para o textarea
    const initialBoardText = initialBoardState.join('\n');
    
    // Define o valor inicial do textarea
    boardInputElement.value = initialBoardText;
    
    // Renderiza o tabuleiro inicial na tela
    renderChessboard(initialBoardState);
});