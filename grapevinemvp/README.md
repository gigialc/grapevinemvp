# Grapevine 🍇

Grapevine is a platform designed to connect passionate developers, designers, and creators to collaborate on projects. It allows users to showcase their work, discover interesting projects, and find collaborators for their own initiatives.

## Features

- **User Authentication**: Secure login and signup system
- **Project Showcase**: Upload and display your projects with images and descriptions
- **Explore Projects**: Discover projects from other users with search and filtering capabilities
- **Collaboration**: Connect with other users to collaborate on projects
- **Profile Management**: Customize your profile to showcase your skills and interests
- **Real-time Interaction**: Live collaboration features

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI, Chakra UI, Material UI
- **Styling**: Tailwind CSS, Emotion
- **Image Handling**: Cloudinary
- **Icons**: FontAwesome, React Icons

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grapevine.git
   cd grapevine
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app`: Main application routes and components
  - `/components`: Reusable UI components
  - `/api`: API routes for backend functionality
  - `/login`, `/signup`: Authentication pages
  - `/exploreProjects`: Project discovery
  - `/project`: Individual project viewing
  - `/add-project`: Project creation
  - `/profile`: User profile management
- `/models`: MongoDB schemas and models
- `/lib`: Utility functions and helpers
- `/public`: Static assets

## Deployment

The application can be deployed using Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- MongoDB team for the powerful database
- All contributors and users of the platform
