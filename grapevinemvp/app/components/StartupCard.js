import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Briefcase, MapPin, Search, Users } from "lucide-react"

// Mock data for job listings
const jobListings = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "TechNova",
    location: "San Francisco, CA",
    teamSize: 12,
    keyPeople: [
      { name: "Sarah Chen", role: "CTO", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Alex Rodriguez", role: "Lead Developer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "GrowthLab",
    location: "New York, NY",
    teamSize: 8,
    keyPeople: [
      { name: "Emily Watson", role: "CEO", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "Michael Lee", role: "Head of Product", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignWave",
    location: "Remote",
    teamSize: 15,
    keyPeople: [
      { name: "Olivia Martinez", role: "Design Lead", avatar: "/placeholder.svg?height=40&width=40" },
      { name: "David Kim", role: "Senior Designer", avatar: "/placeholder.svg?height=40&width=40" },
    ],
  },
]

export default function StartupPeopleJobBoard() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Startup People Job Board</h1>
      
      <div className="flex space-x-4 mb-8">
        <div className="flex-1">
          <Input placeholder="Search jobs or people" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sf">San Francisco</SelectItem>
            <SelectItem value="ny">New York</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobListings.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center mb-2">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{job.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Team of {job.teamSize}</span>
              </div>
              <Separator className="my-4" />
              <h4 className="font-semibold mb-2">Key People You'll Work With:</h4>
              <div className="flex flex-col space-y-3">
                {job.keyPeople.map((person, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{person.name}</p>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Briefcase className="mr-2 h-4 w-4" /> Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}