'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AddReviewFormProps {
  productId: string;
}

const AddReviewForm = ({ productId }: AddReviewFormProps) => {
  const { user, addReview } = useApp();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating > 0 && comment.trim() !== '' && user) {
      addReview(productId, {
        name: user.name,
        rating,
        comment: comment.trim(),
        helpful: 0
      });
      
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-medium dark:text-white">Write a review</h3>
      
      <div className="flex items-center gap-1 my-2">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={cn(
              "h-6 w-6 cursor-pointer",
              (hoverRating || rating) >= star 
                ? "text-yellow-400 fill-current" 
                : "text-slate-300 dark:text-slate-600"
            )}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      
      <Textarea
        placeholder="Share your thoughts on this product..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-2"
      />
      
      <Button 
        type="submit" 
        className="mt-2" 
        disabled={!rating || !comment.trim()}
      >
        Submit Review
      </Button>
    </form>
  );
};

export { AddReviewForm };