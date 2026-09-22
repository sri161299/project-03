import { InferenceClient } from "@huggingface/inference";
import {
  GenerateImageOptions,
  GenerateImageResult,
  ImageGenerationProvider,
  ProviderAuthError,
  ProviderQuotaError,
  ProviderUnavailableError,
  ProviderUnsupportedError,
} from "./types";

export class HuggingFaceProvider implements ImageGenerationProvider {
  id = "huggingface";
  name = "Hugging Face";
  supportsEditing = false;

  private getClient(): InferenceClient {
    const token = process.env.HF_TOKEN?.trim();
    if (!token) {
      throw new ProviderAuthError("Image provider authentication is missing.");
    }
    return new InferenceClient(token);
  }

  private calculateDimensions(aspectRatio?: string, width?: number, height?: number) {
    if (width && height) {
      return { width, height };
    }
    switch (aspectRatio) {
      case "16:9":
        return { width: 1024, height: 576 };
      case "9:16":
        return { width: 576, height: 1024 };
      case "4:3":
        return { width: 1024, height: 768 };
      case "3:4":
        return { width: 768, height: 1024 };
      case "1:1":
      default:
        return { width: 1024, height: 1024 };
    }
  }

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const token = process.env.HF_TOKEN?.trim();
    if (!token) {
      throw new ProviderAuthError("Image provider authentication is missing.");
    }

    const client = this.getClient();
    const model = process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
    const { width, height } = this.calculateDimensions(options.aspectRatio, options.width, options.height);

    try {
      // Use textToImage from Hugging Face InferenceClient
      const imageBlob = await client.textToImage({
        model,
        inputs: options.prompt,
        parameters: {
          width,
          height,
          ...(options.negativePrompt ? { negative_prompt: options.negativePrompt } : {}),
        },
      });

      // Convert returned Blob or string to data:image/png;base64 URL
      let base64Data: string;
      if (typeof imageBlob === "string") {
        base64Data = (imageBlob as string).startsWith("data:")
          ? (imageBlob as string).replace(/^data:[^;]+;base64,/, "")
          : (imageBlob as string);
      } else {
        const arrayBuffer = await (imageBlob as unknown as Blob).arrayBuffer();
        base64Data = Buffer.from(arrayBuffer).toString("base64");
      }
      const imageUrl = `data:image/png;base64,${base64Data}`;

      return {
        imageUrl,
        provider: "huggingface",
        model,
        aspectRatio: options.aspectRatio || "1:1",
        note: `Generated with ${model} on Hugging Face Inference`,
      };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const status = err?.status || err?.statusCode || err?.response?.status;

      // Detect authentication / token errors
      if (
        status === 401 ||
        status === 403 ||
        errMsg.toLowerCase().includes("unauthorized") ||
        errMsg.toLowerCase().includes("invalid token") ||
        errMsg.toLowerCase().includes("invalid username") ||
        errMsg.toLowerCase().includes("invalid credentials") ||
        errMsg.toLowerCase().includes("authorization header") ||
        errMsg.toLowerCase().includes("authentication")
      ) {
        throw new ProviderAuthError("Image provider authentication is missing.");
      }

      console.error("Hugging Face unexpected generation error:", err);

      // Detect quota / credit exhaustion errors
      if (
        status === 429 ||
        status === 402 ||
        errMsg.toLowerCase().includes("quota") ||
        errMsg.toLowerCase().includes("rate limit") ||
        errMsg.toLowerCase().includes("credits") ||
        errMsg.toLowerCase().includes("payment required") ||
        errMsg.toLowerCase().includes("exhausted")
      ) {
        throw new ProviderQuotaError(
          "Free image-generation credits have been exhausted. Try again later or connect a paid provider."
        );
      }

      // Detect temporary unavailability
      if (
        status === 503 ||
        status === 504 ||
        errMsg.toLowerCase().includes("loading") ||
        errMsg.toLowerCase().includes("currently loading") ||
        errMsg.toLowerCase().includes("unavailable") ||
        errMsg.toLowerCase().includes("timeout")
      ) {
        throw new ProviderUnavailableError("Image generation is temporarily unavailable.");
      }

      throw new Error(errMsg || "Image generation failed");
    }
  }

  async editImage(_options: GenerateImageOptions): Promise<GenerateImageResult> {
    throw new ProviderUnsupportedError(
      "Image editing is not available with the current free provider. Please use text-to-image or connect an image-editing provider."
    );
  }
}
