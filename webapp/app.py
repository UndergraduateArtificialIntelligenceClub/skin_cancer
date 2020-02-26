from flask import Flask, render_template
import os
import pathlib
import json

from fastai.vision import *

app = Flask(__name__, static_folder=os.path.join(os.getcwd(), 'static'))

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/api/predict/<string:category>/<int:index>')
def ai_predict(category, index):
    learner = load_learner(Path(), 'model.pkl')

    # TODO: error handling
    path = Path()/'static/images'/category/f'{index}.jpg'
    img = open_image(path)

    pred_class,pred_idx,outputs = learner.predict(img)  

    response_json = {
        "predictions": {}
    }

    for i in range(len(outputs)):
        response_json["predictions"][learner.data.classes[i]] = float(outputs[i])

    return json.dumps(response_json)

if __name__ == "__main__":
    app.run()