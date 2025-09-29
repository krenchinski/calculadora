let expressaoCompleta = ''; // Variável global para o histórico da conta

function getResultadoElement() {
    return document.getElementById('resultado');
}

function getExpressaoElement() {
    return document.getElementById('expressao');
}

function updateDisplay(newExpression) {
    // Atualiza a expressão de histórico (linha superior)
    expressaoCompleta = newExpression;
    getExpressaoElement().textContent = expressaoCompleta;
}

function insert(num) {
    let resultado = getResultadoElement();
    const currentValue = resultado.value;
    const isOperator = ['+', '-', '*', '/'].includes(num);

    // Se o display for '0' e o usuário digitar um número, substitui o '0'
    if (currentValue === '0' && !isOperator && num !== '.') {
        resultado.value = num;
        return;
    }
    
    if (isOperator) {
        // Lógica de operador: move a entrada atual para o histórico e reseta a entrada
        
        // 1. Não permite iniciar com operador (exceto sinal negativo, que precisa de mais lógica)
        if (currentValue === '0' && expressaoCompleta === '') return;

        // 2. Se o último caractere do histórico for operador, substitui
        if (['+', '-', '*', '/'].includes(expressaoCompleta.slice(-1))) {
            updateDisplay(expressaoCompleta.slice(0, -1) + num);
        } 
        
        // 3. Se houver histórico, calcula o valor parcial
        else if (expressaoCompleta !== '') {
             try {
                const valorParcial = eval(expressaoCompleta + currentValue);
                updateDisplay(valorParcial + num);
                resultado.value = '0'; // Reseta o campo de entrada
             } catch {
                resultado.value = "Erro";
             }
        }
        
        // 4. Se não houver histórico, inicia a expressão
        else {
             updateDisplay(currentValue + num);
             resultado.value = '0'; // Reseta o campo de entrada
        }
    } else {
        // Inserção de números ou ponto decimal
        resultado.value += num;
    }
}

function clean() {
    // 'C' (Clear) zera tudo
    getResultadoElement().value = "0";
    updateDisplay('');
}

function clearEntry() {
    // 'CE' zera a entrada atual, mas mantém o histórico
    getResultadoElement().value = "0";
}

function back() {
    let resultado = getResultadoElement();
    let exp = resultado.value;
    
    if (exp.length <= 1 || exp === "Erro") {
        resultado.value = "0";
    } else {
        resultado.value = exp.slice(0, -1);
    }
}

function calcular() {
    let resultado = getResultadoElement();
    
    if (expressaoCompleta === '') {
        // Se já estiver calculado, não faz nada
        return;
    }

    try {
        const expressaoFinal = expressaoCompleta + resultado.value;
        let res = eval(expressaoFinal);
        
        // Exibe o cálculo final na linha de histórico
        getExpressaoElement().textContent = expressaoFinal + " =";
        
        // Exibe o resultado na linha principal
        resultado.value = String(res);
        
        // Reseta o histórico (para começar uma nova conta)
        expressaoCompleta = ''; 

    } catch {
        resultado.value = "Erro";
        updateDisplay('');
    }
}

function percent() {
    let resultado = getResultadoElement();
    
    if (expressaoCompleta === '') {
        // Apenas um número (e.g., "50%"), calcula 0.5
        resultado.value = String(eval(resultado.value) / 100);
        return;
    }
    
    // Lógica: 100 + 5% = 100 + 5. Calcula a porcentagem do primeiro operando.
    const operador = expressaoCompleta.slice(-1);
    const expressaoBase = expressaoCompleta.slice(0, -1);
    
    try {
        const valorBase = eval(expressaoBase);
        const valorPercentual = valorBase * (eval(resultado.value) / 100);
        
        // Atualiza a linha de resultado com o valor calculado (5)
        resultado.value = String(valorPercentual);
    } catch {}
}

function invert() {
    let resultado = getResultadoElement();
    if (resultado.value && resultado.value !== "Erro" && resultado.value !== "0") {
        try {
            resultado.value = String(eval(resultado.value) * -1);
        } catch {}
    }
}

// Suporte ao teclado (funções simples de insert/call)
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if (!isNaN(key)) {
        insert(key);
    }
    if (key === "." || key === ",") {
        insert('.'); 
    }
    
    if (["+", "-", "*", "/"].includes(key)) {
        insert(key);
    }
    
    if (key === "Enter" || key === "=") {
        calcular();
        event.preventDefault(); 
    }
    
    if (key === "Backspace") {
        back();
    }
    
    if (key === "Escape") {
        clean();
    }
    
    if (key === "%") {
        percent();
    }
});