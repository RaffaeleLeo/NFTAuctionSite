from flask import Flask, render_template

app = Flask(__name__)
# const web3 = new Web3("http://localhost:8545");


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
