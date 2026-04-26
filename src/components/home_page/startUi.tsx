import { Star, StarHalf, StarOff } from "lucide-react"

export default function StarsUi({ stars = 0 }: { stars: number }) {
  // Ensure stars is a valid number and clamped between 0 and 5
  const validStars = Math.min(5, Math.max(0, Number(stars) || 0));

  const fullStars = Math.floor(validStars);
  const hasHalfStar = validStars % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
      ))}
      {hasHalfStar && <StarHalf className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-200 fill-gray-100" />
      ))}
    </div>
  );
}