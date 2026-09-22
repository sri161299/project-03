import {
  GenerateImageOptions,
  GenerateImageResult,
  ImageGenerationProvider,
  ProviderAuthError,
  ProviderQuotaError,
  ProviderUnavailableError,
} from "./types";

export class GeminiProvider implements ImageGenerationProvider {
  id = "gemini";
  name = "Google Gemini";
  supportsEditing = true;

  // Lazy initialize GoogleGenAI ONLY when this provider is actually invoked
  private async getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new ProviderAuthError(
        "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment or Settings."
      );
    }

    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  async generateImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const ai = await this.getAIClient();
    const aspectRatio = options.aspectRatio || "1:1";
    const imageSize = options.imageSize || "1K";

    const prefersHighQuality = !!imageSize && (imageSize === "1K" || imageSize === "2K" || imageSize === "4K");
    const primaryModel = prefersHighQuality ? "gemini-3.1-flash-image" : "gemini-3.1-flash-lite-image";
    const fallbackModel = prefersHighQuality ? "gemini-3.1-flash-lite-image" : "gemini-3.1-flash-image";

    const configForModel = (model: string) => {
      if (model === "gemini-3.1-flash-image") {
        return {
          imageConfig: {
            aspectRatio,
            ...(imageSize ? { imageSize } : {}),
          },
        };
      }
      return {
        imageConfig: {
          aspectRatio,
        },
      };
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: primaryModel,
        contents: {
          parts: [{ text: options.prompt.trim() }],
        },
        config: configForModel(primaryModel),
      });
    } catch (err: any) {
      try {
        response = await ai.models.generateContent({
          model: fallbackModel,
          contents: {
            parts: [{ text: options.prompt.trim() }],
          },
          config: configForModel(fallbackModel),
        });
      } catch (fallbackErr: any) {
        this.handleGeminiError(fallbackErr);
      }
    }

    return this.extractImageResult(response, "gemini", primaryModel, options.aspectRatio);
  }

  async editImage(options: GenerateImageOptions): Promise<GenerateImageResult> {
    const ai = await this.getAIClient();
    const aspectRatio = options.aspectRatio || "1:1";

    if (!options.imageBase64) {
      throw new Error("Reference image base64 data is required for image editing.");
    }

    const cleanBase64 = options.imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
    const mimeType = options.mimeType || "image/png";

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
            {
              text: options.prompt.trim(),
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio,
          },
        },
      });
    } catch (err: any) {
      this.handleGeminiError(err);
    }

    return this.extractImageResult(response, "gemini", "gemini-3.1-flash-image", options.aspectRatio);
  }

  private extractImageResult(
    response: any,
    provider: string,
    model: string,
    aspectRatio?: string
  ): GenerateImageResult {
    let imageUrl: string | null = null;
    let note: string | null = null;

    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          note = part.text;
        }
      }
    }

    if (!imageUrl) {
      throw new Error(note || "No image data was returned by the Gemini model.");
    }

    return {
      imageUrl,
      provider,
      model,
      note: note || undefined,
      aspectRatio: aspectRatio || "1:1",
    };
  }

  private handleGeminiError(err: any): never {
    const msg = err?.message || String(err);
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("Quota exceeded")) {
      throw new ProviderQuotaError(
        "Free image-generation credits have been exhausted. Try again later or connect a paid provider."
      );
    }
    if (msg.includes("401") || msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
      throw new ProviderAuthError("Image provider authentication is missing.");
    }
    if (msg.includes("503") || msg.includes("UNAVAILABLE")) {
      throw new ProviderUnavailableError("Image generation is temporarily unavailable.");
    }
    throw new Error(msg || "Image generation failed");
  }
}
