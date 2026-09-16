const gumroadUrl = "https://vitacore11.gumroad.com/l/gut?wanted=true";

const symptomCards = [
  {
    title: "Bloating",
    text: "That stretched, uncomfortable feeling after meals can make everyday routines feel harder to predict and a little more draining than they should be.",
  },
  {
    title: "Fatigue",
    text: "Low energy can show up when the day is already full, leaving you feeling flat, less focused, and less like yourself.",
  },
  {
    title: "Brain fog",
    text: "Mental cloudiness and a harder time concentrating can make food choices, planning, and day-to-day decisions feel more scattered.",
  },
  {
    title: "Mood changes",
    text: "A restless or unsettled feeling is not uncommon when digestion is off and your routine feels inconsistent.",
  },
  {
    title: "Food sensitivity concerns",
    text: "It can be frustrating to wonder which foods feel comfortable, which ones trigger discomfort, and what helps you stay steady.",
  },
  {
    title: "Disrupted sleep",
    text: "Feeling uncomfortable at night or waking up unsettled can make the next day start behind before it even begins.",
  },
];

const phases = [
  {
    number: "Phase 1",
    title: "Observe and Simplify",
    description:
      "Learn what a calmer daily rhythm looks like, identify patterns, and reduce the guesswork around meals and symptoms.",
  },
  {
    number: "Phase 2",
    title: "Nourish and Build",
    description:
      "Use familiar ingredients, practical meal guidance, and simple routines to create steadier habits that support digestive wellbeing.",
  },
  {
    number: "Phase 3",
    title: "Personalize and Continue",
    description:
      "Refine what helps you feel more comfortable, track what works, and carry that structure into everyday life beyond the initial 21 days.",
  },
];

const previewCards = [
  {
    image: "/Adult_preparing_healthy_food_bowl_2K_20260915211523.jpeg",
    title: "Meal roadmap",
    text: "A practical guide to building meals around familiar ingredients and simple, repeatable patterns.",
  },
  {
    image: "/Creating_product_photograph_for_…_2K_20260915211730.jpeg",
    title: "Recipe guidance",
    text: "Easy-to-follow recipe pages designed to make food choices feel less overwhelming and more doable.",
  },
  {
    image: "/Creating_product_photograph_for_…_2K_20260915211911.jpeg",
    title: "Shopping and structure",
    text: "A clear list of what to prepare, stock, and repeat so each week feels organized instead of chaotic.",
  },
  {
    image: "/Woman_holding_uncomfortable_abdo…_2K_20260915211044.jpeg",
    title: "Symptom tracker",
    text: "Reflection pages that help you notice patterns without turning your day into a constant cycle of trial and error.",
  },
  {
    image: "/Split-scene_digestive_wellbeing_…_2K_20260915211401.jpeg",
    title: "Food chart",
    text: "A practical reference for comparing meals, patterns, and routines in a way that feels manageable.",
  },
];

const faqItems = [
  {
    question: "Who is this program for?",
    answer:
      "This guide is for adults who want a calmer, more organized approach to bloating and digestive wellbeing. It is especially helpful if you are tired of juggling random online advice and want a structured 21-day plan based on familiar foods and daily routines.",
  },
  {
    question: "What format does it come in?",
    answer:
      "It is a digital document program designed to be viewed on common devices and printed if you prefer a paper version. You will have instant digital access as soon as you purchase.",
  },
  {
    question: "What is included?",
    answer:
      "The program includes a guided 21-day roadmap, recipe guidance, meal structure support, tracking pages, reflection tools, and practical habit-building prompts designed to help you create a more consistent routine.",
  },
  {
    question: "How does the 21-day structure work?",
    answer:
      "The program is organized as a step-by-step flow that helps you observe patterns, simplify food choices, build supportive routines, and then personalize what feels best for your day-to-day life.",
  },
  {
    question: "Do I need special ingredients or supplements?",
    answer:
      "No special ingredients or supplements are required by the program. The emphasis is on familiar kitchen ingredients, structured meal guidance, and consistent habits that support digestive wellbeing.",
  },
  {
    question: "What is the refund and guarantee process?",
    answer:
      "The program includes a 60-day money-back guarantee. If you decide it is not the right fit, you can request a refund within that period according to the current policy described at checkout.",
  },
  {
    question: "What should I do if my symptoms are severe, persistent, or new?",
    answer:
      "If you have persistent, severe, new, or concerning digestive symptoms, or if symptoms are affecting your daily life, it is important to speak with a qualified healthcare professional for individualized medical advice.",
  },
];

const testimonialImages = [
  {
    src: "/Neutral%20Simple%20Client%20Love%20Testimonial%20Instagram%20Post_20260916_083934_0000.png",
    alt: "Client testimonial graphic showing encouraging feedback about the program.",
  },
  {
    src: "/Green%20and%20Yellow%20Modern%20Simple%20Client%20Testimonial%20LinkedIn%20Post_20260916_084546_0000.png",
    alt: "Client testimonial graphic showing positive feedback and satisfaction with the program.",
  },
];

