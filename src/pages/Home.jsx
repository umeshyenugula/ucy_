import { useReveal } from '../hooks/useReveal.js'
import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Education from '../components/Education.jsx'
import Skills from '../components/Skills.jsx'
import Achievement from '../components/Achievement.jsx'
import LeadershipCoursework from '../components/LeadershipCoursework.jsx'
import CodingProfiles from '../components/CodingProfiles.jsx'
import ProjectsPreview from '../components/ProjectsPreview.jsx'
import Contact from '../components/Contact.jsx'

export default function Home({ onNavigate }) {
  useReveal(['home'])

  return (
    <>
      <Hero />
      <About />
      <Education />
      <Skills />
      <Achievement />
      <LeadershipCoursework />
      <CodingProfiles />
      <ProjectsPreview onNavigate={onNavigate} />
      <Contact onNavigate={onNavigate} />
    </>
  )
}
