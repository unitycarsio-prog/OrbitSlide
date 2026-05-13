export const fetchPexelsImage = async (query: string): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
    if (!apiKey) {
      console.warn("PEXELS_API_KEY is not set.");
      return null;
    }
  
    try {
      const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
        headers: {
          Authorization: apiKey
        }
      });
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large;
      }
    } catch (error) {
      console.error("Error fetching Pexels image:", error);
    }
    return null;
  };
