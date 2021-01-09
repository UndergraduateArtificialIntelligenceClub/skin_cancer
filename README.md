# Skin-Cancer Detection Program

## [Demo](https://undergraduateartificialintelligenceclub.github.io/skin_cancer/)

kaggle dataset link: https://www.kaggle.com/fanconic/skin-cancer-malignant-vs-benign

TODO:

- Look for other medical data sets, hopefully binary

- Make seperate Interactive Notebook: Ideas
	- show our tops losses, in case doctor shows
	- leaderboard
	- compares to latest papers?
	- visualizes what the model looks like
	- shows the heatmap of what the model focuses on

Model Tuning/Improvement:


- fp-16 training

- weight decay parameter increase, 0.01 - 0.01,0.2? Separate Batch norm param? a

- hotdog, not-hotdog ensemble

- what is spatial dropout?

- include all validation data for training

- try out final batchnorm layer(done, unsure)
- slice learning rates, pct-start?(done, unsure)
- iterative resizing (done)
- mess with data augmentation, warp, lighting, rotate (done)
- Get dropout in there, not sure if default (done, default 0.5)

Maybe: 

- Check latest papers, architecture, tricks, data-sets? (maybe for a sequel project)
