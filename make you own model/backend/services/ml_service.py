import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.ensemble import RandomForestClassifier
import pandas as pd
import numpy as np
import os
import json
from typing import Dict, Any, List

class MLService:
    @staticmethod
    def build_keras_model(config: Dict[str, Any]):
        model = models.Sequential()
        problem_type = config.get("problem_type")
        architecture = config.get("architecture", [])
        
        for layer_cfg in architecture:
            layer_type = layer_cfg.get("type")
            params = layer_cfg.get("params", {})
            
            if layer_type == "Dense":
                model.add(layers.Dense(**params))
            elif layer_type == "Conv2D":
                model.add(layers.Conv2D(**params))
            elif layer_type == "MaxPooling2D":
                model.add(layers.MaxPooling2D(**params))
            elif layer_type == "Dropout":
                model.add(layers.Dropout(**params))
            elif layer_type == "Flatten":
                model.add(layers.Flatten())
            elif layer_type == "BatchNormalization":
                model.add(layers.BatchNormalization())
            elif layer_type == "LSTM":
                model.add(layers.LSTM(**params))
            elif layer_type == "GRU":
                model.add(layers.GRU(**params))
            elif layer_type == "Embedding":
                model.add(layers.Embedding(**params))

        # Compile model
        optimizer = config.get("optimizer", "adam")
        learning_rate = config.get("learning_rate", 0.001)
        
        if optimizer == "adam":
            opt = tf.keras.optimizers.Adam(learning_rate=learning_rate)
        elif optimizer == "sgd":
            opt = tf.keras.optimizers.SGD(learning_rate=learning_rate)
        else:
            opt = "adam"

        loss = "binary_crossentropy" # Default, should be dynamic based on problem
        if problem_type == "Image Classification" or problem_type == "Text Classification":
            loss = "sparse_categorical_crossentropy"
        elif problem_type == "Tabular Prediction":
             # Need to know if it's regression or classification
             pass

        model.compile(optimizer=opt, loss=loss, metrics=["accuracy"])
        return model

    @staticmethod
    def train_tabular_sklearn(df: pd.DataFrame, target_col: str, model_type: str = "RandomForest"):
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        if model_type == "RandomForest":
            model = RandomForestClassifier()
            model.fit(X, y)
            return model
        return None

ml_service = MLService()
