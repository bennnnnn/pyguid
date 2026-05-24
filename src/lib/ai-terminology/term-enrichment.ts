import type { TermEnrichment } from "./enrich";

/** Aliases, related terms, and beginner leads keyed by anchor id or "sectionId::Term". */
export const TERM_ENRICHMENT: Record<string, TermEnrichment> = {
  "big-picture::Artificial intelligence (AI)": {
    aliases: ["AI", "artificial intelligence"],
    related: ["Machine learning (ML)", "Deep learning", "Generative AI (GenAI)"],
    simple: "AI is when software performs tasks that usually need human judgment, like classifying email or answering questions.",
  },
  "big-picture::Machine learning (ML)": {
    aliases: ["ML", "machine learning"],
    related: ["Deep learning", "Model", "Training"],
    simple: "Machine learning means the program improves from data instead of relying only on hand-written rules.",
  },
  "big-picture::Deep learning": {
    aliases: ["DL", "deep learning"],
    related: ["Neural network", "Transformers & LLMs", "PyTorch"],
    simple: "Deep learning uses large neural networks with many layers to learn patterns from raw data.",
  },
  "big-picture::Generative AI (GenAI)": {
    aliases: ["GenAI", "generative AI", "gen AI"],
    related: ["Large language model (LLM)", "Prompt", "Diffusion models"],
    simple: "Generative AI creates new text, images, or code rather than only labeling existing inputs.",
  },
  "big-picture::Artificial general intelligence (AGI) (concept)": {
    aliases: ["AGI", "general AI"],
    simple: "AGI is the idea of AI with broad human-level ability. It is a concept, not a product you can install today.",
  },
  "data-terms::Dataset": {
    aliases: ["data set", "training data"],
    related: ["Feature", "Train / validation / test split"],
    simple: "A dataset is the collection of examples your model learns from.",
  },
  "data-terms::Feature": {
    aliases: ["input feature", "predictor"],
    related: ["X matrix (inputs)", "Feature engineering"],
    simple: "A feature is one measurable input column, like age, price, or word count.",
  },
  "data-terms::X matrix (inputs)": {
    aliases: ["X", "design matrix", "feature matrix"],
    related: ["y vector (targets)", "Pandas DataFrame"],
    simple: "X is the table of input features fed into a model, usually one row per example.",
  },
  "data-terms::y vector (targets)": {
    aliases: ["y", "labels", "targets"],
    related: ["X matrix (inputs)", "Supervised learning"],
    simple: "y holds the correct answers for supervised learning, one label per row of X.",
  },
  "ml-basics::Model": {
    aliases: ["ML model"],
    related: ["Training", "Inference", "Loss / objective"],
    simple: "A model is the trained program that turns inputs into predictions or generated text.",
  },
  "ml-basics::Loss / objective": {
    aliases: ["loss function", "objective function", "cost function"],
    related: ["Gradient descent", "Optimization"],
    simple: "The loss is a single number that says how wrong the model is. Training tries to make it smaller.",
  },
  "ml-basics::Overfitting": {
    aliases: ["over-fitting"],
    related: ["Underfitting", "Regularization", "Cross-validation"],
    simple: "Overfitting means the model memorizes training noise and performs worse on new data.",
  },
  "ml-basics::Gradient descent": {
    aliases: ["GD", "gradient-based optimization"],
    related: ["Learning rate", "Backpropagation"],
    simple: "Gradient descent nudges model weights step by step to reduce the loss.",
  },
  "supervised::Classification": {
    aliases: ["classifier", "categorization"],
    related: ["Regression", "Confusion matrix", "Accuracy"],
    simple: "Classification predicts a category, such as spam vs not spam.",
  },
  "supervised::Regression": {
    aliases: ["regressor"],
    related: ["Classification", "Mean squared error"],
    simple: "Regression predicts a number, such as price or temperature.",
  },
  "training::Backward pass (backprop)": {
    aliases: ["backprop", "backpropagation", "backward pass"],
    related: ["Forward pass", "Gradient descent"],
    simple: "Backpropagation computes how each weight contributed to the error so the optimizer can update them.",
  },
  "training::Learning rate": {
    aliases: ["LR", "step size"],
    related: ["Optimizer", "Learning rate schedule"],
    simple: "Learning rate controls how big each weight update is during training.",
  },
  "evaluation::Precision": {
    aliases: ["positive predictive value"],
    related: ["Recall", "F1 score"],
    simple: "Precision asks: of everything we labeled positive, how many were actually positive?",
  },
  "evaluation::Recall": {
    aliases: ["sensitivity", "true positive rate"],
    related: ["Precision", "F1 score"],
    simple: "Recall asks: of all real positives, how many did we find?",
  },
  "evaluation::Cross-validation": {
    aliases: ["CV", "k-fold"],
    related: ["Train / validation / test split", "Overfitting"],
    simple: "Cross-validation rotates train and validation folds so scores are less lucky-one-split noise.",
  },
  "deep-learning::Neural network": {
    aliases: ["neural net", "NN"],
    related: ["Deep learning", "Activation function"],
    simple: "A neural network stacks layers that transform numbers step by step into a prediction.",
  },
  "nlp::Token": {
    aliases: ["tokens", "subword"],
    related: ["Tokenization", "LLM"],
    simple: "A token is a small piece of text the model reads, often a word fragment rather than a full word.",
  },
  "nlp::Tokenization": {
    aliases: ["tokenizer", "text tokenization"],
    related: ["Token", "Vocabulary"],
    simple: "Tokenization splits text into numbered pieces the model can process.",
  },
  "llm::Transformer": {
    aliases: ["transformer model", "attention model"],
    related: ["Self-attention", "Large language model (LLM)"],
    simple: "A transformer is the main architecture behind modern chat models, built from attention layers.",
  },
  "llm::Self-attention": {
    aliases: ["attention", "scaled dot-product attention"],
    related: ["Transformer", "Multi-head attention"],
    simple: "Self-attention lets each word look at other words in the sentence to build context.",
  },
  "llm::Large language model (LLM)": {
    aliases: ["LLM", "large language models", "language model"],
    related: ["Transformer", "Prompt", "Token"],
    simple: "An LLM is a huge text model trained to predict the next token, used for chat and coding help.",
  },
  "llm::Context window": {
    aliases: ["context length", "max tokens"],
    related: ["Token", "Prompt"],
    simple: "The context window is how much text fits in one request, including your prompt and the reply.",
  },
  "prompt-engineering::Prompt": {
    aliases: ["user prompt", "instruction"],
    related: ["System prompt", "Few-shot prompting"],
    simple: "A prompt is the text you send the model to tell it what you want.",
  },
  "prompt-engineering::Chain-of-thought (CoT)": {
    aliases: ["CoT", "chain of thought"],
    related: ["Prompt", "Reasoning model"],
    simple: "Chain-of-thought prompting asks the model to show its reasoning steps before the final answer.",
  },
  "embeddings::Embedding": {
    aliases: ["vector embedding", "text embedding"],
    related: ["Vector database", "Similarity scoring"],
    simple: "An embedding is a list of numbers that captures the meaning of text for similarity search.",
  },
  "embeddings::Vector database": {
    aliases: ["vector DB", "vector store"],
    related: ["Embedding", "RAG"],
    simple: "A vector database stores embeddings and finds the closest matches to a query quickly.",
  },
  "rag::RAG pipeline": {
    aliases: ["RAG", "retrieval augmented generation"],
    related: ["Retriever", "Chunking strategy", "Grounding / grounding failure"],
    simple: "RAG searches your documents first, then asks the LLM to answer using what was retrieved.",
  },
  "rag::Chunking strategy": {
    aliases: ["text chunking", "document chunking"],
    related: ["RAG pipeline", "Embedding"],
    simple: "Chunking splits long documents into bite-sized pieces that fit in the model context.",
  },
  "observability::Hallucination monitors": {
    aliases: ["hallucination detection", "hallucination"],
    related: ["Grounding / grounding failure", "RAG pipeline"],
    simple: "A hallucination is when the model states something confident but wrong or unsupported.",
  },
  "agents::AI agent": {
    aliases: ["agent", "AI agents", "autonomous agent"],
    related: ["Tool use / tool calling", "Agent loop"],
    simple: "An AI agent is software that uses an LLM plus tools to work through multi-step tasks toward a goal.",
  },
  "agents::Tool use / tool calling": {
    aliases: ["tool calling", "function calling", "tools"],
    related: ["Tool", "MCP", "Function calling"],
    simple: "Tool calling lets the model request actions like search or run code; your Python code executes them.",
  },
  "agents::ReAct": {
    aliases: ["reason and act", "ReAct pattern"],
    related: ["Agent loop", "Tool use / tool calling"],
    simple: "ReAct alternates short reasoning with tool calls until the task is done.",
  },
  "mcp::Model Context Protocol (MCP)": {
    aliases: ["MCP", "model context protocol"],
    related: ["MCP server", "Tool schema"],
    simple: "MCP is a standard way for apps to give models access to tools, files, and data sources.",
  },
  "fine-tuning::LoRA": {
    aliases: ["LoRA adapters", "low-rank adaptation"],
    related: ["Fine-tuning LLMs", "PEFT"],
    simple: "LoRA fine-tunes small adapter matrices instead of every weight, saving GPU memory.",
  },
  "fine-tuning::RLHF (high level)": {
    aliases: ["RLHF", "reinforcement learning from human feedback"],
    related: ["Alignment / RLHF-related ideas", "Preference dataset"],
    simple: "RLHF adjusts a model using human preference rankings so replies better match what people want.",
  },
  "inference::Inference": {
    aliases: ["model inference", "prediction"],
    related: ["Training", "Throughput vs latency"],
    simple: "Inference is running a trained model on new inputs without updating its weights.",
  },
  "inference::Quantization": {
    aliases: ["model quantization", "INT8", "INT4"],
    related: ["Inference", "vLLM"],
    simple: "Quantization uses lower-precision numbers so models run faster and use less memory.",
  },
  "safety::Prompt injection": {
    aliases: ["prompt hack", "jailbreak prompt"],
    related: ["Jailbreak", "Guardrail"],
    simple: "Prompt injection hides hostile instructions in user content to trick the model into breaking rules.",
  },
  "mlops::MLOps": {
    aliases: ["ML ops", "machine learning operations"],
    related: ["Model registry", "Drift detection"],
    simple: "MLOps is the practice of shipping and monitoring ML models reliably, like DevOps for AI.",
  },
  "mlops::Feature store": {
    aliases: ["feature platform"],
    related: ["Feature engineering", "Training-serving skew"],
    simple: "A feature store serves the same feature values in training and production to avoid skew.",
  },
  "rag::Grounding / grounding failure": {
    aliases: ["grounding", "ungrounded answer"],
    simple: "Grounding means the answer sticks to retrieved facts. Failure means the model ignored the sources.",
  },
  "llm::Alignment / RLHF-related ideas": {
    aliases: ["alignment", "model alignment"],
    related: ["RLHF", "Guardrail"],
    simple: "Alignment means steering models toward helpful, honest, and safe behavior after base training.",
  },
  "agents::Guardrail": {
    aliases: ["guardrails", "safety filter"],
    related: ["Policy", "Prompt injection"],
    simple: "Guardrails are checks that block or rewrite unsafe model inputs and outputs.",
  },
  "agents::LangGraph": {
    aliases: ["lang graph"],
    related: ["Agent graph", "LangChain"],
    simple: "LangGraph models agent workflows as a graph of steps with state you can save and resume.",
  },
  "python-ecosystem::PyTorch": {
    aliases: ["torch"],
    related: ["Tensor", "Deep learning"],
  },
  "python-ecosystem::scikit-learn": {
    aliases: ["sklearn", "scikit learn"],
    related: ["fit / predict / transform", "Machine learning (ML)"],
  },
  "python-ecosystem::Hugging Face Transformers": {
    aliases: ["transformers", "huggingface transformers", "HF transformers"],
    related: ["LLM", "Fine-tuning LLMs"],
  },
  "generative-ai::Diffusion models": {
    aliases: ["diffusion", "image diffusion"],
    related: ["Stable Diffusion", "Text-to-image"],
  },
  "computer-vision::Object detection": {
    aliases: ["object detector", "bounding boxes"],
    related: ["Image classification", "YOLO family"],
  },
  "observability::Hallucination monitors": {
    aliases: ["hallucination detection"],
    related: ["RAG", "Faithfulness eval"],
  },
};
