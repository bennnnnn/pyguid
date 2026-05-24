import type { AiTerminologySection } from "./types";
import { enrichSectionTerms } from "./enrich";
import { AI_TERM_EXPANSIONS } from "./expansions";
import { gloss, termAnchorsForSection } from "./helpers";

/** Curated glossary sections for AI terminology reference. */
const AI_TERMINOLOGY_SECTIONS_BASE: AiTerminologySection[] = [
  {
    id: "big-picture",
    title: "AI Big Picture",
    intro:
      "How today’s strongest systems relate: AI as the umbrella field, ML as learning from data, deep learning using large neural nets, and generative AI focused on generating new outputs.",
    terms: gloss([
      [
        "Artificial intelligence (AI)",
        "Machines exhibiting problem-solving or perception that typically requires human-like judgment. In practice it spans rule-based programs, statistical models, and modern neural networks.",
        "Often built with Python libs (Torch, JAX, sklearn) glued together with pipelines and APIs.",
      ],
      [
        "Machine learning (ML)",
        "Systems whose behavior improves from exposure to data rather than only hand-written rules.",
        "sklearn.pipeline.Pipeline and Lightning-style training loops embody the fit/eval/deploy loop.",
      ],
      [
        "Deep learning",
        "ML using neural networks with many layers so representations are learned hierarchically.",
        "PyTorch and TensorFlow are the dominant Python stacks; torch.nn.Module stacks layers.",
      ],
      [
        "Generative AI (GenAI)",
        "Models trained to synthesize plausible new content (text, images, audio, code) rather than only label inputs.",
        "Accessed via local weights, hosted APIs (openai, anthropic, etc.), or open-weight runners.",
      ],
      [
        "Narrow AI (weak AI)",
        "Systems specialized for concrete tasks without general human competence.",
        "Most production bots, recommenders, and classifiers fall here.",
      ],
      [
        "Artificial general intelligence (AGI) (concept)",
        "A hypothetical frontier where AI matches broad human cognition; not settled science and often used informally.",
      ],
      [
        "Representation learning",
        "Learning transformations of raw inputs into embeddings or features suited to downstream tasks.",
        "torch.nn.Embedding and pretrained encoders are classic examples.",
      ],
      [
        "Statistical learning",
        "Framing learning as fitting distributions or predictors while controlling generalization.",
        "sklearn models expose fit, predict, predict_proba with probabilistic interpretations.",
      ],
    ]),
  },
  {
    id: "python-ecosystem",
    title: "Python AI Ecosystem",
    intro:
      "Libraries, runtimes, and workflows Python teams standardize around to ship datasets, experiments, models, and services.",
    terms: gloss([
      [
        "CPython",
        "The reference Python interpreter executing .py bytecode; GPU stacks ship wheels targeting it.",
        "Pair with CUDA/cuDNN drivers when using NVIDIA GPUs locally.",
      ],
      [
        "PyPI",
        "The canonical package index; pip install pulls wheels and resolves dependencies.",
        "Pin versions in requirements.txt / pyproject.toml for reproducible ML builds.",
      ],
      [
        "Conda / Mamba",
        "Cross-language packaging that can bundle Python plus compiled libs (often easier for SciPy stacks).",
        "conda-forge is common for numerical and ML tooling.",
      ],
      [
        "Virtual environments (venv)",
        "Isolated interpreters so project dependencies never corrupt your system Python.",
        "python -m venv .venv && source .venv/bin/activate is the minimalist workflow.",
      ],
      [
        "Jupyter notebooks",
        "Interactive cells mixing prose, code, plots—great for exploration, brittle for automation.",
        "Combine with %matplotlib inline / papermill for templated notebooks.",
      ],
      [
        "Google Colab / cloud notebooks",
        "Hosted Jupyter with GPUs/TPUs; fast for tutorials, mind egress and secrets carefully.",
      ],
      [
        "Scientific Python core",
        "numpy/scipy for numerics plus ecosystem glue inside almost every ML project.",
      ],
      [
        "Typing & data modeling",
        "Modules like pydantic, typing, dataclasses, attrs clarify configs and payloads.",
      ],
    ]),
  },
  {
    id: "data-terms",
    title: "Data Terms",
    intro:
      "Vocabulary describing how datasets are shaped, sliced, and consumed—especially conventions like X for inputs and y for outputs in supervised learning APIs.",
    terms: gloss([
      [
        "Dataset",
        "The collection of examples your model learns from plus metadata documenting schema and lineage.",
      ],
      [
        "Example / sample / observation",
        "One atomic row-like record pairing inputs with optional labels.",
      ],
      [
        "Feature",
        "An individual measurable input derived from sensors, logs, embeddings, engineered columns, etc.",
      ],
      [
        "X matrix (inputs)",
        "Conventional sklearn name for stacked feature vectors forming a 2D array/DataFrame fed to learners.",
      ],
      [
        "y vector (targets)",
        "Conventional sklearn name for supervised labels paired row-wise with X.",
      ],
      ["Label set", "The categorical or ordinal tag space for supervised problems."],
      [
        "Pandas DataFrame",
        "Labeled tables ideal for exploratory analysis, joins, and feature engineering pipelines.",
      ],
      [
        "NumPy ndarray",
        "Dense homogeneous arrays underpinning sklearn, Torch tensor bridges, and vectorized math.",
      ],
      [
        "Structured vs unstructured data",
        "Tabular/feature-engineered datasets vs raw text/audio/video requiring specialized encoders.",
      ],
      [
        "Train / validation / test split",
        "Partitions guarding against leakage: train fits, validation tunes, test estimates generalization.",
      ],
      [
        "Independent and identically distributed (IID)",
        "A simplifying assumption that samples are interchangeable; violated in many real deployments.",
      ],
    ]),
    codeExample:
      "import pandas as pd\nfrom sklearn.datasets import load_iris\n\ndata = load_iris(as_frame=True)\nX = data.data   # classical uppercase feature matrix convention\ny = data.target",
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    intro:
      "Patterns shared across supervised, unsupervised, and deep models: objectives, optimization, and generalization tradeoffs.",
    terms: gloss([
      [
        "Model",
        "A parameterized function plus training procedure that maps inputs to predictions or generations.",
      ],
      ["Algorithm", "The recipe for updating parameters (or structure) from data."],
      [
        "Loss / objective",
        "A scalar score to minimize (or maximize) comparing predictions to desired outcomes.",
      ],
      [
        "Optimization",
        "Numerical search for parameters improving the loss, often via gradients or closed-form solvers.",
      ],
      [
        "Gradient descent",
        "Iteratively step parameters opposite the loss gradient to reduce error.",
      ],
      [
        "Overfitting",
        "Memorizing training quirks that fail on new data; mitigated by data, regularization, or simpler models.",
      ],
      [
        "Underfitting",
        "Models too constrained to capture real signal; lifts with richer features/architectures/data.",
      ],
      [
        "Bias–variance tradeoff",
        "Simple models bias wrong structure; expressive models inflate variance unless regularized/data-rich.",
      ],
      [
        "Regularization",
        "Penalties (L1/L2/dropout) or priors shrinking capacity to improve generalization.",
      ],
      [
        "fit / predict / transform",
        "sklearn’s lifecycle: estimate parameters (fit), map features (transform), infer outputs (predict).",
      ],
    ]),
  },
  {
    id: "supervised",
    title: "Supervised Learning",
    intro:
      "Problems where labeled targets supervise parameter updates—from spam detection to forecasting.",
    terms: gloss([
      [
        "Classification",
        "Predict discrete labels/probabilities mapping inputs to categorical outputs.",
      ],
      ["Regression", "Predict continuous values (pricing, dwell time, telemetry)."],
      [
        "Binary vs multiclass",
        "Decision boundaries differ; strategies include one-vs-rest and softmax distributions.",
      ],
      [
        "Decision boundary",
        "The hypersurface separating predicted classes or thresholded scores.",
      ],
      [
        "Logistic regression / softmax",
        "Linear models emitting calibrated class probabilities.",
      ],
      [
        "Support vector machines (SVMs)",
        "Max-margin separators with kernel tricks for nonlinear geometry.",
      ],
      [
        "Decision trees / ensembles",
        "Axis-aligned splits boosted or bagged (RandomForest, GradientBoosting).",
      ],
    ]),
  },
  {
    id: "unsupervised",
    title: "Unsupervised Learning",
    intro:
      "Mining structure without curated labels—grouping rows, shrinking dimensionality, or surfacing outliers.",
    terms: gloss([
      [
        "Clustering",
        "Partition samples into cohesive groups (k-means, hierarchical, DBSCAN variants).",
      ],
      [
        "Dimensionality reduction",
        "Project high-dimensional vectors into manageable spaces preserving variance or neighborhoods.",
      ],
      [
        "Principal Component Analysis (PCA)",
        "Orthogonal projections capturing maximal variance.",
      ],
      [
        "t-SNE / UMAP",
        "Nonlinear visualizations emphasizing local neighborhoods—not reliable distance metrics downstream.",
      ],
      [
        "Anomaly detection",
        "Identify rare or harmful points deviating from the bulk distribution.",
      ],
      [
        "Topic modeling",
        "Discover latent themes in textual corpora (e.g., LDA-style approaches).",
      ],
    ]),
  },
  {
    id: "training",
    title: "Model Training",
    intro:
      "Turn data + architecture + optimizer into updated weights via forward passes, differentiable loss, backward passes, and parameter steps.",
    terms: gloss([
      [
        "Forward pass",
        "Compute predictions and intermediate activations flowing input→output.",
      ],
      [
        "Backward pass (backprop)",
        "Apply the chain rule to propagate loss gradients through the graph/modules.",
      ],
      ["Epoch", "One complete traversal of the training dataset iterator."],
      [
        "Batch / minibatch",
        "Subset of samples per optimizer step balancing noise vs memory.",
      ],
      ["Learning rate", "Step scale controlling convergence speed vs stability."],
      [
        "Optimizer",
        "SGD, Adam, AdamW-like adaptive methods estimating per-parameter momentum.",
      ],
      [
        "Gradient clipping",
        "Cap exploding gradients recurrent or transformer training often needs.",
      ],
      [
        "Mixed precision (torch.cuda.amp)",
        "Lower numeric formats for speed/memory with guarded loss scaling.",
      ],
    ]),
    codeExample:
      "loss = criterion(model(inputs), targets)\nloss.backward()\noptimizer.step()\noptimizer.zero_grad(set_to_none=True)",
  },
  {
    id: "evaluation",
    title: "Evaluation",
    intro:
      "Quantify predictive quality and calibration so deployment decisions hinge on reproducible benchmarks.",
    terms: gloss([
      [
        "Confusion matrix",
        "Counts of true vs predicted categories revealing error patterns.",
      ],
      [
        "Accuracy",
        "Overall correct predictions; brittle on imbalanced label distributions.",
      ],
      [
        "Precision",
        "Among predicted positives, what fraction truly belong to the positive class?",
      ],
      ["Recall", "Among actual positives, what fraction did we catch?"],
      ["F1 score", "Harmonic mean balancing precision/recall."],
      [
        "ROC-AUC",
        "Area under the receiver operating characteristic assessing ranking quality across thresholds.",
      ],
      ["Mean squared error", "Common regression penalty squaring residuals."],
      [
        "sklearn.metrics helpers",
        "Functions emitting scores from y_true, y_pred, or y_score arrays.",
      ],
      [
        "Cross-validation",
        "Repeated train/validation splits stabilizing variance in performance estimates.",
      ],
    ]),
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    intro:
      "Layered differentiable programs learning hierarchical features automatically from raw-ish inputs.",
    terms: gloss([
      [
        "Activation function",
        "Nonlinearities introducing expressivity (ReLU, GELU, sigmoid-like gates).",
      ],
      [
        "Hidden layers",
        "Intermediate tensors mixing information before logits or embeddings surface.",
      ],
      [
        "Batch normalization",
        "Stabilize activations via running statistics centered per channel/batch regime.",
      ],
      ["Dropout", "Random neuron masking during training to reduce co-adaptation."],
      [
        "Convolutional neural network (CNN)",
        "Spatially local filters dominating vision tasks.",
      ],
      [
        "Recurrent nets (RNN/LSTM)",
        "Hidden states summarizing sequential inputs before transformers dominated NLP.",
      ],
      ["Residual connections", "Skip pathways easing optimization in very deep stacks."],
      [
        "PyTorch tensors",
        "GPU-accelerated n-dimensional arrays tracking autograd graphs when requires_grad=True.",
      ],
    ]),
    codeExample:
      'import torch\n\nx = torch.randn(4, 3, 224, 224, device="cuda", requires_grad=False)\nweights = torch.nn.Parameter(torch.randn(3, 16, device="cuda"))\ny = torch.einsum("bchw,ch->bc", x.mean(dim=(2, 3)), weights)',
  },
  {
    id: "nlp",
    title: "NLP",
    intro:
      "Processing human language—from classical string features to contextual neural representations powering modern assistants.",
    terms: gloss([
      [
        "Token",
        "Atomic language unit (often subwords) exchanged between models and preprocessing.",
      ],
      [
        "Tokenization",
        "Algorithms like BPE/WordPiece/SentencePiece chopping text into model vocabulary IDs.",
      ],
      [
        "Corpus",
        "Large textual collection underpinning statistics or training corpora pipelines.",
      ],
      [
        "Stemming vs lemmatization",
        "Rule/statistical truncation vs dictionary-aware canonical forms.",
      ],
      [
        "Part-of-speech tagging",
        "Assign grammatical categories enabling classical feature pipelines.",
      ],
      [
        "Named entity recognition (NER)",
        "Detect spans for people, locations, SKUs—common structured extraction precursor.",
      ],
      ["Sequence labeling", "Per-token classification such as tagging or slot filling."],
      [
        "Language modeling",
        "Predict upcoming tokens conditioned on preceding context—the heart of GPT-style stacks.",
      ],
    ]),
  },
  {
    id: "llm",
    title: "Transformers & LLMs",
    intro:
      "Attention-based architectures scale to massive web corpora yielding large language models with broad few-shot aptitude.",
    terms: gloss([
      [
        "Transformer",
        "Encoder/decoder stacks using self-attention with residual + feed-forward blocks.",
      ],
      [
        "Self-attention",
        "Each position queries every other via learned projections yielding contextual mixes.",
      ],
      [
        "Decoder-only causal LM",
        "Mask future tokens—GPT-style architectures generating left-to-right.",
      ],
      [
        "Encoder-only model",
        "Bidirectional contextualization such as classic BERT for classification/embeddings.",
      ],
      [
        "Parameters / weights",
        "Billions/trillions of scalars capturing statistical regularities (+ compute cost).",
      ],
      [
        "Context window",
        "Maximum span of tokens concurrently attended—limits prompt + completion length.",
      ],
      [
        "Pre-training vs downstream task",
        "Mass unsupervised/next-token training followed by prompting or fine-tunes on domains.",
      ],
      [
        "Alignment / RLHF-related ideas",
        "Human preference optimization steering helpfulness vs harm (high-level shorthand).",
      ],
    ]),
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    intro:
      "Crafting textual instructions so LLMs reliably follow policies, schemas, tools, or reasoning motifs.",
    terms: gloss([
      ["Prompt", "User + system messages conditioning model behavior at inference time."],
      [
        "System prompt",
        "Highest-priority instruction block defining persona, tooling policy, refusal boundaries.",
      ],
      ["Zero-shot prompting", "Direct instruction without demos—fast but brittle."],
      [
        "Few-shot prompting",
        "Provide exemplars inside the prompt to anchor formatting or rationale.",
      ],
      [
        "Chain-of-thought (CoT)",
        "Explicitly ask for stepped reasoning transcripts before final answers.",
      ],
      [
        "Delimiters / structured outputs",
        "Triple quotes, Markdown fences, XML tags, JSON schema hints keeping segments machine-parseable.",
      ],
      [
        "Prompt templating libraries",
        "Python helpers like LangChain PromptTemplates or custom f-strings versioning prompts as code.",
      ],
    ]),
  },
  {
    id: "embeddings",
    title: "Embeddings & Vector Search",
    intro:
      "Dense vectors summarize semantics so similarity retrieval powers search, moderation, personalization, or RAG.",
    terms: gloss([
      [
        "Embedding",
        "Fixed-length numeric summary of richer inputs (sentence, SKU, screenshot features).",
      ],
      [
        "Similarity scoring",
        "Cosine, dot-product, Euclidean distance quantify neighborhood closeness.",
      ],
      [
        "Approximate nearest neighbor (ANN)",
        "Index structures enabling low-latency search over billions of embeddings.",
      ],
      [
        "Vector database",
        "Operational store combining ANN indexing, filtering metadata, ingestion APIs.",
      ],
      [
        "Hybrid search",
        "Blend sparse lexical retrieval (BM25) with dense embeddings for recall/precision balances.",
      ],
      [
        "Pooling strategies",
        "Mean/max/CLS token pooling turning token sequences into passage vectors.",
      ],
    ]),
  },
  {
    id: "rag",
    title: "RAG",
    intro:
      "Retrieval-Augmented Generation combines search over trusted documents with LLM synthesis so answers stay grounded instead of hallucinating from stale parameters alone.",
    terms: gloss([
      [
        "RAG pipeline",
        "Typically ingest → chunk → embed → retrieve top-k passages → concatenate into prompt → generate answer citing context.",
      ],
      [
        "Chunking strategy",
        "Split docs into coherent windows respecting token budgets and respecting sentence boundaries.",
      ],
      [
        "Retriever",
        "Module scoring candidate passages versus the live query embedding or sparse query.",
      ],
      [
        "Re-ranker",
        "Cross-attention scorer refining top-k passages before prompting the LM.",
      ],
      [
        "Grounding / grounding failure",
        "How faithfully outputs stick to retrieved evidence—monitor when models ignore context.",
      ],
      [
        "Citation discipline",
        "Force model to quote spans or cite chunk IDs aiding auditability.",
      ],
      [
        "Knowledge freshness",
        "External corpora updates without redeploying entire foundation weights.",
      ],
    ]),
  },
  {
    id: "agents",
    title: "AI Agents",
    intro:
      "An AI agent is a system that works toward a goal over several steps: it reads context, decides what to do next, calls tools or APIs, checks the result, and repeats. This is different from a single chat reply, which answers once and stops. Agentic apps are common in Python with frameworks like LangGraph, LangChain, and the OpenAI Agents SDK.",
    terms: gloss([
      [
        "AI agent",
        "Software that uses a language model plus tools, memory, and control logic to complete tasks that take multiple steps.",
      ],
      [
        "Agentic AI",
        "Building systems where the model chooses actions (search, code run, API call) instead of only returning text in one shot.",
      ],
      [
        "Goal",
        "What the user or system wants accomplished, such as “book a flight” or “fix this bug.” The agent’s loop is judged against the goal.",
      ],
      [
        "Task",
        "A concrete unit of work inside a goal, often broken into smaller steps the agent can finish and verify.",
      ],
      [
        "Agent loop",
        "The repeating cycle: observe state → decide → act → read feedback until the goal is met or a limit is hit.",
      ],
      [
        "Step",
        "One turn of the loop, such as one tool call or one model message before the next decision.",
      ],
      [
        "Action",
        "Something the agent does in the world: call an API, run code, write a file, send a message.",
      ],
      [
        "Observation",
        "What the agent sees after an action: tool output, error message, search results, or user reply.",
      ],
      [
        "Environment",
        "Everything outside the model that actions affect: files, databases, browsers, calendars, or sandboxes.",
      ],
      [
        "Tool",
        "A defined capability the model can invoke, with a name, description, and input schema (for example “search” or “send_email”).",
      ],
      [
        "Tool use / tool calling",
        "The model picks a tool and arguments; your code runs the tool and returns the result to the model.",
      ],
      [
        "Function calling",
        "Same idea as tool calling: the API exposes functions the model can request; the host executes them.",
      ],
      [
        "Planner",
        "A part of the system (often the model or a separate prompt) that outlines upcoming steps before execution.",
      ],
      [
        "Executor",
        "The part that runs the chosen action: your Python code, a worker process, or a remote API client.",
      ],
      [
        "Router",
        "Logic that sends a request to the right agent, tool, or model (for example support vs billing vs coding).",
      ],
      [
        "Supervisor",
        "A coordinator agent that assigns work to worker agents and merges their results.",
      ],
      [
        "Worker agent",
        "A specialist agent focused on one role, such as research, coding, or writing, under a supervisor.",
      ],
      [
        "Multi-agent system",
        "Several agents cooperating or handing off work; useful for complex workflows but harder to debug.",
      ],
      [
        "Memory",
        "Stored information the agent can use later: chat history, facts, or retrieved documents.",
      ],
      [
        "Short-term memory",
        "Recent messages and tool results kept in the current session or context window.",
      ],
      [
        "Long-term memory",
        "Persistent storage across sessions, often implemented with a database or vector store.",
      ],
      [
        "Scratchpad",
        "Working notes the agent writes for itself between steps (plans, partial answers, todo lists).",
      ],
      [
        "State",
        "The full snapshot of an agent run: messages, tool outputs, variables, and metadata passed step to step.",
      ],
      [
        "Workflow",
        "A fixed or semi-fixed sequence of steps (ingest → retrieve → answer) that may include agent decisions.",
      ],
      [
        "Graph (agent graph)",
        "Nodes are steps or agents; edges are allowed transitions. LangGraph models many agent apps this way.",
      ],
      [
        "Node",
        "One unit in an agent graph, such as “call model,” “run tool,” or “human approval.”",
      ],
      [
        "Edge",
        "A allowed move from one node to another, sometimes conditioned on the model’s choice or tool result.",
      ],
      [
        "State machine",
        "Explicit rules for which state comes next; helps make agent behavior predictable and testable.",
      ],
      [
        "ReAct",
        "Reason + Act pattern: the model alternates short reasoning text with tool calls using observations.",
      ],
      [
        "Plan-and-execute",
        "First produce a full plan, then run steps with less replanning; good for stable, well-defined tasks.",
      ],
      [
        "Reflection / self-correction",
        "After a draft or tool run, the model reviews its work and fixes mistakes in a follow-up step.",
      ],
      [
        "Human-in-the-loop",
        "A person approves, edits, or rejects certain actions before the agent continues.",
      ],
      [
        "Approval flow",
        "Rules for when human confirmation is required, such as before sending email or spending money.",
      ],
      [
        "Guardrail",
        "Checks that block or rewrite unsafe inputs and outputs (policy filters, schema validation, allowlists).",
      ],
      [
        "Policy",
        "Written rules for what an agent may or may not do, enforced in code rather than only in the prompt.",
      ],
      [
        "Stopping condition",
        "When the loop ends: goal achieved, max steps reached, timeout, or user cancel.",
      ],
      [
        "Max iterations / step limit",
        "A safety cap so runaway loops cannot burn tokens or call tools forever.",
      ],
      [
        "LangChain",
        "Python library for chaining prompts, tools, retrievers, and agents; often used with LangGraph for control.",
      ],
      [
        "LangGraph",
        "Library for building stateful, multi-step agent workflows as graphs with checkpoints and branching.",
      ],
      [
        "OpenAI Agents SDK",
        "Toolkit for defining agents, handoffs, and tool use against OpenAI-compatible models.",
      ],
      [
        "CrewAI / AutoGen / similar frameworks",
        "Higher-level multi-agent orchestration libraries that assign roles and conversation patterns.",
      ],
    ]),
    links: [
      {
        label: "LangGraph — agentic RAG",
        href: "https://docs.langchain.com/oss/python/langgraph/agentic-rag",
      },
    ],
  },
  {
    id: "mcp",
    title: "MCP & Tooling",
    intro:
      "The Model Context Protocol standardizes how models discover and invoke tools, resources, and prompts across editors and backends.",
    terms: gloss([
      [
        "Model Context Protocol (MCP)",
        "A client/server specification wiring assistants to filesystems, HTTP APIs, databases, etc.",
      ],
      [
        "MCP host",
        "Application (IDE, chat UI) spawning transports and approving tool access.",
      ],
      [
        "MCP server",
        "Registers capabilities (tools/resources/prompt templates) surfaced to compliant clients.",
      ],
      [
        "Tool schema",
        "Typed JSON describing callable operations with enforced arguments—mirrors structured function APIs.",
      ],
      [
        "OAuth / credential boundaries",
        "Production deployments must segregate secrets and scope least privilege.",
      ],
    ]),
    links: [
      {
        label: "MCP Introduction",
        href: "https://modelcontextprotocol.io/docs/getting-started/intro",
      },
    ],
  },
  {
    id: "fine-tuning",
    title: "Fine-Tuning LLMs",
    intro:
      "Adapt foundation weights toward domain tone, tooling behavior, or low-resource languages using extra supervised signals.",
    terms: gloss([
      ["Full fine-tuning", "Update every parameter—powerful yet expensive."],
      [
        "Parameter-efficient fine-tuning (PEFT)",
        "LoRA/QLoRA-style adapters injecting low-rank deltas into attention blocks.",
      ],
      [
        "Instruction tuning",
        "Dataset of instruction → response tuples teaching chat compliance.",
      ],
      [
        "Supervised fine-tuning (SFT)",
        "Standard cross-entropy on curated transcript pairs.",
      ],
      [
        "Catastrophic forgetting",
        "New tasks eroding prior behaviors—counter with replay, KL constraints, staged training.",
      ],
      [
        "Dataset hygiene",
        "PII scrubbing, license checks, duplication removal before GPU burn.",
      ],
    ]),
  },
  {
    id: "inference",
    title: "Inference & Serving",
    intro:
      "Turn trained artifacts into scalable online predictions or streaming generations respecting latency budgets.",
    terms: gloss([
      ["Inference", "Forward-only execution path without gradient updates."],
      [
        "Throughput vs latency",
        "Batch sizing trades tokens/sec against individual completion delay.",
      ],
      [
        "Quantization",
        "Lower bit-width weights/activations shrinking memory footprints with careful calibration.",
      ],
      [
        "Speculative decoding",
        "Draft small models speculate tokens verified by bigger models for speed wins.",
      ],
      ["ONNX / TorchScript / TensorRT exports", "Graph lowering for optimized runtimes."],
      [
        "Model serving stacks",
        "vLLM, Triton, Ray Serve patterns batching GPUs behind HTTP/grpc.",
      ],
    ]),
  },
  {
    id: "model-types",
    title: "Model Types",
    intro:
      "Taxonomy distinguishing discriminative judges from generative artists and multimodal fusers.",
    terms: gloss([
      [
        "Discriminative vs generative",
        "Boundary estimators versus density/sampler architects.",
      ],
      [
        "Foundation model",
        "Large multitask pretrained core reused widely before specialization.",
      ],
      [
        "Encoder-only transformers",
        "Bidirectional comprehension models (BERT family lineages).",
      ],
      ["Decoder-only causal LMs", "Autoregressive generators dominating chat APIs."],
      ["Encoder–decoder seq2seq", "Machine translation staples—sometimes hybridized."],
      ["Multimodal models", "Unified towers over vision+audio+text modalities."],
      [
        "Diffusion backbone",
        "Noise scheduling models for imagery/video when not autoregressive tokens.",
      ],
    ]),
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    intro:
      "Beyond text: imagery, speech, molecules—generators share probabilistic formulation but differ architectures.",
    terms: gloss([
      [
        "Autoregressive generation",
        "Sample next token/frame conditioned on prefix—core to LLMs/audio codecs.",
      ],
      ["Diffusion models", "Iterative denoising pipelines for photoreal synthesis."],
      [
        "GANs",
        "Adversarial min-max games between generator and discriminator—older dominant for imagery.",
      ],
      [
        "Variational autoencoders (VAEs)",
        "Latent variable models bridging reconstruction + sampling.",
      ],
      [
        "Temperature / top-p sampling",
        "Inference knobs manipulating randomness vs determinism.",
      ],
    ]),
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    intro:
      "Teaching machines pixels → semantics via convolutions, vision transformers, and specialized heads.",
    terms: gloss([
      ["Image classification", "Assign holistic labels describing entire scenes."],
      ["Object detection", "Bounding boxes + class IDs localizing multiple entities."],
      ["Semantic segmentation", "Per-pixel class maps without instance separation."],
      ["Instance segmentation", "Separate masks per entity instance."],
      ["Vision Transformer (ViT)", "Patchify frames + transformer blocks rivaling CNNs."],
      [
        "Transfer learning backbone",
        "Reuse ImageNet pretrained encoders heads for downstream fine-tuning.",
      ],
    ]),
  },
  {
    id: "speech",
    title: "Speech & Audio AI",
    intro:
      "Waveforms → transcripts, phonemes → speech, separating speakers or scoring audio quality alongside LLM tooling.",
    terms: gloss([
      [
        "Automatic speech recognition (ASR)",
        "Audio-to-text aligning acoustic frames with language models.",
      ],
      [
        "Text-to-speech (TTS)",
        "Rendered speech from text conditioning prosody embeddings.",
      ],
      ["Mel spectrograms", "Time-frequency representations feeding acoustic models."],
      ["Speaker diarization", "Who spoke when timelines for meetings/call centers."],
      [
        "Voice activity detection (VAD)",
        "Cheap gating preprocessing streaming pipelines.",
      ],
    ]),
  },
  {
    id: "safety",
    title: "AI Safety & Security",
    intro:
      "Threat modeling for misuse: prompt injections, adversarial perturbations, data poisoning, fairness failures, jailbreak dynamics.",
    terms: gloss([
      [
        "Adversarial example",
        "Tiny perturbations fooling discriminative nets or jailbreaking LLMs.",
      ],
      [
        "Prompt injection",
        "Untrusted embedded text coaxing assistants to disobey developer policies.",
      ],
      ["Data poisoning", "Malicious training points biasing downstream behavior."],
      ["Red teaming", "Structured probing surfacing refusal gaps before launch."],
      [
        "Fairness metrics",
        "Disparate impact, demographic parity nuances—ethical + legal mandates.",
      ],
      [
        "Mitigations",
        "Layered defenses: sanitization, RAG grounding, deterministic tool policies, human review queues.",
      ],
    ]),
  },
  {
    id: "product",
    title: "AI Product & Apps",
    intro:
      "Shipping AI UX: progressive disclosure of uncertainty, human review, iterative evaluation aligned with KPIs—not only model leaderboard scores.",
    terms: gloss([
      [
        "Human-in-the-loop (HITL)",
        "Operators approve, edit, or reject model outputs powering continuous improvement datasets.",
      ],
      [
        "Feedback signals",
        "Thumbs, edits, SLA violations feeding retraining/improvement backlog prioritization.",
      ],
      [
        "Guardrails UX",
        "Inline reminders, disclaimers, safe defaults before risky actions.",
      ],
      ["Cost dashboards", "Token spend, infra burn, SLA adherence tied to SKU pricing."],
      [
        "Experimentation loops",
        "A/B prompting, model swap toggles staged behind feature flags.",
      ],
    ]),
  },
  {
    id: "data-science",
    title: "Data Science for AI",
    intro:
      "Bridging exploratory analysis with experiment design so AI investments answer business questions responsibly.",
    terms: gloss([
      [
        "Exploratory data analysis (EDA)",
        "Visual/statistical summaries surfacing outliers, correlations, leakage risks.",
      ],
      [
        "Feature engineering",
        "Domain-informed transforms outperforming brute stacking alone.",
      ],
      [
        "Statistical testing",
        "Hypothesis tests / confidence intervals quantifying uncertainty outside pure ML scoring.",
      ],
      [
        "Causal inference (awareness)",
        "Correlation ≠ causation—randomized experiments still gold standard.",
      ],
      [
        "A/B testing",
        "Compare model variants respecting power calculations and novelty effects.",
      ],
    ]),
  },
  {
    id: "mlops",
    title: "MLOps",
    intro:
      "Operational rigor versioning data, experiments, deployments, drift monitors—AI's DevOps analogue.",
    terms: gloss([
      [
        "Reproducibility",
        "Seeded runs, deterministic dataloaders, hashed configs/environment snapshots.",
      ],
      [
        "Experiment tracking",
        "MLflow, Weights & Biases, Neptune logging metrics/parameters/artifacts.",
      ],
      ["CI/CD for ML", "Automated training + evaluation gates before staging promotion."],
      ["Model registry", "Canonical lineage mapping artifacts ↔ approvals."],
      [
        "Drift detection",
        "Statistical monitors on inputs/outputs alerting retrain workflows.",
      ],
      ["Feature store", "Serving + training parity for curated features lowering skew."],
    ]),
  },
  {
    id: "math",
    title: "Math for AI",
    intro:
      "Fluent notation across linear algebra, calculus, probability, and optimization dramatically accelerates debugging training dynamics.",
    terms: gloss([
      [
        "Linear algebra",
        "Vectors, matrices, eigen decompositions underlying attention projections.",
      ],
      ["Calculus", "Partial derivatives powering autograd differentiation."],
      [
        "Probability",
        "Distributions calibration, Bayesian views, PAC-style generalization narratives.",
      ],
      [
        "Information theory basics",
        "Entropy/KL divergence explaining loss formulations like cross-entropy.",
      ],
      [
        "Optimization theory",
        "Convex intuition even when deep nets are wildly non-convex pragmatically optimized.",
      ],
    ]),
  },
  {
    id: "coding",
    title: "AI Coding Terms",
    intro:
      "How developers pair with autocomplete models, scaffolding tests, refactoring under policy constraints tied to MCP hosts or repo rules.",
    terms: gloss([
      [
        "AI pair programmer",
        "Assistants suggesting diffs/tests inline within editors—still requires critical review.",
      ],
      [
        "Copilot-style completion",
        "Ghost text predictions conditioned on neighboring files/context windows.",
      ],
      [
        "Repo-aware agents",
        "Indexing symbol graphs + docs for multi-file refactor suggestions.",
      ],
      [
        "AST / linter integration",
        "Structural edits validated by compilers before merge.",
      ],
      [
        "Synthetic test generation",
        "LLMs draft pytest coverage—humans prune brittle assertions.",
      ],
    ]),
  },
  {
    id: "observability",
    title: "Evaluation & Observability",
    intro:
      "Production LLM stacks need tracing, telemetry, qualitative rubrics, and automated graders beyond offline accuracy spreadsheets.",
    terms: gloss([
      [
        "LLM evaluation suites",
        "Held-out QA sets, toxicity classifiers, style rubrics benchmarking releases.",
      ],
      [
        "Online evaluation",
        "Logged user outcomes, escalation rates, thumbs proxying usefulness.",
      ],
      [
        "Tracing / spans",
        "Structured spans per retrieval chunk, tool call, token stream—OpenTelemetry-compatible patterns emerge.",
      ],
      [
        "Prompt/version logging",
        "Immutable records tying outputs to templates + model checkpoints.",
      ],
      [
        "Hallucination monitors",
        "NLI entailment checks vs retrieved evidence or automated contradiction detectors.",
      ],
      [
        "Synthetic traffic replay",
        "Shadow deploy new models replaying sanitized conversations measuring regressions safely.",
      ],
    ]),
  },
];

function mergeSectionTerms(section: AiTerminologySection): AiTerminologySection {
  const extra = AI_TERM_EXPANSIONS[section.id];
  const terms = extra?.length ? [...section.terms, ...gloss(extra)] : [...section.terms];
  const anchors = termAnchorsForSection(section.id, terms);
  return { ...section, terms: enrichSectionTerms(section.id, terms, anchors) };
}

/** Sections with expansion terms and search/display enrichment applied. */
export const AI_TERMINOLOGY_SECTIONS: AiTerminologySection[] =
  AI_TERMINOLOGY_SECTIONS_BASE.map(mergeSectionTerms);
