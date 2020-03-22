from os import listdir
from os.path import isfile, join, basename, splitext
import pathlib
import json
import re
from fastai.vision import *


learner = load_learner(Path()/"data", "export.pkl")

images_path = Path()/"webapp/static/images"
benign_images_path = images_path/"benign"
malignant_images_path = images_path/"malignant"

benign_files = [(join(benign_images_path, f), basename(f), int(splitext(f)[0])) for f in listdir(benign_images_path) if isfile(join(benign_images_path, f))]
malignant_files = [(join(malignant_images_path, f), basename(f), int(splitext(f)[0])) for f in listdir(malignant_images_path) if isfile(join(malignant_images_path, f))]

predictions = {
    "benign": {},
    "malignant": {}
}

for path, filename, index in benign_files:
    img = open_image(path)
    pred_class, pred_idx, outputs = learner.predict(img)

    predictions["benign"][index] = {
        "predictions": {}
    }
    for i in range(len(outputs)):
        predictions["benign"][index]["predictions"][learner.data.classes[i]] = float(outputs[i])

for path, filename, index in benign_files:
    img = open_image(path)
    pred_class, pred_idx, outputs = learner.predict(img)

    predictions["malignant"][index] = {
        "predictions": {}
    }
    for i in range(len(outputs)):
        predictions["malignant"][index]["predictions"][learner.data.classes[i]] = float(outputs[i])


# print(predictions)

with open("predictions.json", "w") as f:
    f.write(json.dumps(predictions))