# Image Gallery Component

This component implements a Threads-like image display pattern for posts in the mobile app with a dynamic layout system.

## Features

### Single Image Layout
- **Width**: Fills available post width (minus padding)
- **Height**: Square aspect ratio (1:1) that fills full width
- **Aspect Ratio**: Maintains original aspect ratio with `resizeMode="cover"`
- **Rounded Corners**: 16px border radius for modern look
- **Square Layout**: Creates a perfect square that fills the post width

### Two Images Layout
- **Width**: Split evenly (50% each) with 8px gap
- **Height**: Square aspect ratio matching the width
- **Side by Side**: Two images displayed next to each other
- **Consistent Sizing**: Both images are the same size

### Three+ Images Layout
- **First Two**: Same size as 2-image layout (split evenly)
- **Additional Images**: Same size as first two but hang over for scrolling
- **Horizontal Scrolling**: Smooth scrolling for overflow images
- **Gap**: 8px spacing between all images
- **Consistent Sizing**: First two fill available space, additional images match that size

## Implementation Details

### Component Structure
- `ImageGallery.tsx` - Main component handling dynamic layouts based on image count
- Integrated into `PostCard.tsx` for feed display
- Integrated into post detail page for full-size viewing

### Layout Logic
- **1 image**: Full-width square using `aspect-square`
- **2 images**: Even split with `flex-row` and calculated widths
- **3+ images**: First two same size as 2-image layout, additional images same size but hang over

### State Management
- Loading states for each image with spinner overlay
- Error handling with fallback UI
- Individual image tracking for better UX
- 10-second timeout for loading states to prevent infinite spinners

### Responsive Design
- Calculates available width based on screen dimensions
- Dynamic sizing based on image count
- Maintains consistent spacing across devices
- Adapts layout automatically based on number of images

## Usage

```tsx
import ImageGallery from './components/ImageGallery';

// In your post component
<ImageGallery 
  images={post.attachments.filter(a => a.type === "image")}
  onImagePress={() => router.push(`/post/${post.id}`)}
/>
```

## Test Data

The seed data now includes test posts with:
- Single image posts (full-width square)
- Two image posts (evenly split squares)
- Multi-image posts (first 2 same size as 2-image layout, additional images hang over)
- Various aspect ratios (landscape, portrait, square, ultra-wide, ultra-tall)

## Styling

- Uses Tailwind CSS classes via `tw` utility
- Consistent with app's dark theme
- Loading and error states match app's design system
- Smooth animations and transitions
- Dynamic layout ensures optimal use of available space

## Layout Behavior

### Single Images
- Expand to fill available post width
- Maintain square aspect ratio (1:1)
- Creates a perfect square that fills the post

### Two Images
- Split available width evenly (minus gap)
- Both images are the same size
- Side-by-side layout with consistent spacing

### Three+ Images
- First two images are the same size as in a 2-image post (split evenly)
- Additional images are the same size as the first two
- Additional images hang over the edge for horizontal scrolling
- Creates a natural "peek" at additional content while maintaining visual consistency

## Performance Optimizations

### Image Loading Speed
- **Immediate Loading**: All images start loading immediately when component mounts
- **Reduced Timeouts**: Loading timeout reduced from 10s to 5s for faster fallbacks
- **Progressive Rendering**: Images render progressively for better perceived performance
- **No Fade Animations**: `fadeDuration={0}` eliminates loading fade delays

### State Management
- **Efficient Loading States**: Individual image loading tracking prevents unnecessary re-renders
- **Background Loading**: Images load in background while maintaining UI responsiveness
- **Smart Error Handling**: Fast fallbacks when images fail to load
- **Memory Optimization**: Loading states are cleaned up properly to prevent memory leaks

## Future Enhancements

- Image pinch-to-zoom functionality
- Full-screen image viewer
- Image carousel with pagination dots
- Lazy loading for better performance
- Image preloading for smoother scrolling
- Custom aspect ratio options for single images
- Dynamic sizing based on image content
