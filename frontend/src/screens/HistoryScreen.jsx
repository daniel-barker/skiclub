import React from "react";
import { Container } from "react-bootstrap";
import "../assets/css/ContentScreens.css";

const HistoryScreen = () => {
  return (
    <Container className="content-screen">
      <h1>About PowderPost</h1>
      <section>
        <h2>
          <em>The PowderPost Story: 1978 to Present</em>
        </h2>
        <h6>
          <em>
            Compiled by Emma Winters, Club Historian
          </em>
        </h6>
        <p>
          PowderPost Ski Club was born during the legendary winter of 1978, when five friends—Alex Chen, Sophia Rodriguez, Marcus Williams, Leila Patel, and James Thornton—found themselves stranded at a remote mountain lodge during an unprecedented three-day blizzard. During those snow-bound days, they conceived a vision for a club dedicated not just to skiing, but to the perfect pursuit of powder snow in all its forms. Their founding principle remains our motto today: "Seek the deepest snow, forge the strongest bonds."
        </p>
        <p>
          By the early 1980s, PowderPost had grown from its original five members to over fifty passionate skiers and snowboarders. The club made headlines in 1983 when it pioneered the region's first member-operated snowcat service, allowing access to backcountry terrain decades before such adventures became mainstream. This spirit of innovation has remained central to our identity, with PowderPost members consistently at the forefront of winter sports evolution.
        </p>
        <p>
          The club's current lodge was acquired in 1987 after a remarkable fundraising campaign led by founding member Sophia Rodriguez. What began as a dilapidated former hunting cabin has been transformed through countless volunteer weekends into the warm, welcoming space we enjoy today. The iconic timber frame addition, completed in 1995, was built entirely by club members, many of whom learned carpentry skills specifically for the project.
        </p>
        <p>
          Throughout the 1990s, PowderPost developed its reputation for environmental stewardship. The club established one of the region's first forest conservation programs, working with local authorities to protect the mountain watershed and ensure sustainable recreational access. Our annual "Spring Cleanup" event, which removes trash from trails and waterways after the snow melts, has become a community-wide tradition that extends far beyond our membership.
        </p>
        <p>
          The early 2000s saw PowderPost embrace the emerging freestyle and backcountry skiing movements. Under the leadership of then-president Maya Yoshida, the club established a youth development program that has produced three Olympic athletes and countless passionate lifelong skiers. Our commitment to introducing new generations to the joy of snow sports remains unwavering, with subsidized lessons and equipment available to members' children and local youth.
        </p>
        <p>
          In recent years, PowderPost has focused on inclusivity and accessibility, working to ensure that the joy of winter sports is available to everyone regardless of background or ability. Our adaptive skiing program, launched in 2015, provides specialized equipment and instruction for people with disabilities. Meanwhile, our diversity scholarship fund helps remove financial barriers to participation in snow sports.
        </p>
        <p>
          Today, with over 300 active members spanning multiple generations, PowderPost continues to evolve while honoring the vision of its founders. Whether you're seeking epic powder days, lasting friendships, or simply a cozy place to gather after a day on the mountain, we welcome you to become part of our ongoing story.
        </p>
      </section>
    </Container>
  );
};

export default HistoryScreen;
