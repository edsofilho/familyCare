// FamilyCare - Limpeza de Dados
// JavaScript para funcionalidades da aplicação

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initializeNavbar();
    initializeYear();
    initializeAnimations();
});

// ===== NAVBAR SCROLL EFFECT =====
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== FOOTER YEAR =====
function initializeYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Animar elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animateElements = document.querySelectorAll('.stat-card, .action-card, .control-card, .table-card');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===== UTILITY FUNCTIONS =====

// Mostrar alerta personalizado
function showAlert(type, message, duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '100px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1050';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    
    alertDiv.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove após duração especificada
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, duration);
}

// Obter ícone do alerta
function getAlertIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-triangle',
        'warning': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Confirmar ação com modal personalizado
function confirmAction(title, message, callback) {
    const modalHtml = `
        <div class="modal fade" id="confirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmButton">Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente se houver
    const existingModal = document.getElementById('confirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar novo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
    
    // Event listener para confirmar
    document.getElementById('confirmButton').addEventListener('click', function() {
        modal.hide();
        callback();
    });
    
    // Limpar modal quando fechado
    document.getElementById('confirmModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// ===== LOADING STATES =====

// Mostrar loading em botão
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

// ===== FORM VALIDATION =====

// Validar formulário
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// ===== TABLE UTILITIES =====

// Formatar dados da tabela
function formatTableData(data) {
    if (!data || data.length === 0) {
        return '<p class="text-muted">Nenhum dado encontrado.</p>';
    }
    
    let html = '<div class="table-responsive"><table class="table table-striped table-hover">';
    
    // Cabeçalho
    html += '<thead class="table-dark"><tr>';
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key.replace('_', ' ').toUpperCase()}</th>`;
    });
    html += '</tr></thead>';
    
    // Dados
    html += '<tbody>';
    data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(value => {
            const formattedValue = formatCellValue(value);
            html += `<td>${formattedValue}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';
    
    return html;
}

// Formatar valor da célula
function formatCellValue(value) {
    if (value === null || value === undefined) {
        return '<span class="text-muted">-</span>';
    }
    
    if (typeof value === 'boolean') {
        return value ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>';
    }
    
    if (typeof value === 'string' && value.length > 50) {
        return `<span title="${value}">${value.substring(0, 50)}...</span>`;
    }
    
    return value;
}

// ===== KEYBOARD SHORTCUTS =====

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl + R para recarregar página
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        location.reload();
    }
    
    // Escape para fechar modais
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        });
    }
});

// ===== PERFORMANCE MONITORING =====

// Monitorar performance das operações
function measurePerformance(operation, callback) {
    const startTime = performance.now();
    
    return function(...args) {
        const result = callback.apply(this, args);
        
        if (result && typeof result.then === 'function') {
            // Promise
            return result.then(data => {
                const endTime = performance.now();
                console.log(`${operation} executado em ${(endTime - startTime).toFixed(2)}ms`);
                return data;
            });
        } else {
            // Função síncrona
            const endTime = performance.now();
            console.log(`${operation} executado em ${(endTime - startTime).toFixed(2)}ms`);
            return result;
        }
    };
}

// ===== ERROR HANDLING =====

// Handler global de erros
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
    showAlert('danger', 'Ocorreu um erro inesperado. Tente novamente.');
});

// Handler para promises rejeitadas
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejeitada:', e.reason);
    showAlert('danger', 'Erro na operação. Verifique sua conexão.');
});

// ===== UTILITIES PARA CONTROLES AVANÇADOS =====

// Validar condição WHERE
function validateWhereCondition(condition) {
    if (!condition.trim()) {
        return { valid: true, message: '' };
    }
    
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE'];
    const upperCondition = condition.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
        if (upperCondition.includes(keyword)) {
            return { 
                valid: false, 
                message: `Palavra-chave perigosa detectada: ${keyword}` 
            };
        }
    }
    
    return { valid: true, message: '' };
}

// Validar query SQL
function validateSQLQuery(query) {
    if (!query.trim()) {
        return { valid: false, message: 'Query não pode estar vazia' };
    }
    
    const upperQuery = query.toUpperCase().trim();
    const allowedKeywords = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'];
    
    const startsWithAllowed = allowedKeywords.some(keyword => 
        upperQuery.startsWith(keyword)
    );
    
    if (!startsWithAllowed) {
        return { 
            valid: false, 
            message: 'Apenas queries SELECT são permitidas' 
        };
    }
    
    return { valid: true, message: '' };
}

// ===== EXPORT FUNCTIONS =====

// Exportar dados como CSV
function exportToCSV(data, filename = 'dados.csv') {
    if (!data || data.length === 0) {
        showAlert('warning', 'Nenhum dado para exportar');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showAlert('success', 'Dados exportados com sucesso!');
}

