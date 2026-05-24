/** Additional glossary entries merged into each section at build time. */
export type GlossTuple = [string, string, string?];

export const AI_TERM_EXPANSIONS: Record<string, GlossTuple[]> = {
  "big-picture": [
    [
      "Symbolic AI",
      "Rule- and logic-based systems where knowledge is encoded explicitly rather than learned entirely from data.",
      "Early expert systems; still appears in hybrid pipelines with ML components.",
    ],
    [
      "Connectionism",
      "The view that intelligence emerges from networks of simple units—precursor framing for neural nets.",
    ],
    [
      "Hybrid AI",
      "Combines learned models with rules, retrieval, or solvers—for example RAG plus business logic in Python.",
    ],
    [
      "AI winter",
      "Periods of reduced funding and hype after disappointing progress; useful historical context, not a technical spec.",
    ],
    [
      "Compute scaling laws",
      "Empirical trends linking model size, data, and compute to capability gains—guides training budgets.",
    ],
    [
      "Data-centric AI",
      "Improving datasets, labels, and pipelines rather than only swapping model architectures.",
    ],
    [
      "Foundation model ecosystem",
      "Open-weight hubs (Hugging Face), API providers, and local runners (llama.cpp, vLLM) Python teams integrate.",
    ],
    [
      "Multimodal AI",
      "Systems consuming more than one modality (text + image + audio) in a single model or orchestrated stack.",
    ],
    [
      "On-device AI",
      "Running smaller quantized models locally for latency, privacy, or offline use.",
    ],
    [
      "Responsible AI",
      "Practices covering fairness, transparency, safety, and governance across the ML lifecycle.",
    ],
  ],
  "python-ecosystem": [
    [
      "pandas",
      "Tabular data manipulation—joins, groupby, missing-value handling before X/y extraction.",
    ],
    [
      "NumPy",
      "N-dimensional arrays and vectorized ufuncs underlying most numeric ML code.",
    ],
    [
      "scikit-learn",
      "Classic ML estimators, preprocessing, model selection, and metrics with a consistent API.",
    ],
    [
      "PyTorch",
      "Dynamic-graph deep learning framework dominant in research and many production fine-tunes.",
    ],
    [
      "TensorFlow / Keras",
      "Graph and high-level Keras APIs; still common in TF Serving and some enterprise stacks.",
    ],
    [
      "Hugging Face Transformers",
      "transformers library for pretrained models, tokenizers, and training helpers.",
    ],
    [
      "Hugging Face Hub",
      "Model/dataset hosting with huggingface_hub download and upload from Python scripts.",
    ],
    [
      "polars",
      "Fast DataFrame engine often used for large ETL before training pipelines.",
    ],
    ["DuckDB", "In-process analytics SQL over Parquet/CSV—handy in notebook ETL."],
    [
      "Poetry / uv",
      "Modern dependency managers alternative to plain pip + requirements.txt.",
    ],
    [
      "Ruff / Black / mypy",
      "Linting, formatting, and static typing common in ML repos alongside notebooks.",
    ],
    [
      "CUDA / ROCm",
      "GPU runtimes; PyTorch wheels target specific CUDA versions—match driver and wheel.",
    ],
    [
      "Weights & Biases / MLflow",
      "Experiment tracking SDKs logging metrics, configs, and artifacts from training scripts.",
    ],
    [
      "Ray",
      "Distributed Python for scaling data prep, tuning, and serving (Ray Train, Ray Serve).",
    ],
    [
      "LangChain / LangGraph",
      "Orchestration libraries for LLM apps, tools, and agent graphs—often paired with Python backends.",
    ],
    [
      "OpenAI / Anthropic Python SDKs",
      "Official clients for chat, embeddings, and tool APIs with typed request helpers.",
    ],
  ],
  "data-terms": [
    ["Label", "Supervised target attached to each example—class name, score, or span."],
    [
      "Ground truth",
      "Trusted reference labels used for training and evaluation (may still contain noise).",
    ],
    [
      "Class imbalance",
      "Rare labels dominate metrics unless you rebalance, reweight, or choose better scores.",
    ],
    [
      "Missing values",
      "Gaps handled via imputation, dropna, or model-native missing indicators in pandas/sklearn.",
    ],
    [
      "Outlier",
      "Extreme points that skew scaling or loss—detect with IQR, z-scores, or domain rules.",
    ],
    [
      "Data leakage",
      "Future or label information accidentally in features—destroys valid test scores.",
    ],
    [
      "Feature scaling",
      "Standardization or min–max scaling so optimizers and distance metrics behave well.",
    ],
    [
      "One-hot encoding",
      "Expand categoricals into binary columns—pd.get_dummies or OneHotEncoder.",
    ],
    [
      "Target encoding",
      "Replace categories with aggregated statistics—watch leakage; use cross-fitting.",
    ],
    [
      "Time-based split",
      "Train on past, test on future—required for forecasting and many production logs.",
    ],
    [
      "Stratified split",
      "Preserve label proportions in each fold—train_test_split(..., stratify=y).",
    ],
    [
      "Parquet / Arrow",
      "Columnar formats for efficient storage and zero-copy-ish reads into pandas/polars.",
    ],
    [
      "Data catalog / lineage",
      "Metadata tracking who created datasets, schema versions, and downstream consumers.",
    ],
    [
      "Synthetic data",
      "Generated examples augmenting scarce labels—validate it does not distort real distribution.",
    ],
    [
      "PII",
      "Personally identifiable information requiring scrubbing before training or logging.",
    ],
  ],
  "ml-basics": [
    [
      "Hypothesis space",
      "The family of functions your model can represent—trees vs linear vs deep nets differ wildly.",
    ],
    [
      "Empirical risk",
      "Average loss on observed training data—the quantity optimizers minimize directly.",
    ],
    [
      "Generalization gap",
      "Difference between training performance and performance on new data.",
    ],
    [
      "Capacity",
      "How complex a model is—too much capacity invites overfitting without enough data.",
    ],
    [
      "L1 / L2 regularization",
      "Add |w| or w² penalties—sparse vs smooth weight shrinkage in linear models.",
    ],
    [
      "Early stopping",
      "Halt training when validation loss stops improving—cheap regularization for neural nets.",
    ],
    [
      "Hyperparameter",
      "Settings not learned from data (learning rate, tree depth)—tuned via search or heuristics.",
    ],
    [
      "Grid search / random search",
      "GridSearchCV and RandomizedSearchCV automate hyperparameter trials.",
    ],
    [
      "Pipeline (sklearn)",
      "Chain preprocessors + model so fit/predict never leaks test statistics.",
    ],
    ["Estimator", "sklearn object implementing fit, predict, and often transform."],
    [
      "Classifier vs regressor",
      "API variants for discrete vs continuous targets—check is_classifier helpers.",
    ],
    [
      "Calibration",
      "Predicted probabilities match observed frequencies—CalibratedClassifierCV helps.",
    ],
    [
      "Ensemble learning",
      "Combine multiple models (bagging, boosting, stacking) for robustness.",
    ],
    [
      "k-nearest neighbors (k-NN)",
      "Lazy learner comparing distances in feature space—sensitive to scaling.",
    ],
    [
      "Naive Bayes",
      "Fast probabilistic classifier assuming feature independence—strong text baseline.",
    ],
  ],
  supervised: [
    [
      "Multilabel classification",
      "Each example may have several labels simultaneously—sigmoid per label or specialized losses.",
    ],
    [
      "Imbalanced classification",
      "Techniques: class weights, oversampling (SMOTE), different thresholds, PR-AUC focus.",
    ],
    [
      "Threshold tuning",
      "Move decision boundary on probability scores to trade precision vs recall.",
    ],
    [
      "Confusion matrix (multiclass)",
      "Extends to N×N counts—inspect which classes confuse each other.",
    ],
    [
      "Ordinal regression",
      "Labels have order (ratings)—use appropriate losses, not plain one-hot.",
    ],
    [
      "Ranking",
      "Order items by relevance—learning-to-rank metrics differ from classification.",
    ],
    [
      "Cost-sensitive learning",
      "Weight errors by business cost—custom sample_weight in sklearn fits.",
    ],
    [
      "Calibration curve",
      "Reliability diagram comparing predicted vs observed positive rates.",
    ],
    ["ROC curve", "TPR vs FPR across thresholds—useful when class balance varies."],
    ["PR curve", "Precision vs recall—often more informative on imbalanced data."],
    [
      "Linear regression",
      "Predict continuous targets with weighted sum of features—baseline for tabular.",
    ],
    [
      "Ridge / Lasso / Elastic Net",
      "Regularized linear models via Ridge, Lasso, ElasticNet in sklearn.",
    ],
    [
      "Gradient boosting (XGBoost / LightGBM / CatBoost)",
      "High-performance tree ensembles common in tabular competitions and prod.",
    ],
    [
      "CatBoost / LightGBM categorical handling",
      "Native support for high-cardinality categoricals without manual encoding.",
    ],
  ],
  unsupervised: [
    [
      "k-means",
      "Partition into k clusters by minimizing within-cluster variance—scale features first.",
    ],
    [
      "Hierarchical clustering",
      "Dendrogram merges/splits—scipy.cluster.hierarchy or sklearn wrappers.",
    ],
    ["DBSCAN", "Density-based clusters plus noise points—no fixed k required."],
    [
      "Gaussian mixture model (GMM)",
      "Soft cluster assignments via mixture of Gaussians—GaussianMixture in sklearn.",
    ],
    [
      "Autoencoder",
      "Neural net compressing inputs to bottleneck then reconstructing—anomaly and dim reduction.",
    ],
    [
      "Self-supervised learning",
      "Pretext tasks create labels from data itself—foundation for many modern encoders.",
    ],
    [
      "Contrastive learning",
      "Pull similar pairs together, push dissimilar apart—SimCLR-style representation learning.",
    ],
    [
      "Silhouette score",
      "Cluster quality heuristic—compare to domain validation, not alone.",
    ],
    ["Elbow method", "Heuristic for choosing k in k-means by plotting inertia vs k."],
    ["Isolation Forest", "Tree-based anomaly detector—sklearn.ensemble.IsolationForest."],
    [
      "Association rules",
      "Market-basket style frequent itemsets—Apriori-style analytics.",
    ],
  ],
  training: [
    [
      "Stochastic gradient descent (SGD)",
      "Minibatch noisy gradients—default workhorse with momentum variants.",
    ],
    [
      "Adam / AdamW",
      "Adaptive per-parameter learning rates—AdamW decouples weight decay correctly for transformers.",
    ],
    [
      "Learning rate schedule",
      "Warmup, cosine decay, step decay—torch.optim.lr_scheduler modules.",
    ],
    [
      "Weight decay",
      "L2-style penalty on weights—distinct from Adam’s adaptive terms in AdamW.",
    ],
    [
      "DataLoader",
      "PyTorch iterable batching with num_workers, pin_memory, custom collate_fn.",
    ],
    [
      "Checkpoint",
      "Save state_dict and optimizer state to resume training or deploy best validation epoch.",
    ],
    [
      "Teacher forcing",
      "Feed ground-truth previous tokens during seq2seq training—reduces exposure bias at inference.",
    ],
    [
      "Curriculum learning",
      "Order examples from easy to hard to stabilize early training.",
    ],
    [
      "Distributed data parallel (DDP)",
      "torch.nn.parallel.DistributedDataParallel for multi-GPU single-node or multi-node.",
    ],
    [
      "Gradient accumulation",
      "Sum gradients over micro-batches when memory limits physical batch size.",
    ],
    [
      "Loss scaling (AMP)",
      "Multiply loss before backward when using automatic mixed precision to avoid underflow.",
    ],
    [
      "Label smoothing",
      "Soften one-hot targets to reduce overconfidence—common in classification fine-tunes.",
    ],
    ["Class weights", "Pass weight to CrossEntropyLoss to upweight rare classes."],
  ],
  evaluation: [
    [
      "Baseline model",
      "Simple reference (majority class, mean predictor) every new model must beat.",
    ],
    [
      "Holdout test set",
      "Touch once for final reporting—repeated peeking becomes validation, not test.",
    ],
    [
      "k-fold cross-validation",
      "cross_val_score rotates folds for stabler metric estimates on small data.",
    ],
    ["Stratified k-fold", "Preserves class ratios per fold—default for classification."],
    [
      "Matthews correlation coefficient (MCC)",
      "Balanced single metric for binary classification under imbalance.",
    ],
    ["Log loss", "Penalizes confident wrong probabilities—log_loss in sklearn."],
    ["MAE / RMSE", "Regression errors—mean_absolute_error, mean_squared_error."],
    ["R² score", "Explained variance fraction—can mislead on nonlinear problems."],
    [
      "Calibration (Brier score)",
      "Measures probability accuracy—not just ranking quality.",
    ],
    [
      "Confusion matrix normalization",
      "Row-normalize to see per-class error rates clearly.",
    ],
    [
      "Statistical significance",
      "Ask whether metric deltas exceed noise—bootstrap or paired tests on folds.",
    ],
    [
      "Offline vs online metrics",
      "Holdout scores vs production KPIs (click-through, resolution time)—align both.",
    ],
  ],
  "deep-learning": [
    [
      "Neural network",
      "A network of layers that transforms inputs step by step into predictions or embeddings.",
      "Built by stacking torch.nn.Module layers; depth means more than one hidden layer.",
    ],
    [
      "Perceptron / MLP",
      "Fully connected stacks—torch.nn.Linear layers for tabular and simple baselines.",
    ],
    [
      "Loss functions (deep learning)",
      "Cross-entropy, MSE, triplet, contrastive—match head output activation.",
    ],
    [
      "Softmax",
      "Normalize logits to class probabilities—paired with CrossEntropyLoss in PyTorch.",
    ],
    [
      "Layer normalization",
      "Normalize activations per token/feature—common in transformers vs batch norm in CNNs.",
    ],
    [
      "Attention mechanism",
      "Weighted aggregation of values keyed by query–key compatibility scores.",
    ],
    [
      "Multi-head attention",
      "Parallel attention subspaces concatenated—nn.MultiheadAttention building block.",
    ],
    [
      "Positional encoding",
      "Inject order into transformers—sinusoidal, learned, or RoPE variants.",
    ],
    [
      "Transfer learning",
      "Start from pretrained weights, replace head, fine-tune on your task.",
    ],
    ["Fine-tune head only", "Freeze backbone, train classifier—fast when data is small."],
    ["torch.nn.Module", "Base class implementing forward; compose layers in __init__."],
    [
      "Autograd",
      "PyTorch records ops for backward()—disable with torch.no_grad() at inference.",
    ],
    [
      "Device placement",
      "model.to('cuda') and tensors on same device—common source of runtime errors.",
    ],
    ["torch.compile", "PyTorch 2 graph compilation for speedups when shapes stable."],
  ],
  nlp: [
    [
      "Bag-of-words",
      "Count or TF-IDF vectors ignoring order—CountVectorizer, TfidfVectorizer.",
    ],
    ["TF-IDF", "Downweight common tokens, upweight distinctive terms in a corpus."],
    [
      "Word embedding (Word2Vec / GloVe)",
      "Static dense word vectors—largely superseded by contextual transformers.",
    ],
    [
      "Subword tokenization",
      "Split rare words into pieces so open vocabulary is manageable.",
    ],
    ["Vocabulary", "Mapping token strings to integer IDs used by embedding layers."],
    ["Padding / truncation", "Batch sequences to fixed max_length in tokenizer calls."],
    ["Attention mask", "Binary mask telling the model which tokens are real vs pad."],
    ["Sentiment analysis", "Classify opinion polarity—classic supervised NLP task."],
    ["Text classification", "Assign whole documents to categories—spam, intent, topic."],
    [
      "Summarization",
      "Abstractive or extractive shortening—seq2seq or prompt-based with LLMs.",
    ],
    [
      "Machine translation",
      "Map sentences across languages—encoder–decoder or LLM prompting.",
    ],
    [
      "Question answering",
      "Extract or generate answers given context passages—SQuAD-style metrics.",
    ],
    [
      "BLEU / ROUGE",
      "N-gram overlap metrics for generation quality—imperfect but widespread.",
    ],
    [
      "spaCy / NLTK",
      "Classic Python NLP libraries for tokenization, NER pipelines, corpora.",
    ],
  ],
  llm: [
    [
      "Large language model (LLM)",
      "Transformer-scale causal LMs trained on broad text—GPT, Llama, Mistral families.",
    ],
    [
      "KV cache",
      "Store key/value tensors during autoregressive decode to avoid recomputing prefixes.",
    ],
    [
      "RoPE (rotary positional embeddings)",
      "Relative position encoding widely used in open LLMs.",
    ],
    [
      "Grouped-query attention (GQA)",
      "Share KV heads across queries—memory savings at inference.",
    ],
    [
      "Flash Attention",
      "IO-aware attention kernel reducing memory and speeding training/inference.",
    ],
    [
      "Model parallelism",
      "Shard layers across GPUs when one device cannot hold weights.",
    ],
    [
      "Tensor parallelism",
      "Split individual large matrices across devices—common in huge model serving.",
    ],
    [
      "Mixture of experts (MoE)",
      "Sparse activation of expert subnetworks per token—scales parameters not FLOPs linearly.",
    ],
    [
      "Open-weight model",
      "Weights downloadable for local inference or fine-tune—read license carefully.",
    ],
    [
      "Closed API model",
      "Hosted endpoint only—simpler ops, less control, ongoing per-token cost.",
    ],
    [
      "Completion vs chat API",
      "Raw text continuation vs role-structured messages—chat is standard for assistants.",
    ],
    ["Stop sequences", "Strings that halt generation—prevent run-on outputs in APIs."],
    ["Logprobs", "Token log probabilities returned for uncertainty UI or evaluators."],
    [
      "Reasoning model",
      "Models trained for longer internal chains (o-series style)—higher latency/cost.",
    ],
  ],
  "prompt-engineering": [
    [
      "Role prompting",
      "Assign assistant/user/system personas to steer tone and expertise.",
    ],
    [
      "Instruction following",
      "Model compliance with explicit constraints—evaluated with instruction benchmarks.",
    ],
    [
      "JSON mode / structured output",
      "Constrain responses to parseable schemas—response_format or tool schemas in APIs.",
    ],
    [
      "Prompt injection defense",
      "Separate trusted system text from untrusted user/docs; sanitize retrieved chunks.",
    ],
    [
      "Prompt versioning",
      "Store prompts in git with tags—diff behavior when models update underneath.",
    ],
    [
      "Self-consistency",
      "Sample multiple reasoning paths and vote on final answer—reduces variance.",
    ],
    [
      "Tree-of-thought",
      "Branch exploration of reasoning states before committing to an answer.",
    ],
    [
      "Rephrase / expand prompt",
      "Automatically elaborate user queries before main call—watch cost.",
    ],
    [
      "Negative prompting",
      "Tell the model what to avoid—works better in some image APIs than chat.",
    ],
    [
      "Context stuffing",
      "Fill the window with docs—watch truncation and lost-middle effects.",
    ],
    [
      "Lost in the middle",
      "Models may under-use information placed mid-context—put key facts at ends.",
    ],
    [
      "Jinja2 prompt templates",
      "Server-side templating for dynamic prompts in Python web apps.",
    ],
  ],
  embeddings: [
    ["Dense retrieval", "Search by vector similarity instead of keyword match alone."],
    [
      "Sparse retrieval (BM25)",
      "Lexical scoring—rank_bm25 or Elasticsearch-style indexes.",
    ],
    [
      "Embedding model",
      "Neural encoder producing fixed-size vectors—text-embedding-3-small, sentence-transformers.",
    ],
    [
      "Cosine similarity",
      "Normalize vectors and dot product—standard in semantic search.",
    ],
    ["FAISS", "Facebook AI Similarity Search—popular ANN library from Python bindings."],
    [
      "HNSW index",
      "Graph-based ANN offering strong speed/recall tradeoffs in vector DBs.",
    ],
    [
      "Chroma / Pinecone / Weaviate / Qdrant",
      "Managed or embeddable vector stores with metadata filters.",
    ],
    [
      "Metadata filtering",
      "Restrict ANN search to subsets (tenant, date, doc type) before similarity.",
    ],
    [
      "Embedding dimension",
      "Vector length—higher not always better; match index and model.",
    ],
    [
      "Matryoshka embeddings",
      "Truncatable dimensions for flexible storage/recall tradeoffs.",
    ],
    [
      "ColBERT / late interaction",
      "Token-level matching for higher-quality retrieval at more compute.",
    ],
    [
      "Semantic cache",
      "Reuse prior answers when new queries embed near cached questions.",
    ],
  ],
  rag: [
    [
      "Ingestion pipeline",
      "Load PDFs, HTML, tickets; extract text; dedupe; version corpora.",
    ],
    ["Document loader", "LangChain/LlamaIndex loaders wrapping files, Notion, S3, etc."],
    [
      "Overlap chunking",
      "Sliding windows with shared sentences so boundaries do not cut facts.",
    ],
    [
      "Parent–child chunking",
      "Retrieve small chunks, return larger parent context to the LLM.",
    ],
    ["Query rewriting", "LLM expands or decomposes user query before retrieval."],
    [
      "HyDE",
      "Hypothetical document embeddings—generate fake answer, embed it, retrieve.",
    ],
    [
      "Context window budget",
      "Allocate tokens among system, history, chunks, and completion reserve.",
    ],
    ["Attribution", "Surface source filenames/page numbers with generated answers."],
    [
      "Faithfulness eval",
      "NLI or LLM-judge checks if answer is supported by retrieved text.",
    ],
    [
      "Answer abstention",
      "Model refuses when retrieval confidence is low—reduces fabrication.",
    ],
    ["LlamaIndex", "Python framework for indexing, querying, and agentic RAG workflows."],
    ["GraphRAG", "Combine knowledge graphs with retrieval for structured domain Q&A."],
  ],
  agents: [
    [
      "Tool schema (JSON Schema)",
      "Machine-readable argument types the host validates before execution.",
    ],
    [
      "Parallel tool calls",
      "Model requests multiple tools in one turn—execute concurrently in Python asyncio.",
    ],
    [
      "Streaming agent output",
      "Yield partial tokens and tool events over SSE/WebSockets for responsive UX.",
    ],
    [
      "Checkpointing (LangGraph)",
      "Persist graph state to resume long workflows after crashes.",
    ],
    ["Interrupt / resume", "Pause agent for human input then continue from saved state."],
    ["Sub-agent", "Nested agent invoked as a tool by a parent orchestrator."],
    ["Computer use", "Agents driving GUI/browser automation—high risk; sandbox heavily."],
    [
      "Code interpreter tool",
      "Ephemeral Python sandbox executing model-written code on sample data.",
    ],
    [
      "Retrieval tool",
      "Wraps vector search as a callable the model chooses when it needs facts.",
    ],
    [
      "MCP tool bridge",
      "Expose MCP server tools to an agent runtime inside your Python host.",
    ],
    [
      "Token budget per step",
      "Cap context growth by summarizing or pruning old tool outputs.",
    ],
    [
      "Deterministic tool routing",
      "Code paths that bypass the model for regulated actions (payments, deletes).",
    ],
  ],
  mcp: [
    [
      "MCP client",
      "Side that consumes tools/resources from servers—embedded in IDE or agent host.",
    ],
    [
      "stdio transport",
      "Local subprocess JSON-RPC over stdin/stdout—common for desktop integrations.",
    ],
    ["SSE / HTTP transport", "Remote MCP servers reachable over network with auth."],
    [
      "Resource (MCP)",
      "Readable URI-backed data (file tree, schema) models can fetch for context.",
    ],
    [
      "Prompt template (MCP)",
      "Server-supplied reusable prompt patterns registered for clients.",
    ],
    [
      "Capability negotiation",
      "Client and server agree on supported tool/resource features at connect time.",
    ],
    ["Roots", "Filesystem boundaries an MCP file server may expose—security critical."],
    [
      "Sampling (MCP)",
      "Server can ask the host model to complete sub-requests—advanced pattern.",
    ],
    [
      "Cursor / Claude Desktop MCP",
      "Editors launching configured MCP servers from JSON config files.",
    ],
    ["FastMCP", "Python SDK for building MCP servers quickly with decorators."],
    ["Tool approval UI", "Human confirms high-risk MCP invocations before execution."],
    [
      "Idempotent tools",
      "Design tools safe to retry when agents double-call after timeouts.",
    ],
  ],
  "fine-tuning": [
    [
      "LoRA",
      "Low-rank adapters injected into attention layers—train small matrices only.",
    ],
    ["QLoRA", "LoRA on quantized base weights—fits large models on consumer GPUs."],
    ["PEFT library", "Hugging Face peft package configuring LoRA/AdaLoRA adapters."],
    ["TRL / SFTTrainer", "Training helpers for supervised fine-tuning of causal LMs."],
    [
      "DPO (direct preference optimization)",
      "Align from preference pairs without explicit reward model RL loop.",
    ],
    [
      "RLHF (high level)",
      "Reward model + policy optimization from human rankings—expensive pipeline.",
    ],
    [
      "Preference dataset",
      "Chosen vs rejected completions per prompt—powers alignment methods.",
    ],
    [
      "Learning rate for fine-tune",
      "Often much smaller than pretraining—1e-5 to 1e-4 typical starting band.",
    ],
    [
      "Epochs vs steps",
      "Small domain datasets overfit quickly—monitor validation generation quality.",
    ],
    [
      "Evaluation harness",
      "Held-out prompts with automatic graders during fine-tune experiments.",
    ],
    [
      "Merge adapters",
      "Bake LoRA into base weights for deployment without adapter runtime.",
    ],
    [
      "Continued pretraining",
      "More unsupervised tokens on domain corpus before task-specific SFT.",
    ],
  ],
  inference: [
    [
      "Batch inference",
      "Process many inputs together for GPU utilization—higher latency per item possible.",
    ],
    ["Streaming inference", "Token-by-token generation over HTTP chunked responses."],
    [
      "Time to first token (TTFT)",
      "Latency until first streamed chunk—critical for chat UX.",
    ],
    [
      "Tokens per second",
      "Throughput metric for capacity planning and model comparison.",
    ],
    ["GGUF / llama.cpp", "CPU/GPU efficient local inference format for open models."],
    ["vLLM", "Serving engine with PagedAttention for high-throughput LLM APIs."],
    [
      "Continuous batching",
      "Dynamically pack requests in flight—improves GPU utilization in servers.",
    ],
    [
      "OpenAI-compatible server",
      "Local stacks mimicking /v1/chat/completions for drop-in SDK use.",
    ],
    [
      "Cold start",
      "Model load time when scaling from zero—important for serverless GPUs.",
    ],
    [
      "Autoscaling inference",
      "HPA/Kubernetes or cloud autoscaler on GPU queue depth and latency SLOs.",
    ],
    [
      "INT8 / INT4 quantization",
      "Post-training quantization for edge and cost-sensitive deployment.",
    ],
    [
      "Distillation",
      "Train smaller student mimicking teacher outputs—cheaper inference.",
    ],
  ],
  "model-types": [
    ["Linear model", "Simple baseline and interpretable coefficients on tabular data."],
    [
      "Kernel SVM",
      "Nonlinear boundaries via implicit feature maps—scales poorly to huge n.",
    ],
    [
      "Random forest",
      "Bagged trees with feature subsampling—strong default on structured data.",
    ],
    ["Seq2seq model", "Encoder maps input sequence; decoder generates output sequence."],
    [
      "Masked language model",
      "BERT-style fill-in-the-blank pretraining for bidirectional context.",
    ],
    ["Causal language model", "GPT-style next-token prediction for generation and chat."],
    [
      "Vision-language model (VLM)",
      "Accepts images + text—screenshot understanding, document QA.",
    ],
    [
      "Speech-language model",
      "Audio encoders fused with text decoders for voice assistants.",
    ],
    [
      "Tabular foundation model",
      "Emerging architectures targeting enterprise spreadsheet-like data.",
    ],
    [
      "Time-series model",
      "Forecasting with RNNs, transformers, or classical ARIMA/prophet baselines.",
    ],
    [
      "Recommender system",
      "Collaborative filtering, two-tower models, or sequential recommenders.",
    ],
  ],
  "generative-ai": [
    [
      "Latent space",
      "Compressed representation where sampling or interpolation produces outputs.",
    ],
    [
      "Classifier-free guidance",
      "Trade diversity vs adherence in diffusion by scaling conditional vs unconditional scores.",
    ],
    ["ControlNet", "Condition image generation on edges/depth/pose maps."],
    [
      "Stable Diffusion",
      "Popular open latent diffusion stack for images—Python pipelines via diffusers.",
    ],
    [
      "Inpainting / outpainting",
      "Edit regions or extend canvas—mask-conditioned generation.",
    ],
    [
      "Text-to-image",
      "Prompt drives visual synthesis—evaluate safety and copyright policies.",
    ],
    [
      "Codec model",
      "Neural audio compression (EnCodec family) enabling efficient speech models.",
    ],
    [
      "Music generation",
      "Autoregressive or diffusion models over audio tokens or spectrograms.",
    ],
    [
      "Structured generation",
      "Constrain outputs to JSON, SQL, or grammars—outlines, guidance libraries.",
    ],
    [
      "Watermarking (AI content)",
      "Metadata or signal marking synthetic media for provenance tracking.",
    ],
  ],
  "computer-vision": [
    ["Convolution", "Slide learnable filters across spatial grids—nn.Conv2d in PyTorch."],
    ["Pooling", "Downsample feature maps—max/average pooling reduces resolution."],
    [
      "Data augmentation (vision)",
      "Random crops, flips, color jitter—torchvision.transforms pipelines.",
    ],
    [
      "mAP (mean average precision)",
      "Standard object detection metric across IoU thresholds.",
    ],
    [
      "IoU (intersection over union)",
      "Overlap score for box/mask matching in detection benchmarks.",
    ],
    ["YOLO family", "Real-time one-stage detectors popular in edge video analytics."],
    ["OpenCV", "Classic Python/C++ CV library for capture, transforms, classical CV."],
    ["torchvision", "Datasets, pretrained CNN/ViT weights, and transforms for vision."],
    ["OCR", "Optical character recognition—detect text regions then transcribe."],
    [
      "Face detection / recognition",
      "Specialized pipelines with privacy and consent requirements.",
    ],
    [
      "Video understanding",
      "Temporal models or frame sampling plus aggregation for action recognition.",
    ],
  ],
  speech: [
    [
      "Whisper",
      "OpenASR model family with robust multilingual transcription—openai-whisper package.",
    ],
    ["Phoneme", "Speech sound unit—TTS pipelines map text → phonemes → audio."],
    [
      "Sample rate",
      "Audio Hz (e.g., 16 kHz telephony vs 44.1 kHz music)—resample consistently.",
    ],
    ["librosa", "Python library for audio features, spectrograms, and basic analysis."],
    ["torchaudio", "PyTorch audio I/O, transforms, and model zoo pieces."],
    [
      "Streaming ASR",
      "Partial transcripts as audio arrives—WebSocket pipelines in prod.",
    ],
    ["Wake word", "Low-power detector triggering full ASR—edge device pattern."],
    ["Noise suppression", "Preprocess audio before ASR/TTS in calls and meetings."],
    [
      "Speaker embedding",
      "Vector representing voice identity—for verification or diarization.",
    ],
    ["Alignment (ASR)", "Map audio frames to text tokens for subtitles and editing."],
  ],
  safety: [
    [
      "Jailbreak",
      "User-crafted prompts evading safety training—continuous red-team cat-and-mouse.",
    ],
    [
      "System prompt hardening",
      "Explicit refusal rules and scope limits in trusted system messages.",
    ],
    ["Output filter", "Post-process model text for PII, toxicity, or policy violations."],
    [
      "Input filter",
      "Block or sanitize prompts and uploads before they reach the model.",
    ],
    [
      "Content moderation API",
      "Classifiers scoring hate, sexual, violence categories on text/images.",
    ],
    [
      "Model card",
      "Documentation of intended use, limitations, biases, and eval results.",
    ],
    ["Bias audit", "Measure performance gaps across demographic or regional slices."],
    [
      "Differential privacy (awareness)",
      "Noise mechanisms limiting memorization of individuals—specialized training.",
    ],
    [
      "Supply chain security",
      "Verify hashes of downloaded weights; scan dependencies for malware.",
    ],
    [
      "Secrets in prompts",
      "Never embed API keys in prompts or logs—use env vars and secret managers.",
    ],
  ],
  product: [
    [
      "Latency SLO",
      "Product promise on p95 response time—drives model size and caching choices.",
    ],
    ["Fallback model", "Cheaper/smaller model when primary times out or rate-limits."],
    [
      "Graceful degradation",
      "Show cached answer or shorter reply when dependencies fail.",
    ],
    [
      "Citation UI",
      "Show retrieved sources users can click—builds trust in RAG products.",
    ],
    [
      "Edit-and-resubmit loop",
      "Users fix model output; edits become golden data for improvements.",
    ],
    [
      "Prompt library",
      "Curated templates per job role—product feature reducing blank-page friction.",
    ],
    ["Usage metering", "Track tokens per tenant for billing and abuse detection."],
    [
      "Rate limiting",
      "Protect APIs from overload—per-user and global quotas in Python middleware.",
    ],
    [
      "Feature flag for models",
      "Launch new checkpoints to a percentage of traffic safely.",
    ],
    [
      "AI disclosure",
      "Tell users they interact with AI—regulatory expectation in many jurisdictions.",
    ],
  ],
  "data-science": [
    [
      "Correlation matrix",
      "Heatmap of feature relationships—spurious correlations abound.",
    ],
    ["Histogram / KDE", "Distribution views guiding transforms and outlier policies."],
    ["Box plot", "Compare medians and spread across segments quickly."],
    ["Power analysis", "Estimate sample size needed to detect effect in A/B tests."],
    [
      "Confidence interval",
      "Range estimating parameter uncertainty—not the same as model CI from trees.",
    ],
    [
      "p-value (caution)",
      "Frequentist test output—misinterpretation common; prefer effect sizes.",
    ],
    [
      "Survivorship bias",
      "Training on entities that lasted—skews historical business datasets.",
    ],
    [
      "Selection bias",
      "Non-random sampling of examples—breaks IID and naive validation.",
    ],
    [
      "Notebook reproducibility",
      "Pin seeds, data snapshots, and package versions when sharing EDA.",
    ],
    ["matplotlib / seaborn", "Standard Python plotting for EDA and report charts."],
  ],
  mlops: [
    [
      "Artifact",
      "Serialized model files, metrics JSON, plots stored per experiment run.",
    ],
    ["DVC", "Data version control tracking large files outside git blobs."],
    [
      "Feature pipeline",
      "Batch or streaming jobs producing training/serving features identically.",
    ],
    [
      "Training-serving skew",
      "Different code paths online vs offline—silent metric collapse in prod.",
    ],
    ["Shadow deployment", "Run new model on copies of traffic without affecting users."],
    ["Canary release", "Route small traffic share to new model before full cutover."],
    ["Rollback", "Revert to prior model version when monitors fire—automate in CD."],
    [
      "Kubernetes + GPUs",
      "Schedule inference/training pods with nvidia.com/gpu resource limits.",
    ],
    [
      "Docker image for ML",
      "Bake CUDA, Python deps, and app server into reproducible deploy units.",
    ],
    [
      "Prometheus / Grafana",
      "Metrics stacks watching latency, errors, GPU utilization on inference.",
    ],
    ["Airflow / Prefect", "Orchestrate periodic retraining and ETL DAGs in Python."],
  ],
  math: [
    ["Dot product", "Similarity building block for attention scores and embeddings."],
    [
      "Matrix multiplication",
      "Core op in neural nets—implemented efficiently via BLAS on GPU.",
    ],
    [
      "Eigenvalue / eigenvector",
      "PCA and stability analysis use spectral decomposition concepts.",
    ],
    [
      "Gradient",
      "Vector of partial derivatives pointing uphill—optimizers step opposite.",
    ],
    [
      "Jacobian / Hessian (awareness)",
      "Higher-order derivatives—relevant in advanced optimization research.",
    ],
    [
      "Cross-entropy loss",
      "Compare predicted distribution to true label distribution—classification standard.",
    ],
    [
      "Softmax function",
      "Maps logits to simplex probabilities—differentiable for backprop.",
    ],
    [
      "Bayes' rule",
      "Update beliefs with evidence—underpins naive Bayes and probabilistic ML.",
    ],
    [
      "Maximum likelihood estimation",
      "Choose parameters maximizing data probability under a model family.",
    ],
    [
      "Markov chain (awareness)",
      "Memoryless state transitions—building block for some sequence models.",
    ],
  ],
  coding: [
    [
      "Inline completion",
      "Ghost text in editor from Copilot/Cursor/Tabnine-style plugins.",
    ],
    [
      "Chat over codebase",
      "RAG or symbol index feeding repository context into the assistant.",
    ],
    [
      "Diff-based edit",
      "Model proposes unified diff hunks humans apply—clearer than full file regen.",
    ],
    [
      "Test-driven AI fix",
      "Provide failing pytest output in prompt to steer repair loops.",
    ],
    [
      "Sandboxed execution",
      "Run untrusted model code in containers with network disabled.",
    ],
    ["Static analysis hook", "Run ruff/mypy after AI edits before CI merge."],
    [
      "Code embedding",
      "Vectors for semantic code search—sourcegraph-style retrieval aids agents.",
    ],
    ["Docstring generation", "LLM drafts docs—verify against actual behavior and types."],
    [
      "Migration assistant",
      "Help upgrade frameworks (2→3, pandas API changes) with human review.",
    ],
    [
      "Security review bot",
      "Flag SQL injection, hardcoded secrets in AI-suggested patches.",
    ],
  ],
  observability: [
    [
      "LangSmith / Langfuse",
      "Trace LLM chains—inputs, outputs, latencies, costs per span.",
    ],
    ["OpenTelemetry", "Vendor-neutral tracing/metrics—instrument Python LLM middleware."],
    [
      "Token usage logging",
      "Prompt/completion token counts per request for finance and debugging.",
    ],
    ["LLM-as-judge", "Use a strong model to score weaker model outputs on rubrics."],
    ["Golden dataset", "Curated prompt/answer pairs regression-tested each release."],
    ["Regression eval", "Compare new model vs baseline on fixed suite before ship."],
    ["Toxicity score", "Automated classifier flagging harmful generations in logs."],
    [
      "Latency histogram",
      "Track p50/p95/p99 for retrieval, LLM, and tool steps separately.",
    ],
    [
      "Cost per request",
      "Attribute spend to tenant/feature—drives caching and model routing.",
    ],
    ["PII scrubbing in logs", "Redact emails/IDs from stored prompts and completions."],
  ],
};
