# ArchAI — Next-Generation AI Visual Synthesis Studio

ArchAI is a futuristic AI image-generation SaaS platform designed with a dark luxury aesthetic, real-time creative generation, variant exploration, and an extensible provider-agnostic inference architecture.

---

## 🎨 Image Generation Architecture

ArchAI decouples its frontend from any single AI backend via the `ImageGenerationProvider` abstraction. Requests from the **Main Prompt Bar**, the **Live Studio Canvas**, and the **Gallery** flow through an intelligent server router that dispatches to the active provider:

```
Frontend (Prompt Bar / Live Studio)
       ↓
POST /api/images/generate
       ↓
Image Provider Router (server/providers/image-provider.ts)
       ↓
┌───────────────────────┬────────────────────────┬──────────────────────┐
│  HuggingFaceProvider  │     GeminiProvider     │    LocalProvider     │
│ (FLUX.1-schnell API)  │  (Paid Multimodal SDK) │ (Offline Synthesizer)│
└───────────────────────┴────────────────────────┴──────────────────────┘
       ↓
Base64 PNG / Lossless Image Stream
       ↓
ArchAI Visual Canvas & Variant Inspector
```

---

## 🚀 Getting Started with Hugging Face Provider

ArchAI uses **Hugging Face** as its default provider, enabling free experimentation credits via the official Hugging Face Inference API.

### 1. Create a Hugging Face Account
1. Visit [https://huggingface.co/join](https://huggingface.co/join) to register for an account (or log in if you already have one).
2. Confirm your email address.

### 2. Create an Access Token with Inference Permission
1. Go to your Access Tokens page: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens).
2. Click **Create new token**.
3. Provide a name (e.g. `archai-inference`).
4. Select the **Read** or **Inference** role:
   - For **Fine-grained tokens**, ensure the **Make calls to the serverless Inference API** permission under *Inference* is enabled.
5. Click **Create token** and copy the resulting string (`hf_...`).

### 3. Configure Environment Variables
Set the following variables in your environment or `.env`:

```env
# Active Image Provider
IMAGE_PROVIDER=huggingface

# Hugging Face Access Token
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Preferred Text-to-Image Model
HF_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
```

> **Note on Free Credits**: Hugging Face free accounts include limited monthly inference credits for experimentation. Usage limits and rate thresholds can change according to Hugging Face policies. When limits are reached, the system will notify you with clear credit status messages.

---

## 🔄 Switching Providers

ArchAI allows you to switch providers seamlessly without touching frontend code.

### Switching to Google Gemini (Paid API Key)
If you have a paid Gemini API project with billing enabled for 2K/4K resolution and conversational image-to-image editing:

```env
IMAGE_PROVIDER=gemini
GEMINI_API_KEY=your_paid_gemini_api_key_here
```

When `IMAGE_PROVIDER=gemini`:
- High-fidelity generation is supported across multi-resolution outputs (`1K`, `2K`, `4K`).
- Image-to-image transformation and conversational editing are enabled.

### Switching to Local Synthesizer (Offline Mode)
For testing and zero-token offline demonstrations:

```env
IMAGE_PROVIDER=local
```

### In-App Developer Settings
You can also toggle the active provider at runtime by clicking the **Provider** indicator in the navigation bar or the settings icon in the Live Studio toolbar.

---

## 🔒 Security Principles

- **Zero Client-Side Keys**: Neither `HF_TOKEN` nor `GEMINI_API_KEY` are ever sent to or accessible within browser code.
- **Server Ingress Routing**: All external API requests are proxied securely through `/api/images/*` endpoints.
- **Graceful Startup**: The application boots cleanly with `IMAGE_PROVIDER=huggingface` without requiring `GEMINI_API_KEY`.
