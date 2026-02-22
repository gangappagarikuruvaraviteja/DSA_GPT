import { dsaTopics } from "../../data/dsaTopics";
import "./DSASection.css";
import { useState } from "react";

export default function DSASection() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="dsa-section">
      <h3 className="dsa-heading">📚 DSA Roadmap</h3>

      {dsaTopics.map((topic) => (
        <div key={topic.id} className="dsa-topic">
         <div
  className={`dsa-title ${selected === topic.id ? "active" : ""}`}
  onClick={() =>
    setSelected(selected === topic.id ? null : topic.id)
  }
>
  {topic.title}
</div>


          {selected === topic.id && (
            <div className="dsa-content">
              <h4>Concepts</h4>
              <ul>
                {topic.concepts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>

              <h4>Practice Problems</h4>
              <ul>
                {topic.problems.map((p, i) => (
                  <li key={i} className="problem-item">
  <a
    href={p.url}
    target="_blank"
    rel="noopener noreferrer"
    className="problem-link"
  >
    {p.name}
  </a>

  <span className={`tag ${p.difficulty.toLowerCase()}`}>
    {p.difficulty}
  </span>
</li>

                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
