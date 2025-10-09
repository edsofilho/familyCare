from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

feedbacks = []

@app.route("/oque")
def oque():
    print(">>>> Entrou em OQUE")
    return render_template("oque.html")

@app.route("/colete")
def colete():
    print(">>>> Entrou em COLETE")
    return render_template("colete.html")

@app.route("/telas")
def telas():
    print(">>>> Entrou em TELAS")
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
    app.run(host="0.0.0.0", port=5000, debug=True)