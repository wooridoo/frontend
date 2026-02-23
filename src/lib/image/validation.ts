export type ImagePolicyKey =
  | 'POST_ATTACHMENT'
  | 'CHALLENGE_BANNER'
  | 'CHALLENGE_THUMBNAIL'
  | 'USER_PROFILE';

interface ResolutionRule {
  exact?: { width: number; height: number };
  min?: { width: number; height: number };
}

interface ImagePolicy {
  maxCount: number;
  maxSizeBytes: number;
  resolution?: ResolutionRule;
}

const MB = 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

const POLICIES: Record<ImagePolicyKey, ImagePolicy> = {
  POST_ATTACHMENT: {
    maxCount: 10,
    maxSizeBytes: 20 * MB,
  },
  CHALLENGE_BANNER: {
    maxCount: 1,
    maxSizeBytes: 6 * MB,
    resolution: { exact: { width: 2048, height: 1152 } },
  },
  CHALLENGE_THUMBNAIL: {
    maxCount: 1,
    maxSizeBytes: 4 * MB,
    resolution: { min: { width: 128, height: 128 } },
  },
  USER_PROFILE: {
    maxCount: 1,
    maxSizeBytes: 4 * MB,
    resolution: { min: { width: 128, height: 128 } },
  },
};

function getFileExtension(name: string): string {
  const tokens = name.split('.');
  if (tokens.length < 2) return '';
  return tokens[tokens.length - 1].toLowerCase();
}

function isSupportedFormat(file: File): boolean {
  const extension = getFileExtension(file.name);
  if (ALLOWED_EXTENSIONS.has(extension)) {
    return true;
  }
  const mime = file.type.toLowerCase();
  return mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/webp';
}

function readImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      reject(new Error('이미지 해상도를 확인할 수 없습니다.'));
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });
}

export async function validateImageFiles(policyKey: ImagePolicyKey, files: File[]): Promise<void> {
  const policy = POLICIES[policyKey];
  if (files.length === 0) return;

  if (files.length > policy.maxCount) {
    throw new Error(`이미지는 최대 ${policy.maxCount}장까지 업로드할 수 있습니다.`);
  }

  for (const file of files) {
    if (!isSupportedFormat(file)) {
      throw new Error('지원하지 않는 이미지 형식입니다. jpg/jpeg/png/webp만 허용됩니다.');
    }

    if (file.size > policy.maxSizeBytes) {
      const maxMb = Math.floor(policy.maxSizeBytes / MB);
      throw new Error(`이미지 크기는 ${maxMb}MB 이하여야 합니다.`);
    }

    if (!policy.resolution) {
      continue;
    }

    const { width, height } = await readImageSize(file);
    if (policy.resolution.exact) {
      const { exact } = policy.resolution;
      if (width !== exact.width || height !== exact.height) {
        throw new Error(`이미지 해상도는 ${exact.width}x${exact.height}px 이어야 합니다.`);
      }
      continue;
    }

    if (policy.resolution.min) {
      const { min } = policy.resolution;
      if (width < min.width || height < min.height) {
        throw new Error(`이미지 해상도는 최소 ${min.width}x${min.height}px 이상이어야 합니다.`);
      }
    }
  }
}

export async function validateSingleImageFile(policyKey: ImagePolicyKey, file: File): Promise<void> {
  await validateImageFiles(policyKey, [file]);
}
