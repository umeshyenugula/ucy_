const PROFILES = [
  { name: 'LeetCode', handle: '@umeshchandran', href: 'https://leetcode.com/umeshchandran' },
  { name: 'CodeChef', handle: '@umeshyenugula', href: 'https://www.codechef.com/users/umeshyenugula' },
  { name: 'HackerRank', handle: '@24241A05AV', href: 'https://www.hackerrank.com/24241A05AV' },
]

export default function CodingProfiles() {
  return (
    <section className="scene">
      <div className="scene-head" data-reveal>
        <div>
          <div className="eyebrow">Profiles</div>
          <h2 className="scene-title">Coding Profiles</h2>
        </div>
      </div>
      <div id="profiles-row">
        {PROFILES.map((p, i) => (
          <a
            key={p.name}
            className="profile-card frame"
            data-reveal
            data-reveal-d={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="pc-top">
              <span>Rank</span>
              <span>↗</span>
            </div>
            <h4>{p.name}</h4>
            <div className="handle">{p.handle}</div>
          </a>
        ))}
      </div>
    </section>
  )
}
