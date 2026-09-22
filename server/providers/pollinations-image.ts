import {
  GenerateImageOptions,
  GenerateImageResult,
  ImageGenerationProvider,
  ProviderAuthError,
  ProviderQuotaError,
  ProviderUnavailableError,
  ProviderUnsupportedError,
} from "./types";

/**
 * Dimension map for FLUX.1 Schnell on Pollinations
 */
function resolveDimensions(
  aspectRatio: string = "1:1",
  width?: number,
  height?: number,
  _imageSize?: string
): { width: number; height: number } {
  if (width && height && !isNaN(width) && !isNaN(height)) {
    // Keep multiples of 16 for diffusion model stability
    const cleanW = Math.round(width / 16) * 16;
    const cleanH = Math.round(height / 16) * 16;
    return {
      width: Math.min(Math.max(cleanW, 256), 2048),
      height: Math.min(Math.max(cleanH, 256), 2048),
    };
  }

  switch (aspectRatio) {
    case "16:9":
      return { width: 1344, height: 768 };
    case "9:16":
      return { width: 768, height: 1344 };
    case "4:3":
      return { width: 1152, height: 864 };
    case "3:4":
      return { width: 864, height: 1152 };
    case "21:9":
      return { width: 1536, height: 640 };
    case "1:1":
    default:
      return { width: 1024, height: 1024 };
  }
}

export function resolvePollinationsModel(requestedModel?: string): string {
  const candidate = (requestedModel || process.env.POLLINATIONS_IMAGE_MODEL || "flux").trim();
  const lower = candidate.toLowerCase();
  if (
    !candidate ||
    lower === "flux" ||
    lower.includes("flux") ||
    lower.includes("image generation") ||
    lower.includes("text to image")
  ) {
    return "flux";
  }
  return candidate;
}

function resolvePollinationsBaseUrl(): string {
  const configured = process.env.POLLINATIONS_API_BASE_URL?.trim();
  return (configured || "https://image.pollinations.ai").replace(/\/+$/, "");
}

function redactResponseBody(body: string): string {
  const normalized = body.replace(/\s+/g, " ").trim();
  return normalized.length > 2000 ? `${normalized.slice(0, 2000)}...` : normalized;
}

export class PollinationsImageProvider implements ImageGenerationProvider {
  id = "pollinations";
  name = "Pollinations.AI";
  supportsEditing = false;

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const prompt = options.prompt?.trim();
    if (!prompt) {
      throw new Error("Prompt is required and must not be empty.");
    }

    if (
      (options.width !== undefined && (isNaN(Number(options.width)) || Number(options.width) <= 0)) ||
      (options.height !== undefined && (isNaN(Number(options.height)) || Number(options.height) <= 0))
    ) {
      throw new Error("Invalid image dimensions. Width and height must be positive numbers.");
    }

    const model = resolvePollinationsModel(options.model);
    const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
    const { width, height } = resolveDimensions(
      options.aspectRatio,
      options.width,
      options.height,
      options.imageSize
    );
    const seed = Math.floor(Math.random() * 2147483647);

    const apiBaseUrl = resolvePollinationsBaseUrl();
    const requestUrl = new URL(`${apiBaseUrl}/prompt/${encodeURIComponent(prompt)}`);
    requestUrl.searchParams.set("model", model);
    requestUrl.searchParams.set("width", String(width));
    requestUrl.searchParams.set("height", String(height));
    requestUrl.searchParams.set("seed", String(seed));
    requestUrl.searchParams.set("nologo", "true");

    const requestHeaders: Record<string, string> = {
      Accept: "image/*, application/json",
      "User-Agent": "ArchAI-Studio/1.0",
    };

    if (apiKey) {
      requestHeaders.Authorization = `Bearer ${apiKey}`;
    }

