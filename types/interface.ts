import { ApiError, GenerateContentResponseUsageMetadata } from "@google/genai";

interface SuccessResponse {
  success: true;
  message: string;
  data: {
    content: string;
    usage?: GenerateContentResponseUsageMetadata;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  data: {
    error?: ApiError;
  };
}

export type ResponseData = SuccessResponse | ErrorResponse;

export interface Result {
  data: string[];
  usage: object[];
}
