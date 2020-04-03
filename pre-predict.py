from os import listdir
from os.path import isfile, join, basename, splitext
import pathlib
import json
import re
from fastai.vision import *


learner = load_learner(Path()/"data", "export.pkl").to_fp16()

images_path = Path()/"webapp/static/images"
benign_images_path = images_path/"benign"
malignant_images_path = images_path/"malignant"

benign_files = [(join(benign_images_path, f), basename(f), int(splitext(f)[0])) for f in listdir(benign_images_path) if isfile(join(benign_images_path, f))]
malignant_files = [(join(malignant_images_path, f), basename(f), int(splitext(f)[0])) for f in listdir(malignant_images_path) if isfile(join(malignant_images_path, f))]

predictions = {
    "benign": {},
    "malignant": {}
}

benign_correct = 0
benign_incorrect = 0
benign_total = 0

malignant_correct = 0
malignant_incorrect = 0
malignant_total = 0

for path, filename, index in benign_files:
    img = open_image(path)
    pred_class, pred_idx, outputs = learner.predict(img)

    benign_total += 1
    if str(pred_class) == "benign":
        benign_correct += 1
    else:
        benign_incorrect += 1

    predictions["benign"][index] = {
        "predictions": {}
    }
    for i in range(len(outputs)):
        predictions["benign"][index]["predictions"][learner.data.classes[i]] = float(outputs[i])

print(f"Benign correct:   {benign_correct}/{benign_total} ({100 * benign_correct / benign_total}%)")
print(f"Benign incorrect: {benign_incorrect}/{benign_total} ({100 * benign_incorrect / benign_total}%)")

for path, filename, index in malignant_files:
    img = open_image(path)
    pred_class, pred_idx, outputs = learner.predict(img)

    malignant_total += 1
    if str(pred_class) == "malignant":
        malignant_correct += 1
    else:
        malignant_incorrect += 1

    predictions["malignant"][index] = {
        "predictions": {}
    }
    for i in range(len(outputs)):
        predictions["malignant"][index]["predictions"][learner.data.classes[i]] = float(outputs[i])

print(f"Malignant correct:   {malignant_correct}/{malignant_total} ({100 * malignant_correct / malignant_total}%)")
print(f"Malignant incorrect: {malignant_incorrect}/{malignant_total} ({100 * malignant_incorrect / malignant_total}%)")

print(f"Total correct:   {benign_correct + malignant_correct}/{benign_total + malignant_total} ({100 * (benign_correct + malignant_correct) / (benign_total + malignant_total)}%)")
print(f"Total incorrect: {benign_incorrect + malignant_incorrect}/{benign_total + malignant_total} ({100 * (benign_incorrect + malignant_incorrect) / (benign_total + malignant_total)}%)")

with open("predictions.json", "w") as f:
    f.write(json.dumps(predictions))