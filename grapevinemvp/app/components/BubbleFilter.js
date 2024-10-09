
import React from "react"
import { Button } from "@/components/ui/button"

const BubbleFilter = ({ skills, selectedSkills, onSkillToggle }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {skills.map((skill) => (
        <Button
          key={skill}
          variant={selectedSkills.includes(skill) ? "default" : "outline"}
          size="sm"
          onClick={() => onSkillToggle(skill)}
          className="rounded-full"
        >
          {skill}
        </Button>
      ))}
    </div>
  )
}

export default BubbleFilter