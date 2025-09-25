from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

feedbacks = []

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

    return render_templatepy('index.html', feedbacks=feedbacks)

if __name__ == '__main__':
    app.run(debug=True)