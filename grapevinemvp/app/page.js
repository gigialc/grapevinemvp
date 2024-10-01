import ProjectCard from './components/ProjectCard'

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Discover Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          title="AI-Powered Art Generator"
          description="Looking for developers and artists to create an AI that generates unique artwork."
          skills={["AI/ML", "Art", "Programming"]}
        />
        {/* Add more ProjectCard components here */}
      </div>
    </main>
  )
}