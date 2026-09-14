import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { ContactLinks } from "@/components/contact-links";
import { Highlights } from "@/components/highlights";
import { Organization } from "@/components/organization";
import { Profile } from "@/components/profile";
import { Role } from "@/components/role";
import { Section } from "@/components/section";
import { SectionNav } from "@/components/section-nav";
import { SkillGroup } from "@/components/skill-group";
import { SplitLayout } from "@/components/split-layout";
import { encodeEmail } from "@/lib/email";

export const getStaticProps = (() => ({
  props: { email: encodeEmail("onsmith13@gmail.com") },
})) satisfies GetStaticProps;

const name = "Aaron J Smith";
const summary =
  "Computer science Ph.D. specializing in video coding and compression, now building exabyte-scale storage and network systems at AWS in Rust; US patent in layered video coding, former UNC professor.";

export default function Home({ email }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{name}</title>
        <meta name="description" content={summary} />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={summary} />
        <meta property="og:url" content="https://www.onsmith.com/" />
        <meta property="og:image" content="https://www.onsmith.com/headshot.jpg" />
        <meta property="og:type" content="profile" />
      </Head>
      <SplitLayout
        sidebar={
          <Profile
            name={name}
            role="Software Development Engineer at Amazon Web Services"
            location="Durham, NC"
            headshot="/headshot.jpg"
            summary={summary}
            contacts={
              <ContactLinks
                linkedin="https://www.linkedin.com/in/onsmith13/"
                github="https://github.com/onsmith"
                email={email}
              />
            }
            resume="/resume.pdf"
            nav={
              <SectionNav
                sections={[
                  { id: "experience", title: "Experience" },
                  { id: "education", title: "Education" },
                  { id: "skills", title: "Skills" },
                ]}
              />
            }
          />
        }
      >
        <Section id="experience" title="Experience">
          <Organization
            name="Amazon Web Services"
            title="Software Development Engineer"
            location="Raleigh, NC"
            dates="July 2022 – Present"
          >
            <Role title="Network Product Development" dates="May 2025 – Present">
              <Highlights summary="The Rust replacement for AWS’s legacy switch agent, translating Linux kernel network state into ASIC hardware">
                <li>
                  Owned the specification of correct daemon behavior, adopted as the team’s ground truth, enforced by
                  property-based testing over random event sequences; mentored an engineer through the event generator
                </li>
                <li>
                  Root-caused and fixed defects in the daemon’s core data path: a kernel-to-hardware desynchronization
                  traced through the Linux kernel source to conflicting definitions of route identity, and a deadlock
                  where ACL entries with identical content shared one key while the Myers diff addressed them by position
                </li>
                <li>
                  Moved the team off legacy release pipelines onto a dedicated pipeline gating on lint, unit and
                  integration tests, and a pre-production stage of physical switches; showcased org-wide as a model for
                  other teams
                </li>
              </Highlights>
            </Role>
            <Role title="Amazon S3" dates="July 2022 – May 2025">
              <Highlights summary="Amazon S3 Vectors, a new public vector storage service">
                <li>
                  Owned the public API design as an early engineer, driving the design review with principal engineers
                  and the security team before authoring the spec in Smithy
                </li>
                <li>
                  Delivered an asynchronous compaction service that raised sustained per-index PUT throughput 8x to 40
                  MB/s, removing compaction from the customer request path
                </li>
              </Highlights>
              <Highlights summary="Log compression, the Rust format behind Amazon’s exabyte-scale logging fleet">
                <li>
                  Owned the state machine and the auto-detection behind zero-config onboarding, which unlocked
                  fleet-wide adoption and nine-figure annual storage savings
                </li>
                <li>
                  Drove adoption across S3’s index services and seven log-reader libraries, writing the Java and Python
                  bindings that unblocked those teams; led three engineers building fleet-wide tracking of unrealized
                  compression savings
                </li>
                <li>
                  Uncovered a log data-loss risk in a gzip-to-Zstandard migration, reproducing it by stress-testing
                  service restarts until an ungraceful shutdown corrupted logs; designed the mitigation that kept the
                  migration on schedule
                </li>
                <li>
                  Led a real-time Apache Iceberg ingestion system for the same log data from prototype to production at
                  petabytes per day, decomposing the design across two engineers
                </li>
              </Highlights>
            </Role>
          </Organization>
          <Organization
            name="University of North Carolina at Chapel Hill"
            title="Teaching Assistant Professor"
            dates="July 2021 – July 2022"
          >
            <Highlights
              summary={
                <>
                  Taught Foundations of Programming, Models of Languages and Computation, and a special-topics course
                  in data compression, two per semester with roughly 300 students and 15 paid learning assistants (
                  <a href="https://www.ratemyprofessors.com/professor/2619092">Rate My Professors</a>)
                </>
              }
            />
          </Organization>
        </Section>
        <Section id="education" title="Education">
          <Organization name="University of North Carolina at Chapel Hill">
            <Role title="Ph.D., Computer Science, “Receiver-Driven Video Adaptation”" dates="August 2014 – August 2021">
              <Highlights>
                <li>
                  Designed a rate-sorted entropy coder that sorts arithmetically coded symbols into quality layers a
                  receiver can drop with no extra signaling; US{" "}
                  <a href="https://patents.google.com/patent/US11212531">patent</a>,{" "}
                  <a href="https://doi.org/10.17615/tn4j-yt38">dissertation</a>, and an M-JPEG{" "}
                  <a href="https://github.com/onsmith/layered-ac">reference coder</a> in Java
                </li>
                <li>
                  Residual-domain HEVC/H.265 <a href="https://github.com/onsmith/hm-residual-transrater">transrater</a>{" "}
                  in C++ on the HM reference software, retargeting bitrate by requantizing coded residuals rather than
                  fully decoding and re-encoding
                </li>
              </Highlights>
            </Role>
            <Role title="M.S., Computer Science" dates="December 2019">
              <Highlights>
                <li>
                  Proposed a frameless camera sensor architecture that times how long each pixel takes to gather a
                  configurable amount of light, instead of how much light it gathers per frame, producing an
                  asynchronous high dynamic range pixel stream; NOSSDAV 2017{" "}
                  <a href="https://doi.org/10.1145/3083165.3083178">paper</a>
                </li>
              </Highlights>
            </Role>
          </Organization>
          <Organization name="Coastal Carolina University">
            <Role title="B.S. in Computer Science and Applied Mathematics, 4.0 GPA" dates="May 2014" />
          </Organization>
        </Section>
        <Section id="skills" title="Skills">
          <SkillGroup label="Languages" skills={["Rust", "Java", "Python", "C++", "C", "TypeScript", "SQL"]} />
          <SkillGroup
            label="Media & compression"
            skills={["H.265/HEVC", "H.264/AVC", "M-JPEG", "FFmpeg", "Arithmetic coding", "Zstandard", "gzip"]}
          />
          <SkillGroup
            label="Systems"
            skills={[
              "AWS (S3, DynamoDB, ECS/Fargate, Lambda)",
              "Distributed systems",
              "Smithy",
              "gRPC",
              "Linux networking (netlink)",
            ]}
          />
        </Section>
      </SplitLayout>
    </>
  );
}
