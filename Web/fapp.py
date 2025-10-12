from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

feedbacks = []

@app.route("/oque")
def oque():
    return render_template("oque.html")

@app.route("/colete")
def colete():
    return render_template("colete.html")

@app.route("/telas")
def telas():
    return render_template("telas.html")

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        assunto = request.form['assunto']
        mensagem = request.form['mensagem']

        feedbacks.append({
            'nome': nome,
            'email': email,
            'assunto': assunto,
            'mensagem': mensagem
        })

        return redirect(url_for('index'))

    return render_template('index.html', feedbacks=feedbacks)

if __name__ == '__main__':
    import sys
    import os
    
    # Configuração para evitar problemas de pipe no Windows
    if sys.platform.startswith('win'):
        import msvcrt
        msvcrt.setmode(sys.stdout.fileno(), os.O_BINARY)
        msvcrt.setmode(sys.stderr.fileno(), os.O_BINARY)
    
    app.run(host="127.0.0.1", port=5000, debug=True)