-- Criar tabela para armazenar tokens de notificação push
CREATE TABLE IF NOT EXISTS push_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    userType ENUM('cuidador', 'idoso') NOT NULL,
    pushToken TEXT NOT NULL,
    platform VARCHAR(20) DEFAULT 'unknown',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_userId (userId),
    INDEX idx_userType (userType),
    INDEX idx_pushToken (pushToken(100)),
    UNIQUE KEY unique_user_token (userId, userType, pushToken(100))
);

