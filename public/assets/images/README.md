# How to Replace the Logo

## Steps to replace the LAMA logo with your own:

1. **Save your logo file** in the `public/assets/images/` directory
2. **Supported formats**: PNG, JPG, SVG, WebP
3. **Recommended size**: 100px width, proportional height
4. **File naming**: Use a descriptive name like `lama-logo.png` or `lama-logo.svg`

## Update the logo reference:

In both `src/app/page.tsx` and `src/app/register/page.tsx`, update the Image component:

```jsx
<Image
  src="/assets/images/your-logo-file.png" // Change this path
  alt="LAMA Pet Care Logo"
  width={100} // Adjust width as needed
  height={34} // Adjust height as needed
  className="cursor-pointer"
/>
```

## Current Logo Location:

- Login page: Top-left corner, clickable
- Register page: Top-left corner, clickable, links back to login

## Logo Features:

- ✅ Positioned in top-left corner (instead of centered above form)
- ✅ Clickable/navigational
- ✅ Responsive design
- ✅ Proper spacing from edges
- ✅ High z-index for proper layering
