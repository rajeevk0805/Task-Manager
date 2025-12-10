# Task Manager Application

## Profile Image Handling

This application now uses Cloudinary exclusively for profile image storage. This ensures images persist across deployments and server restarts.

## Cloudinary Setup (Required)

Cloudinary is now required for the application to function properly. To set it up:

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Obtain your Cloud Name, API Key, and API Secret from the Cloudinary dashboard
3. Add the following environment variables to your deployment platform:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Fallback Handling

All profile image displays include fallback handling:
- If a user has no profile image, a placeholder is shown
- If a profile image fails to load, a placeholder is shown instead

This ensures a consistent user experience even when image loading fails.