    try {
        const signal = AbortSignal.timeout(45000);
        const response = await fetch(requestUrl, {
          method: "GET",
          headers: requestHeaders,
          signal,
        });

        const contentType = response.headers.get("content-type")?.toLowerCase() || "";

        if (!response.ok) {
          const status = response.status;
          const responseBodyText = await response.text();

          console.error("Pollinations request failed", {
            url: requestUrl.toString(),
            status,
            contentType: contentType || "missing",
            responseText: redactResponseBody(responseBodyText),
            apiKeyConfigured: Boolean(apiKey),
            authorizationSent: Boolean(requestHeaders.Authorization),
          });

          const lowerBody = responseBodyText.toLowerCase();

          // 1. Authentication Error Handling (if final attempt)
          if (
            status === 401 ||
            status === 403 ||
            lowerBody.includes("unauthorized") ||
            lowerBody.includes("api key is required") ||
            lowerBody.includes("invalid api key") ||
            lowerBody.includes("authentication")
          ) {
            throw new ProviderAuthError("Pollinations authentication is required.");
          }

          // 2. Rate Limit & Quota Exhaustion
          if (
            status === 429 ||
            status === 402 ||
            lowerBody.includes("rate limit") ||
            lowerBody.includes("quota") ||
            lowerBody.includes("credits")
          ) {
            throw new ProviderQuotaError(
              "Free image-generation credits have been exhausted. Try again later or connect a paid provider."
            );
          }

          // 3. Provider Unavailable & Timeout
          if (
            status === 503 ||
            status === 504 ||
            status === 502 ||
            lowerBody.includes("unavailable") ||
            lowerBody.includes("timeout")
          ) {
            throw new ProviderUnavailableError("Image generation is temporarily unavailable.");
          }

          let parsedMessage = "";
          if (contentType.includes("application/json") || contentType.includes("+json")) {
            try {
              const parsed = JSON.parse(responseBodyText);
              parsedMessage = parsed?.error?.message || parsed?.message || "";
            } catch {
              parsedMessage = "Invalid JSON error response from Pollinations.";
            }
          } else if (contentType.includes("text/html") || lowerBody.startsWith("<!doctype html") || lowerBody.startsWith("<html")) {
            parsedMessage = `Pollinations returned an HTML error page (HTTP ${status}). Check the API base URL, route, proxy, and authentication configuration.`;
          }

          throw new Error(parsedMessage || `Pollinations API request failed with status ${status}`);
        }

        if (!contentType.startsWith("image/")) {
          const responseBodyText = await response.text();
          console.error("Pollinations returned a non-image response", {
            url: requestUrl.toString(),
            status: response.status,
            contentType: contentType || "missing",
            responseText: redactResponseBody(responseBodyText),
            apiKeyConfigured: Boolean(apiKey),
            authorizationSent: Boolean(requestHeaders.Authorization),
          });

          if (contentType.includes("text/html") || responseBodyText.trim().startsWith("<")) {
            throw new ProviderUnavailableError(
              "Pollinations returned an HTML response instead of an image. Check the API endpoint, proxy, and server configuration."
            );
          }

          throw new ProviderUnavailableError("Pollinations returned an unexpected response instead of an image.");
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        if (buffer.length === 0) {
          throw new ProviderUnavailableError("Image generation returned an empty result.");
        }

        const base64Data = buffer.toString("base64");
        const imageUrl = `data:${contentType};base64,${base64Data}`;

        return {
          imageUrl,
          provider: "pollinations",
          model,
          aspectRatio: options.aspectRatio || "1:1",
          note: `Generated with ${model} on Pollinations.AI`,
        };
    } catch (lastError: any) {
      if (
        lastError instanceof ProviderAuthError ||
        lastError instanceof ProviderQuotaError ||
        lastError instanceof ProviderUnavailableError ||
        lastError instanceof ProviderUnsupportedError
      ) {
        throw lastError;
      }

      const errMsg = lastError?.message || String(lastError);
      const errName = lastError?.name || "";

      if (
        errName === "TimeoutError" ||
        errName === "AbortError" ||
        errMsg.toLowerCase().includes("timeout") ||
        errMsg.toLowerCase().includes("timed out")
      ) {
        throw new ProviderUnavailableError("Image generation request timed out. Please try again.");
      }

      if (
        errMsg.toLowerCase().includes("fetch failed") ||
        errMsg.toLowerCase().includes("econnrefused") ||
        errMsg.toLowerCase().includes("enotfound")
      ) {
        throw new ProviderUnavailableError("Image generation is temporarily unavailable.");
      }

      if (
        errMsg.toLowerCase().includes("unauthorized") ||
        errMsg.toLowerCase().includes("api key") ||
        errMsg.toLowerCase().includes("authentication")
      ) {
        throw new ProviderAuthError("Pollinations authentication is required.");
      }

      throw new Error(errMsg || "Image generation failed");
    }
  }

  async editImage(_options: GenerateImageOptions): Promise<GenerateImageResult> {
    throw new ProviderUnsupportedError(
      "Image editing is not supported by Pollinations. Please use text-to-image or connect an image-editing provider."
    );
  }
}
