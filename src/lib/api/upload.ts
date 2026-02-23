import { client } from './client';
import { toApiChallengeId } from './challengeId';

interface SingleImageUploadResponse {
  imageUrl?: string;
  fileUrl?: string;
}

interface PostImagesUploadResponse {
  imageUrls?: string[];
}

export async function uploadPostImages(challengeId: string, files: File[]): Promise<string[]> {
  const normalizedChallengeId = toApiChallengeId(challengeId);
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await client.post<PostImagesUploadResponse>(
    `/challenges/${normalizedChallengeId}/posts/images`,
    formData,
  );

  return response.imageUrls || [];
}

export async function uploadChallengeBanner(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post<SingleImageUploadResponse>('/uploads/challenges/banner', formData);
  return response.imageUrl || response.fileUrl || '';
}

export async function uploadChallengeThumbnail(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post<SingleImageUploadResponse>('/uploads/challenges/thumbnail', formData);
  return response.imageUrl || response.fileUrl || '';
}

export async function uploadUserProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post<SingleImageUploadResponse>('/users/me/profile-image', formData);
  return response.imageUrl || response.fileUrl || '';
}