const supportingVisuals = [
  {
    src: "/Adult_preparing_healthy_food_bowl_2K_20260915211523.jpeg",
    alt: "A healthy, plant-forward meal setup that reflects the practical food-first approach of the program.",
  },
  {
    src: "/Creating_product_photograph_for_…_2K_20260915211730.jpeg",
    alt: "A lifestyle product photo showing the program book and supporting materials in a warm, editorial setting.",
  },
];

export function LandingPage() {
  return (
    <div className="mg-landing-page">
      <header className="mg-header">
        <div className="mg-brand-wrap">
          <span className="mg-brand-kicker">Modern Gut Health</span>
          <span className="mg-brand-name">The 21-Day Bloat Reset</span>
        </div>
        <a
          href={gumroadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mg-header-button"
        >
          Get the program
        </a>
      </header>

      <main className="mg-main">
        <section className="mg-hero">
          <div className="mg-hero-copy">
            <p className="mg-eyebrow">21-day guided document program</p>
            <h1>The 21-Day Bloat Reset.</h1>
            <h2>
              A calmer, more organized plan for bloating, digestive wellbeing, and
              daily food confidence.
            </h2>
            <p className="mg-lead">
              Natural recipes made with familiar kitchen ingredients, a daily roadmap,
              meal guidance, and trackers are all built into one practical system that
              helps you move from guesswork to a clearer routine.
            </p>
            <div className="mg-cta-row">
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mg-primary-button"
              >
                Start the 21-Day Program — $37
              </a>
              <a href="#product-preview" className="mg-secondary-button">
                See What&apos;s Inside
              </a>
            </div>
          </div>

          <div className="mg-hero-visual">
            <img
              src="/Split-scene_editorial_photograph…_2K_20260915211333.jpeg"
              alt="A woman in a relaxed wellness setting styled with a translucent digestive visualization to represent gut health support."
            />
            <div className="mg-floating-card">
              <span className="mg-floating-label">What it includes</span>
              <strong>Daily roadmap</strong>
              <small>Recipes + tracking + meal guidance</small>
            </div>
          </div>
        </section>

        <section className="mg-section mg-problem-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">The problem</p>
            <h3>Recurring digestive discomfort can throw off routines, food choices, confidence, and energy.</h3>
          </div>
          <p className="mg-section-intro">
            Random internet advice often makes the next step less clear. For many
            people, the challenge is not only how they feel, but also how to organize
            their meals, routines, and observations in a way that feels manageable.
          </p>
          <div className="mg-symptom-grid">
            {symptomCards.map((card) => (
              <article key={card.title} className="mg-symptom-card">
                <span className="mg-card-icon">•</span>
                <h4>{card.title}</h4>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mg-section mg-solution-section">
          <div className="mg-solution-copy">
            <p className="mg-eyebrow">The solution</p>
            <h3>An organized, food-first document program that turns complex gut-health information into a practical 21-day routine.</h3>
            <p>
              The 21-Day Bloat Reset is designed to help you simplify the process,
              understand your patterns, and build small daily habits that support
              digestive wellbeing without adding more overwhelm. It combines daily
              guidance, approachable recipes, reflection tools, and practical habit-building support in one place.
            </p>
          </div>
          <div className="mg-solution-visual">
            <img
              src="/Woman_holding_distended_abdomen_2K_20260915211017.jpeg"
              alt="A woman holding her abdomen, illustrating the discomfort and uncertainty many people experience around digestive wellness."
            />
          </div>
        </section>

        <section className="mg-section mg-journey-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">Your 21-day rhythm</p>
            <h3>A simple structure that helps you observe, nourish, and build momentum.</h3>
          </div>
          <div className="mg-phase-grid">
            {phases.map((phase) => (
              <article key={phase.number} className="mg-phase-card">
                <span className="mg-phase-number">{phase.number}</span>
                <h4>{phase.title}</h4>
                <p>{phase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="product-preview" className="mg-section mg-preview-section">
          <div className="mg-section-header mg-preview-header">
            <p className="mg-eyebrow">What&apos;s inside</p>
            <h3>A document program designed to feel clear, useful, and easy to keep going with.</h3>
          </div>

          <div className="mg-product-showcase">
            <div className="mg-product-image-wrap">
              <img
                src="/Creating_21-Day_Bloat_Reset_prog…_2K_20260915211721.jpeg"
                alt="The 21-Day Bloat Reset program cover and document preview."
              />
            </div>
            <div className="mg-product-details">
              <h4>Program overview</h4>
              <ul>
                <li>21-day guided document program for a calmer routine</li>
                <li>Daily roadmap to help reduce decision fatigue</li>
                <li>Familiar-food recipes and meal guidance</li>
                <li>Trackers and reflection prompts to help identify patterns</li>
                <li>Built for a clear, practical approach to digestive wellbeing</li>
              </ul>
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mg-primary-button"
              >
                Get the Complete Program — $37
              </a>
            </div>
          </div>

          <div className="mg-preview-grid">
            {previewCards.map((card) => (
              <article key={card.title} className="mg-preview-card">
                <img src={card.image} alt={card.title} />
                <div className="mg-preview-copy">
                  <h5>{card.title}</h5>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mg-program-checklist">
            <h4>Included in the program</h4>
            <ul>
              <li>Step-by-step 21-day roadmap</li>
              <li>Recipe guidance using familiar ingredients</li>
              <li>Meal structure and meal-planning support</li>
              <li>Reflection and tracking pages</li>
              <li>Simple habit-building prompts</li>
              <li>Printable or digital workflow for everyday use</li>
            </ul>
          </div>
        </section>

        <section className="mg-section mg-transformation-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">Before and after</p>
            <h3>From guesswork and reactive choices to a clearer routine that feels easier to stick with.</h3>
          </div>
          <div className="mg-transformation-grid">
            <div className="mg-compare-panel">
              <h4>Before</h4>
              <ul>
                <li>Guessing which foods matter</li>
                <li>Inconsistent routines</li>
                <li>Scattered advice and mixed signals</li>
                <li>Difficulty tracking patterns</li>
              </ul>
            </div>
            <div className="mg-compare-image">
              <img
                src="/Split-scene_digestive_wellbeing_…_2K_20260915211401.jpeg"
                alt="A before-and-after style wellness progression showing the shift from uncertainty toward a calmer, more structured digestion routine."
              />
            </div>
            <div className="mg-compare-panel">
              <h4>After</h4>
              <ul>
                <li>A clear daily plan</li>
                <li>Practical recipes and meal guidance</li>
                <li>Organized observations</li>
                <li>A routine you can personalize</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mg-section mg-visual-strip-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">A more grounded approach</p>
            <h3>Built around practical meals, clear structure, and a routine that feels easy to return to.</h3>
          </div>
          <div className="mg-visual-strip">
            {supportingVisuals.map((image) => (
              <div key={image.src} className="mg-visual-strip-item">
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        </section>

        <section className="mg-section mg-testimonial-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">Real feedback</p>
            <h3>Encouraging reactions from people who wanted more clarity and a plan they could actually follow.</h3>
          </div>
          <div className="mg-testimonial-grid">
            {testimonialImages.map((item) => (
              <article key={item.src} className="mg-testimonial-card mg-testimonial-card--image-only">
                <img src={item.src} alt={item.alt} />
              </article>
            ))}
          </div>
          <p className="mg-note">Individual experiences vary.</p>
        </section>

        <section className="mg-section mg-science-section">
          <div className="mg-science-header">
            <p className="mg-eyebrow">Why this approach</p>
            <h3>Digestive health is individual, and a practical routine can help you notice patterns without adding more confusion.</h3>
          </div>
          <div className="mg-science-grid">
            <div className="mg-science-card">
              <h4>Food variety matters</h4>
              <p>Building meals around a range of familiar and nourishing foods can make eating feel more balanced and sustainable.</p>
            </div>
            <div className="mg-science-card">
              <h4>Routines help you learn</h4>
              <p>Regular meal timing, reflection, and simple daily structure can make it easier to spot what supports you and what feels off.</p>
            </div>
            <div className="mg-science-card">
              <h4>Professional guidance still matters</h4>
              <p>Persistent or severe symptoms deserve individualized care from a qualified healthcare professional.</p>
            </div>
          </div>
          <p className="mg-disclaimer">
            The program is educational and is not a substitute for individualized medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section className="mg-section mg-pricing-section">
          <div className="mg-pricing-card">
            <p className="mg-eyebrow">Pricing</p>
            <h3>The 21-Day Bloat Reset</h3>
            <p className="mg-price">$37 <span>one-time</span></p>
            <p className="mg-pricing-copy">
              One complete digital document program with instant digital access and a
              60-day money-back guarantee if it is not the right fit.
            </p>
            <a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mg-primary-button"
            >
              Get the Complete Program — $37
            </a>
          </div>
        </section>

        <section className="mg-section mg-faq-section">
          <div className="mg-section-header">
            <p className="mg-eyebrow">FAQ</p>
            <h3>Questions people usually ask before they buy.</h3>
          </div>
          <div className="mg-faq-list">
            {faqItems.map((item) => (
              <details key={item.question} className="mg-faq-item" open={item.question === "Who is this program for?"}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mg-section mg-cta-section">
          <div className="mg-cta-panel">
            <p className="mg-eyebrow">A more grounded next step</p>
            <h3>Your Gut Deserves Better Than Guesswork.</h3>
            <p>
              If you want a clearer, more organized approach to bloating and digestive wellbeing,
              the 21-Day Bloat Reset gives you a practical place to start.
            </p>
            <a
              href={gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mg-primary-button"
            >
              Start Your 21-Day Program — $37
            </a>
          </div>
        </section>
      </main>

      <footer className="mg-footer">
        <div className="mg-footer-brand">Modern Gut Health</div>
        <p>Educational guidance for a calmer, more organized approach to digestive wellbeing.</p>
      </footer>
    </div>
  );
}


