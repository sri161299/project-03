import express from "express";
import "dotenv/config";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  getImageProvider,
  getProviderInfo,
  setRuntimeProvider,
} from "./server/providers/image-provider";
import {
  ProviderAuthError,
  ProviderQuotaError,
  ProviderUnavailableError,
  ProviderUnsupportedError,
} from "./server/providers/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

function handleProviderError(err: any, res: express.Response) {
  if (err instanceof ProviderAuthError) {
    return res.status(401).json({
      success: false,
      error: err.message || "Pollinations authentication is required.",
      code: "AUTH_MISSING",
    });
  }

  if (err instanceof ProviderQuotaError) {
    return res.status(429).json({
      success: false,
      error:
        err.message ||
        "Free image-generation credits have been exhausted. Try again later or connect a paid provider.",
      code: "QUOTA_EXHAUSTED",
    });
  }

  if (err instanceof ProviderUnsupportedError) {
    return res.status(400).json({
      success: false,
      error:
        err.message ||
        "Image editing is not supported by the current provider. Please use text-to-image or connect an image-editing provider.",
      code: "EDIT_UNSUPPORTED",
    });
  }

  if (err instanceof ProviderUnavailableError) {
    return res.status(503).json({
      success: false,
      error: err.message || "Image generation is temporarily unavailable.",
      code: "UNAVAILABLE",
    });
  }

  console.warn("Provider warning:", err?.message || err);
  const msg = err?.message || "Image generation failed";
  return res.status(500).json({
    success: false,
    error: msg,
    code: "PROVIDER_ERROR",
  });
}

// -------------------------------------------------------------
// Provider Status & Health Endpoints
// -------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  const info = getProviderInfo();
  res.json({
    status: "ok",
    ...info,
  });
});

app.get("/api/images/provider", (_req, res) => {
  res.json({
    success: true,
    ...getProviderInfo(),
  });
});

app.post("/api/images/provider", (req, res) => {
  const { provider } = req.body;
  if (!provider || typeof provider !== "string") {
    return res.status(400).json({ success: false, error: "Provider name is required" });
  }
  const clean = provider.trim().toLowerCase();
  if (clean !== "pollinations" && clean !== "huggingface" && clean !== "gemini" && clean !== "local") {
    return res.status(400).json({
      success: false,
      error: "Invalid provider. Supported: pollinations, huggingface, gemini, local",
    });
  }
  setRuntimeProvider(clean);
  res.json({
    success: true,
    message: `Switched provider to ${clean}`,
    ...getProviderInfo(),
  });
});

// -------------------------------------------------------------
// Core Image Generation Route: POST /api/images/generate
// Also supports POST /api/generate-image directly
// -------------------------------------------------------------
async function handleGenerate(req: express.Request, res: express.Response) {
  try {
    const {
      prompt,
      width,
      height,
      aspectRatio = "1:1",
      negativePrompt,
      imageSize,
      model,
      provider: requestedProvider,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must not be empty.",
        code: "INVALID_PROMPT",
      });
    }

    if (
      (width !== undefined && (isNaN(Number(width)) || Number(width) <= 0 || Number(width) > 4096)) ||
      (height !== undefined && (isNaN(Number(height)) || Number(height) <= 0 || Number(height) > 4096))
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid image dimensions. Width and height must be positive numbers up to 4096.",
        code: "INVALID_DIMENSIONS",
      });
    }

    const providerInstance = getImageProvider(requestedProvider);
    const result = await providerInstance.generateImage({
      prompt: prompt.trim(),
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
      aspectRatio,
      negativePrompt,
      imageSize,
      model,
    });

    res.json({
      success: true,
      imageUrl: result.imageUrl,
      provider: result.provider,
      model: result.model,
      aspectRatio: result.aspectRatio || aspectRatio,
      prompt: prompt.trim(),
      note: result.note,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    handleProviderError(err, res);
  }
}

app.post("/api/images/generate", handleGenerate);
// Maintain backwards compatibility with /api/generate-image
app.post("/api/generate-image", handleGenerate);

// -------------------------------------------------------------
// Image Editing Route: POST /api/images/edit
// -------------------------------------------------------------
async function handleEdit(req: express.Request, res: express.Response) {
  try {
    const {
      prompt,
      imageBase64,
      mimeType = "image/png",
      aspectRatio = "1:1",
      provider: requestedProvider,
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ success: false, error: "Edit prompt instruction is required" });
    }

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ success: false, error: "Image data is required to edit" });
    }

    const providerInstance = getImageProvider(requestedProvider);
    if (!providerInstance.supportsEditing || !providerInstance.editImage) {
      return res.status(400).json({
        success: false,
        error:
          "Image editing is not supported by the current provider. Please use text-to-image or connect an image-editing provider.",
        code: "EDIT_UNSUPPORTED",
      });
    }

    const result = await providerInstance.editImage({
      prompt: prompt.trim(),
      imageBase64,
      mimeType,
      aspectRatio,
    });

    res.json({
      success: true,
      imageUrl: result.imageUrl,
      provider: result.provider,
      model: result.model,
      prompt: prompt.trim(),
      note: result.note,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    handleProviderError(err, res);
  }
}

app.post("/api/images/edit", handleEdit);
// Maintain backwards compatibility with /api/edit-image
app.post("/api/edit-image", handleEdit);

// -------------------------------------------------------------
// Server & Vite Middleware
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ArchAI Server running on port ${PORT}`);
    const info = getProviderInfo();
    console.log(
      `Active Image Provider: ${info.activeProvider} (Model: ${info.model}, Pollinations Key: ${
        info.hasPollinationsKey ? "configured" : "none"
      }, HF Token: ${info.hasHfToken ? "configured" : "none"}, Gemini Key: ${
        info.hasGeminiKey ? "configured" : "none"
      })`
    );
  });
}

startServer();
