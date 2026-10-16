// ============================================================================
// PORTFOLIO STORAGE & SHARING SERVICE (Cloud Database & Local Registry)
// ============================================================================
// Stores customized portfolio data to a cloud backend and local cache,
// generating clean, short unique IDs (e.g. ?id=xyz) so that links shared
// on WhatsApp, Instagram, or social media remain clean and clutter-free
// without any long base64 query strings.
// ============================================================================

const CLOUD_API_ENDPOINT = 'https://api.restful-api.dev/objects';
const LOCAL_REGISTRY_KEY = 'portfolio_registry';

export interface SavedPortfolioResult {
  id: string;
  slug: string;
  shareUrl: string;
}

export function generateProfileSlug(fullName: string, firstName: string): string {
  const name = fullName.trim() || firstName.trim() || 'creator';
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'creator'
  );
}

/**
 * Saves a portfolio object to the local browser registry cache.
 */
export function saveToLocalRegistry(key: string, profile: any): void {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRY_KEY) || '{}';
    const registry = JSON.parse(raw);
    registry[key] = profile;
    localStorage.setItem(LOCAL_REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.warn('Failed to save to local portfolio registry', e);
  }
}

/**
 * Retrieves a portfolio object from the local browser registry cache.
 */
export function getFromLocalRegistry(key: string): any | null {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRY_KEY) || '{}';
    const registry = JSON.parse(raw);
    return registry[key] || null;
  } catch {
    return null;
  }
}

/**
 * Saves the portfolio profile into the cloud database and caches it locally.
 * Returns a short unique ID and a clean, clutter-free shareable URL.
 */
export async function savePortfolioToCloud(
  profile: any,
  origin: string,
  pathname: string
): Promise<SavedPortfolioResult> {
  const slug = generateProfileSlug(profile.fullName || '', profile.firstName || '');
  // Deterministic or time-based fallback ID for offline / local mode
  const fallbackId = `${slug}-${Date.now().toString(36)}`;

  // 1. Immediately cache in local registry
  saveToLocalRegistry(slug, profile);
  saveToLocalRegistry(fallbackId, profile);

  let cloudId = fallbackId;

  // 2. Persist to cloud database
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(CLOUD_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `portfolio_${slug}`,
        data: profile
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const result = await response.json();
      if (result && result.id) {
        cloudId = result.id;
        // Also cache under the cloud ID
        saveToLocalRegistry(cloudId, profile);
      }
    }
  } catch (error) {
    console.warn('Cloud database sync fallback to local ID:', error);
  }

  // 3. Construct clean, short share URL
  const shareUrl = `${origin}${pathname}?id=${encodeURIComponent(cloudId)}`;

  return {
    id: cloudId,
    slug,
    shareUrl
  };
}

/**
 * Fetches a saved portfolio profile by its unique ID or slug.
 * Checks local cache first for instant rendering, then falls back to cloud DB.
 */
export async function fetchPortfolioFromCloud(idOrSlug: string): Promise<any | null> {
  if (!idOrSlug) return null;

  // 1. Check local cache first (instant response)
  const cached = getFromLocalRegistry(idOrSlug);
  if (cached) return cached;

  // 2. Fetch from cloud database
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(
      `${CLOUD_API_ENDPOINT}/${encodeURIComponent(idOrSlug)}`,
      {
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (response.ok) {
      const result = await response.json();
      if (result && result.data) {
        // Cache locally for subsequent visits
        saveToLocalRegistry(idOrSlug, result.data);
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Could not fetch portfolio from cloud database:', error);
  }

  return null;
}

/**
 * Compresses an uploaded image file on the client side using HTML5 Canvas.
 * Produces a lightweight JPEG data URL (~50-100KB) suitable for fast rendering
 * and persistent storage in localStorage / cloud database.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 750,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(event.target?.result as string);
          }
        } catch {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

