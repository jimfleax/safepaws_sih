from app.ml.embedding.config import TrainingConfig
from app.ml.embedding.training.loss import TripletLossWithMining

class BiometricTrainer:
    """
    Scaffolding for the metric-learning training loop.
    """
    def __init__(self, config: TrainingConfig):
        self.config = config
        self.criterion = TripletLossWithMining(
            margin=config.margin, 
            strategy=config.negative_mining_strategy
        )

    def train_epoch(self):
        """
        Executes one epoch of training.
        """
        pass

    def validate(self):
        """
        Evaluates the model on the validation set.
        Important: Does NOT report raw training loss as biometric accuracy.
        Instead, reports standard verification metrics (e.g. TAR@FAR) 
        using disjoint identities.
        """
        pass
        
    def save_checkpoint(self, path: str):
        """
        Saves model weights and experiment metadata.
        """
        pass
