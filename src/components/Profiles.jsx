import { Title, ArrowUR } from './ui.jsx'

const PROFILES = [
  { name: 'LeetCode', handle: '@umeshchandran', href: 'https://leetcode.com/umeshchandran' },
  { name: 'CodeChef', handle: '@umeshyenugula', href: 'https://www.codechef.com/users/umeshyenugula' },
  { name: 'HackerRank', handle: '@24241A05AV', href: 'https://www.hackerrank.com/24241A05AV' },
]

export default function Profiles() {
  return (
    <section id="profiles" className="sec">
      <div className="sec-head">
        <Title>Coding profiles</Title>
        <p className="sec-note">Where the practice happens.</p>
      </div>
      <div className="prof-list">
        {PROFILES.map((p) => (
          <a key={p.name} className="prof" href={p.href} target="_blank" rel="noopener noreferrer" data-reveal data-cursor="Open">
            <span className="prof-name">{p.name}</span>
            <span className="prof-handle">{p.handle}</span>
            <ArrowUR />
          </a>
        ))}
      </div>
    </section>
  )
}
