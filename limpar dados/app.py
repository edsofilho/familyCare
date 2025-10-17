from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime
import json

app = Flask(__name__)
app.secret_key = 'familycare_secret_key_2024'

# Configuração do banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # Ajuste conforme necessário
    'database': 'familycare',
    'charset': 'utf8mb4'
}

def get_db_connection():
    """Estabelece conexão com o banco de dados"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Erro ao conectar com o banco: {e}")
        return None

def execute_query(query, params=None, fetch=False):
    """Executa uma query no banco de dados"""
    connection = get_db_connection()
    if not connection:
        return None
    
    try:
        cursor = connection.cursor()
        cursor.execute(query, params)
        
        if fetch:
            result = cursor.fetchall()
        else:
            connection.commit()
            result = cursor.rowcount
        
        return result
    except Error as e:
        print(f"Erro ao executar query: {e}")
        return None
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def get_table_count(table_name):
    """Retorna o número de registros em uma tabela"""
    result = execute_query(f"SELECT COUNT(*) FROM {table_name}", fetch=True)
    return result[0][0] if result else 0

def reset_database_with_fake_data():
    """Reseta o banco e adiciona dados fake"""
    try:
        # Ler o arquivo SQL
        sql_file_path = os.path.join(os.path.dirname(__file__), '..', 'BD', 'bd_familyCare.sql')
        
        with open(sql_file_path, 'r', encoding='utf-8') as file:
            sql_content = file.read()
        
        # Executar o script SQL
        connection = get_db_connection()
        if not connection:
            return False
        
        cursor = connection.cursor()
        
        # Executar cada comando SQL separadamente
        for statement in sql_content.split(';'):
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                except Error as e:
                    print(f"Erro ao executar: {statement[:50]}... - {e}")
                    continue
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return True
    except Exception as e:
        print(f"Erro ao resetar banco: {e}")
        return False

@app.route('/')
def index():
    """Página principal"""
    # Obter estatísticas do banco
    stats = {
        'usuarios': get_table_count('usuarios'),
        'idosos': get_table_count('idosos'),
        'familias': get_table_count('familias'),
        'alertas': get_table_count('alertas'),
        'recados': get_table_count('recados'),
        'remedios': get_table_count('remedios'),
        'dispositivos': get_table_count('dispositivos'),
        'solicitacoes': get_table_count('solicitacoes_familia')
    }
    
    return render_template('index.html', stats=stats)

@app.route('/limpar_alertas', methods=['POST'])
def limpar_alertas():
    """Limpa todos os alertas"""
    try:
        # Limpar respostas dos alertas primeiro (devido à foreign key)
        execute_query("DELETE FROM alertas_respostas")
        # Limpar alertas
        result = execute_query("DELETE FROM alertas")
        
        if result is not None:
            flash(f'✅ {result} alertas removidos com sucesso!', 'success')
        else:
            flash('❌ Erro ao limpar alertas', 'error')
    except Exception as e:
        flash(f'❌ Erro: {str(e)}', 'error')
    
    return redirect(url_for('index'))

@app.route('/limpar_recados', methods=['POST'])
def limpar_recados():
    """Limpa todos os recados"""
    try:
        result = execute_query("DELETE FROM recados")
        
        if result is not None:
            flash(f'✅ {result} recados removidos com sucesso!', 'success')
        else:
            flash('❌ Erro ao limpar recados', 'error')
    except Exception as e:
        flash(f'❌ Erro: {str(e)}', 'error')
    
    return redirect(url_for('index'))

@app.route('/reset_padrao', methods=['POST'])
def reset_padrao():
    """Reseta o banco para dados padrão (sem alertas e recados)"""
    try:
        # Limpar dados específicos
        execute_query("DELETE FROM alertas_respostas")
        execute_query("DELETE FROM alertas")
        execute_query("DELETE FROM recados")
        execute_query("DELETE FROM solicitacoes_familia")
        
        # Manter usuários, idosos, famílias, remédios, etc.
        flash('✅ Banco resetado para dados padrão (alertas e recados removidos)!', 'success')
    except Exception as e:
        flash(f'❌ Erro: {str(e)}', 'error')
    
    return redirect(url_for('index'))

@app.route('/reset_completo', methods=['POST'])
def reset_completo():
    """Reseta completamente o banco e adiciona dados fake"""
    try:
        if reset_database_with_fake_data():
            flash('✅ Banco resetado completamente com dados fake!', 'success')
        else:
            flash('❌ Erro ao resetar banco', 'error')
    except Exception as e:
        flash(f'❌ Erro: {str(e)}', 'error')
    
    return redirect(url_for('index'))

# ===== SEÇÃO SECUNDÁRIA - CONTROLES AVANÇADOS =====

@app.route('/controles_avancados')
def controles_avancados():
    """Página de controles avançados do banco"""
    # Obter estatísticas detalhadas
    stats = {}
    tables = [
        'usuarios', 'idosos', 'familias', 'alertas', 'recados', 
        'remedios', 'dispositivos', 'solicitacoes_familia',
        'condicoes_medicas', 'idosos_condicoes', 'alertas_respostas',
        'usuarios_familias', 'familias_idosos'
    ]
    
    for table in tables:
        try:
            stats[table] = get_table_count(table)
        except:
            stats[table] = 0
    
    return render_template('controles_avancados.html', stats=stats)

@app.route('/limpar_tabela', methods=['POST'])
def limpar_tabela():
    """Limpa uma tabela específica"""
    data = request.get_json()
    table_name = data.get('table')
    where_condition = data.get('where', '')
    
    try:
        if where_condition:
            # Verificar se a condição WHERE é segura (básico)
            if any(keyword in where_condition.upper() for keyword in ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE']):
                return jsonify({'success': False, 'message': 'Condição WHERE inválida'})
            
            query = f"DELETE FROM {table_name} WHERE {where_condition}"
        else:
            query = f"DELETE FROM {table_name}"
        
        result = execute_query(query)
        
        if result is not None:
            return jsonify({
                'success': True, 
                'message': f'{result} registros removidos da tabela {table_name}',
                'count': result
            })
        else:
            return jsonify({'success': False, 'message': 'Erro ao executar query'})
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'})

@app.route('/recriar_banco', methods=['POST'])
def recriar_banco():
    """Recria o banco de dados"""
    try:
        # Conectar sem especificar database
        config_no_db = DB_CONFIG.copy()
        del config_no_db['database']
        
        connection = mysql.connector.connect(**config_no_db)
        cursor = connection.cursor()
        
        # Dropar e recriar o banco
        cursor.execute("DROP DATABASE IF EXISTS familycare")
        cursor.execute("CREATE DATABASE familycare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        # Recriar tabelas e dados
        if reset_database_with_fake_data():
            return jsonify({'success': True, 'message': 'Banco recriado com sucesso!'})
        else:
            return jsonify({'success': False, 'message': 'Erro ao recriar tabelas'})
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'})

@app.route('/dropar_banco', methods=['POST'])
def dropar_banco():
    """Remove o banco de dados"""
    try:
        # Conectar sem especificar database
        config_no_db = DB_CONFIG.copy()
        del config_no_db['database']
        
        connection = mysql.connector.connect(**config_no_db)
        cursor = connection.cursor()
        
        cursor.execute("DROP DATABASE IF EXISTS familycare")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'success': True, 'message': 'Banco removido com sucesso!'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'})

@app.route('/criar_banco', methods=['POST'])
def criar_banco():
    """Cria o banco de dados"""
    try:
        # Conectar sem especificar database
        config_no_db = DB_CONFIG.copy()
        del config_no_db['database']
        
        connection = mysql.connector.connect(**config_no_db)
        cursor = connection.cursor()
        
        cursor.execute("CREATE DATABASE IF NOT EXISTS familycare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'success': True, 'message': 'Banco criado com sucesso!'})
        
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'})

@app.route('/executar_sql', methods=['POST'])
def executar_sql():
    """Executa SQL customizado"""
    data = request.get_json()
    sql = data.get('sql', '')
    
    try:
        # Verificar se é uma query segura (básico)
        sql_upper = sql.upper().strip()
        if not sql_upper.startswith(('SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN')):
            return jsonify({'success': False, 'message': 'Apenas queries SELECT são permitidas'})
        
        result = execute_query(sql, fetch=True)
        
        if result is not None:
            return jsonify({
                'success': True, 
                'data': result,
                'count': len(result)
            })
        else:
            return jsonify({'success': False, 'message': 'Erro ao executar query'})
            
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro: {str(e)}'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
