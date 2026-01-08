import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RecentlyViewedTracker() {
  const location = useLocation();

  useEffect(() => {
    // Check if current path is a product details page
    const match = location.pathname.match(/^\/product\/([a-zA-Z0-9-]+)$/);
    
    if (match) {
      const productId = match[1];
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      
      // Remove if exists to push to top (most recent)
      const newViewed = viewed.filter((id) => id !== productId);
      newViewed.unshift(productId);
      
      // Limit to 10 items
      if (newViewed.length > 10) newViewed.pop();
      
      localStorage.setItem("recentlyViewed", JSON.stringify(newViewed));
    }
  }, [location]);

  return null;
}