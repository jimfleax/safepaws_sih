"""
Triplet Loss with hard and semi-hard negative mining.

Mathematical convention:
  d(a, p) = ||f(a) - f(p)||_2   (L2 distance in embedding space)
  d(a, n) = ||f(a) - f(n)||_2

  triplet_loss = max(d(a,p) - d(a,n) + margin, 0)

Mining strategies:
  semi-hard: d(a,p) < d(a,n) < d(a,p) + margin  → informative but stable
  hard:      d(a,n) < d(a,p)                       → most informative, risk of collapse

Requires torch. Import gated so the rest of the codebase imports cleanly without torch installed.
"""

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    _TORCH_AVAILABLE = True
except ImportError:
    _TORCH_AVAILABLE = False


class TripletLossWithMining:
    """
    Online triplet loss with configurable negative mining strategy.

    Usage (requires torch):
        criterion = TripletLossWithMining(margin=0.3, strategy="semi-hard")
        loss = criterion(embeddings, labels)  # embeddings: (N, D), labels: (N,)
    """

    def __init__(self, margin: float = 0.3, strategy: str = "semi-hard"):
        if strategy not in ("hard", "semi-hard", "random"):
            raise ValueError(f"Unknown mining strategy: '{strategy}'. Choose from hard/semi-hard/random.")
        self.margin = margin
        self.strategy = strategy

    def forward(self, embeddings, labels):
        """
        embeddings: torch.Tensor of shape (N, D), L2-normalized.
        labels:     torch.Tensor of shape (N,), integer identity IDs.

        Returns: scalar loss (mean over valid triplets), and count of valid triplets.
        """
        if not _TORCH_AVAILABLE:
            raise RuntimeError(
                "torch is not installed. Install torch to use TripletLossWithMining."
            )

        # Pairwise L2 distance matrix: (N, N)
        dist_matrix = self._pairwise_l2(embeddings)

        N = embeddings.size(0)
        loss_sum = torch.tensor(0.0, device=embeddings.device)
        valid_count = 0

        for i in range(N):
            anchor_label = labels[i]

            # Positive mask: same identity, not self
            pos_mask = (labels == anchor_label) & (torch.arange(N, device=embeddings.device) != i)
            # Negative mask: different identity
            neg_mask = labels != anchor_label

            if not pos_mask.any() or not neg_mask.any():
                continue

            # Take the hardest positive (maximum d(a, p))
            d_ap = dist_matrix[i][pos_mask].max()

            if self.strategy == "hard":
                # Hardest negative: minimum d(a, n)
                d_an = dist_matrix[i][neg_mask].min()
                triplet_loss = torch.clamp(d_ap - d_an + self.margin, min=0.0)
                loss_sum += triplet_loss
                valid_count += 1

            elif self.strategy == "semi-hard":
                # Semi-hard: d(a,p) < d(a,n) < d(a,p) + margin
                neg_dists = dist_matrix[i][neg_mask]
                semi_hard = neg_dists[(neg_dists > d_ap) & (neg_dists < d_ap + self.margin)]
                if semi_hard.numel() == 0:
                    # Fall back to hard negative if no semi-hard found
                    d_an = neg_dists.min()
                else:
                    d_an = semi_hard.min()
                triplet_loss = torch.clamp(d_ap - d_an + self.margin, min=0.0)
                loss_sum += triplet_loss
                valid_count += 1

            elif self.strategy == "random":
                import random
                neg_indices = neg_mask.nonzero(as_tuple=True)[0]
                chosen = neg_indices[random.randint(0, len(neg_indices) - 1)]
                d_an = dist_matrix[i, chosen]
                triplet_loss = torch.clamp(d_ap - d_an + self.margin, min=0.0)
                loss_sum += triplet_loss
                valid_count += 1

        if valid_count == 0:
            return torch.tensor(0.0, requires_grad=True), 0

        return loss_sum / valid_count, valid_count

    @staticmethod
    def _pairwise_l2(embeddings) -> "torch.Tensor":
        """
        Compute pairwise L2 distance matrix from normalized embeddings.
        ||a - b||^2 = 2 - 2*(a·b)  (for unit vectors)
        """
        dot = torch.mm(embeddings, embeddings.t())
        dist_sq = 2.0 - 2.0 * dot
        # Clamp to avoid negative values due to floating point
        dist = torch.clamp(dist_sq, min=0.0).sqrt()
        return dist
