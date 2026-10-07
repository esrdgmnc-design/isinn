// İngilizce rehber yazıları: serbest çalışarak (freelance) iş bulmak üzerine. lib/rehberContent.js bunları
// REHBER_POSTS'a ekler; /rehber/[slug] sayfası `lang: "en"` alanına göre İngilizce etiketlerle çizer.
// Kurallar (Türkçe yazılarla aynı): kazanç vaadi yok, ölçülemeyen/kaynaksız rakam yok, vergi/belge konusunda
// kesin hüküm yok, ürün satışına yönlendirme yok, İşinn'e dair yalnızca doğrulanmış bilgiler (komisyon yok,
// ödemelere aracılık yok, telefon herkese açık görünmez).
export const REHBER_POSTS_EN = [
  {
    slug: "how-to-find-freelance-work-as-a-beginner",
    lang: "en",
    title: "How to Find Freelance Work as a Beginner: A Step-by-Step Guide",
    description: "No portfolio, no reviews, no network yet? A practical beginner's path: pick one narrow service, make three samples, choose where to look and send your first offers. No income promises.",
    category: "freelance-en",
    bodyHtml: `
      <p>Finding your first freelance clients is less about talent and more about being <strong>easy to say yes to</strong>: a clear offer, visible proof of your work, and quick, polite replies. Here is a step-by-step path that works without a big portfolio or a large network.</p>
      <h2>1. Pick one narrow service, not a job title</h2>
      <p>"Freelance designer" is vague. "Logo and Instagram post templates for small cafés" is concrete. A good test: can you say in one sentence <em>who</em> it is for and <em>what they get</em>? If not, narrow it down until you can.</p>
      <h2>2. Make three samples before you look for clients</h2>
      <p>You do not need past clients to show your work. Use your own practice projects, a small job for a friend (with their permission), or a "before and after" you created yourself. Do not use someone else's work and do not claim clients you do not have.</p>
      <h2>3. Decide where you will look</h2>
      <ul>
        <li><strong>People you know.</strong> Tell ten people, in one sentence, what you now offer and who it is for.</li>
        <li><strong>Local requests.</strong> On İşinn, people post job requests and service providers can send an offer to the person who posted. Local jobs are easier to start with because meeting, delivering and trusting each other is simpler.</li>
        <li><strong>Remote marketplaces.</strong> They offer more jobs but also more competition. Read each platform's rules and fees before you sign up.</li>
        <li><strong>Communities in your niche.</strong> Groups, forums and local meetups, where you can help first and mention your service second.</li>
      </ul>
      <h2>4. Send short, specific offers</h2>
      <p>Reply to each request in a few sentences: show that you read it, share one relevant sample and ask one question. Our guide on <a href="/rehber/how-to-write-a-freelance-proposal">how to write a freelance proposal</a> has a simple structure you can reuse.</p>
      <h2>5. Start with a small, clearly defined first job</h2>
      <p>Before you begin, agree in writing on what is included, the deadline, the price, how many revisions you offer and how you will be paid. A small first job with clear limits teaches you more than a big vague one, and it gives you a result you can show next time.</p>
      <h2>6. Protect yourself</h2>
      <ul>
        <li>Never pay to get hired, and be careful with anyone who asks you to move to an unfamiliar channel or open unknown payment links.</li>
        <li>Keep your conversations and agreements in one place so you can look back at them.</li>
        <li>İşinn does not mediate payments between users, so agree on price, cancellation and payment method at the start of the conversation. Your phone number is not shown publicly on İşinn.</li>
      </ul>
      <h2>7. Taxes, contracts and paperwork</h2>
      <p>Registration and tax obligations depend on where you live, the type of work and how much you earn. This guide cannot give legal or tax advice. In Turkey you can check with the Revenue Administration (Gelir İdaresi Başkanlığı) or an accountant. If you have a job, also read your employment contract before you take side work.</p>
      <p>Consistency matters more than a perfect start: a few good small jobs, honest descriptions and quick replies are what bring the next clients.</p>
    `,
    ctaText: "Create your first listing on İşinn",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "How do I get my first freelance client with no experience?", a: "Narrow your service to one clear offer, make three samples of your own, tell people you know what you now offer, and send short, specific offers to local requests. Start with a small job that has clear limits." },
      { q: "Do I need a portfolio to start freelancing?", a: "You need some visible proof, but not past clients. Three well-made samples (practice projects, a favour for a friend with permission, or a before and after) are enough to start." },
      { q: "Is it safe to work with strangers online?", a: "Take basic precautions: never pay to get hired, agree on scope and payment in writing, keep conversations in one place and be wary of unknown payment links. İşinn does not mediate payments between users, so settle payment terms yourselves at the start." },
      { q: "Can I freelance alongside a full-time job?", a: "It depends on your employment contract and local rules. Read your contract and check with an official source or an accountant before you start." },
    ],
  },
  {
    slug: "freelance-service-ideas-you-can-start-with-skills-you-already-have",
    lang: "en",
    title: "12 Freelance Service Ideas You Can Start With Skills You Already Have",
    description: "Not sure what to offer? Twelve service ideas across teaching, creative work, practical help and online tasks, plus a simple way to choose one. Examples only, no income claims.",
    category: "freelance-en",
    bodyHtml: `
      <p>Most people already do something others would happily get help with. The trick is to turn a skill into a <strong>service</strong>: a specific thing you do, for a specific person, in a specific time. The ideas below are examples to spark your thinking. Demand differs by city and season, and none of this is a prediction of how much you can earn.</p>
      <h2>Teaching and coaching</h2>
      <ul>
        <li><strong>Language conversation practice.</strong> Weekly speaking sessions for learners who already know the basics.</li>
        <li><strong>Homework and study support.</strong> A fixed weekly slot for primary or secondary school students in subjects you know well.</li>
        <li><strong>Beginner lessons for an instrument, craft or software.</strong> Four-session starter courses with a clear outcome.</li>
      </ul>
      <h2>Creative services</h2>
      <ul>
        <li><strong>Phone product photography for small businesses.</strong> Clean, well-lit photos for their listings and social media.</li>
        <li><strong>Short video editing.</strong> Turning raw clips into tidy videos for social media.</li>
        <li><strong>Simple design with free tools.</strong> Social post templates, menus, flyers or invitations.</li>
      </ul>
      <h2>Practical help</h2>
      <ul>
        <li><strong>Sewing alterations and repairs.</strong> Hems, zippers and small fixes.</li>
        <li><strong>Home organising.</strong> Helping people sort wardrobes, kitchens or paperwork in a few hours.</li>
        <li><strong>Plant care visits.</strong> Watering and care while owners are away.</li>
      </ul>
      <h2>Online and admin tasks</h2>
      <ul>
        <li><strong>Spreadsheet and data entry help.</strong> Cleaning and organising lists, simple formulas, tidy reports.</li>
        <li><strong>Proofreading, transcription or translation.</strong> Only in languages you can handle confidently.</li>
      </ul>
      <h2>How to choose one</h2>
      <p>Score each idea from 1 to 5 on three questions: <em>Am I good enough that I could show a sample this week?</em> <em>Do I know someone who might need it?</em> <em>Can I fit it into the hours I really have?</em> Start with the idea with the highest total, not the one that sounds most impressive.</p>
      <h2>Services, not products</h2>
      <p>İşinn is a place to find and offer <strong>services</strong>. It has no shop, cart or shipping, and it does not steer people towards selling goods. If your skill is making things, think about the service side of it, such as a workshop, a repair service or lessons.</p>
      <p>If you are unsure which idea suits you, <a href="/yetenegini-farket">Yeteneğini Farket</a> (Discover Your Talent, in Turkish) can suggest one or two directions from your own words.</p>
    `,
    ctaText: "Turn one of these ideas into a listing",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "What freelance services can a beginner offer?", a: "Anything you can already do well and show a sample of: lessons or study support, simple design, phone photography, sewing repairs, home organising, spreadsheet help and similar tasks. Pick one narrow service rather than a broad job title." },
      { q: "How do I choose between several ideas?", a: "Score each idea from 1 to 5 on three questions: could you show a sample this week, do you know someone who might need it, and does it fit your real available hours. Start with the highest total." },
      { q: "Can I sell products on İşinn?", a: "No. İşinn is for finding and offering services; there is no shop, cart or shipping. If you make things, consider the service side, such as workshops or repair work." },
    ],
  },
  {
    slug: "how-to-write-a-freelance-profile-that-gets-replies",
    lang: "en",
    title: "How to Write a Freelance Profile That Gets Replies",
    description: "A clear title, an honest description, real photos and a simple working routine. Before and after examples for your first freelance listing.",
    category: "freelance-en",
    bodyHtml: `
      <p>A good freelance profile does not try to impress everyone. It tells the right person, in a few lines, <strong>what you do, for whom, how you work and when you are available</strong>.</p>
      <h2>1. The title: who is it for and what do you do?</h2>
      <ul>
        <li><strong>Weak:</strong> "I do all kinds of work", "Freelancer available".</li>
        <li><strong>Better:</strong> "Evening homework support for primary school children", "Phone product photos for small online shops", "Hemming and clothing repairs at your home".</li>
      </ul>
      <h2>2. The description: what, where, how, when</h2>
      <p>Two or three sentences are enough, as long as they contain four things: what you do, where you work (or that you work remotely), how a session or project works and when you are available.</p>
      <p><em>Example:</em> "I help primary school children with homework and activities at their homes on weekday evenings. I work in the Ataşehir area. A session takes about an hour."</p>
      <h2>3. What not to write</h2>
      <ul>
        <li>Do not claim certificates, degrees or years of experience you do not have.</li>
        <li>Avoid claims you cannot measure, such as "guaranteed results", "the best" or "100% satisfaction".</li>
        <li>For work that needs a licence or a qualification, such as health or legal services, follow the rules that apply.</li>
      </ul>
      <h2>4. Photos: show your own work</h2>
      <ul>
        <li>Use clear, well-lit photos of your own work or workplace.</li>
        <li>Do not upload photos in which a child's face is recognisable; they are not accepted on İşinn.</li>
        <li>Do not use pictures from the internet or anyone else's work.</li>
      </ul>
      <h2>5. Pricing and how you work</h2>
      <p>If you can, state how you charge: per hour, a fixed price or "by quote". İşinn lets you choose among these. Payments happen directly between the parties and İşinn does not mediate them, so write your cancellation and payment terms at the start of each conversation.</p>
      <h2>6. Publish, then improve</h2>
      <p>Your first listing does not have to be perfect. After you publish, update the description based on the questions people actually ask you.</p>
    `,
    ctaText: "Create your listing",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "What should a freelance profile title say?", a: "Who the service is for and what you do, in a few concrete words, for example 'Phone product photos for small online shops' instead of 'Freelancer available'." },
      { q: "How long should my description be?", a: "Two or three sentences are enough if they say what you do, where you work or that you work remotely, how a session or project works and when you are available." },
      { q: "Should I put my price in my profile?", a: "It usually builds trust. State whether you charge per hour, a fixed price or by quote. İşinn does not mediate payments, so settle cancellation and payment terms at the start of each conversation." },
    ],
  },
  {
    slug: "how-to-write-a-freelance-proposal",
    lang: "en",
    title: "How to Write a Freelance Proposal That Gets a Reply",
    description: "A short, repeatable structure for answering a job request: show you read it, add one relevant sample, ask one question and make the next step easy.",
    category: "freelance-en",
    bodyHtml: `
      <p>When someone posts a job request, they usually get several answers. The ones that get a reply are rarely the longest; they are the ones that are <strong>specific, short and easy to answer</strong>.</p>
      <h2>A simple five-part structure</h2>
      <ol>
        <li><strong>Greet by name and show you read the request.</strong> One sentence that repeats the key detail, such as the age of the child, the type of work or the deadline.</li>
        <li><strong>Say why you are a fit.</strong> One relevant sample or experience. If you have none for this exact job, do not stretch the truth; say what you can do and ask about the details.</li>
        <li><strong>Ask one concrete question.</strong> It shows you are thinking about the job and gives the other person an easy way to reply.</li>
        <li><strong>Make scope, timing and price clear enough.</strong> A range or a way of working is better than silence, for example "a first session is about an hour, we can agree on the rest after we talk".</li>
        <li><strong>Suggest the next step.</strong> "Would a short call or a few messages tomorrow work for you?"</li>
      </ol>
      <h2>An example</h2>
      <p><em>"Hello Ayşe, I saw you are looking for someone to help your daughter with homework on weekday evenings. I have taught primary school students for two years and can share a sample worksheet I made. Which subjects does she need most help with? I am available Monday to Thursday after 17:00."</em></p>
      <p>Only include experience that is true. If this example does not match your situation, write your own version with your real details.</p>
      <h2>Things to avoid</h2>
      <ul>
        <li>The same copy-pasted message to every request.</li>
        <li>Promises you cannot keep, such as guaranteed results or unrealistic deadlines.</li>
        <li>Asking for payment before you have agreed on anything, or moving the conversation to an unfamiliar channel.</li>
      </ul>
      <h2>Follow up once</h2>
      <p>If you do not hear back in two or three days, send one short, polite follow-up. After that, move on to the next request.</p>
      <h2>On İşinn</h2>
      <p>When you tap "Teklif Ver" (Make an Offer) on a job request on İşinn, a conversation opens with the person who posted it. İşinn can draft a first message from the job text and your own listings; read it, correct anything that is not true for you and send it in your own words. Payments are agreed directly between the parties and İşinn does not mediate them.</p>
    `,
    ctaText: "Browse job requests on İşinn",
    ctaHref: "/",
    faq: [
      { q: "How long should a freelance proposal be?", a: "Three to five sentences are usually enough: show you read the request, add one relevant sample or experience, ask one concrete question and suggest a next step." },
      { q: "Should I include my price in the first message?", a: "A range or a clear way of working is better than saying nothing. If you need more details first, say what you need to know and when you can give an exact price." },
      { q: "How often should I follow up?", a: "Once, after two or three days, with a short and polite message. After that, move on to other requests." },
    ],
  },
  {
    slug: "how-to-price-your-first-freelance-services",
    lang: "en",
    title: "How to Price Your First Freelance Services Without Guessing",
    description: "Hourly, fixed or by quote? A simple method to estimate your time, compare with local listings, define the scope and raise your prices over time. No market numbers invented.",
    category: "freelance-en",
    bodyHtml: `
      <p>Pricing is the part many beginners avoid. You do not need a perfect number; you need a number you can explain, that covers your time and that you can adjust later. This guide gives no market rates because they differ by city, field and season.</p>
      <h2>1. Estimate your time honestly</h2>
      <p>Write down the steps of a typical job and give each a time, including the unglamorous parts: messages, preparation, travel and revisions. Then add a little extra, since first jobs almost always take longer than expected.</p>
      <h2>2. Decide what an hour of your time should be worth</h2>
      <p>Start from what you need or want per hour, then add the real costs of the job, such as travel, materials or software. <em>(Made-up numbers to show the idea: if you estimate 6 hours at 100 per hour plus 60 in costs, the job costs 660.)</em></p>
      <h2>3. Look at what others in your area offer</h2>
      <p>Browse three to five listings for similar services in your city. Compare what is included, not only the price. You are looking for a rough range, not a number to copy.</p>
      <h2>4. Choose a pricing model</h2>
      <ul>
        <li><strong>Hourly:</strong> good when the amount of work is unclear or ongoing, such as lessons or support.</li>
        <li><strong>Fixed price:</strong> good for clearly defined jobs, such as a logo or a set of edited photos. Define exactly what is included.</li>
        <li><strong>By quote:</strong> good when every job is different. Say what you need to know to give a price.</li>
      </ul>
      <h2>5. Define the scope and the revisions</h2>
      <p>A fixed price is only fair if both sides know what it includes: deliverables, deadline, number of revisions and what counts as extra work. Write it down before you start.</p>
      <h2>6. Adjust over time</h2>
      <p>If every request says yes immediately, your price may be low. If nobody replies, check your description and samples before cutting the price. After a few good jobs and positive feedback, raise your price for new clients.</p>
      <h2>7. Be careful with discounts</h2>
      <p>A small introductory offer for a first client can be fine, but say clearly that it is a one-time offer so you do not train people to expect it. Never claim a price is a "market rate" unless you can show where it comes from.</p>
      <p>On İşinn you choose between hourly, fixed or "by quote" in your listing. İşinn does not take a commission on what you earn and does not mediate payments, so agree on cancellation and payment terms directly at the start of the conversation.</p>
    `,
    ctaText: "Create your listing and set your price",
    ctaHref: "/?view=createListing",
    faq: [
      { q: "Should I charge hourly or a fixed price?", a: "Hourly suits ongoing or unclear work such as lessons or support. A fixed price suits clearly defined jobs where you list exactly what is included. 'By quote' suits jobs that differ every time." },
      { q: "How do I price my first freelance job?", a: "Estimate your time step by step, decide what an hour should be worth for you, add real costs, and compare with a few similar local listings to get a rough range. Adjust after your first jobs." },
      { q: "Is it okay to offer a discount to my first client?", a: "A small, clearly one-time introductory offer can work. State that it is a one-time offer and keep the scope clearly defined." },
    ],
  },
];

export const REHBER_META_EN = {
  "how-to-find-freelance-work-as-a-beginner": {
    published: "2026-10-07", updated: "2026-10-07",
    shortAnswer: "To find your first freelance work, pick one narrow service, make three samples of your own, tell people you know what you offer and send short, specific offers to local requests. Agree on scope, price and payment in writing before you start, and never pay to get hired.",
  },
  "freelance-service-ideas-you-can-start-with-skills-you-already-have": {
    published: "2026-10-07", updated: "2026-10-07",
    shortAnswer: "Good starting services are ones you can already do well and show a sample of: lessons or study support, phone photography, simple design, sewing repairs, home organising or spreadsheet help. Score each idea on sample readiness, who needs it and your real hours, then start with the highest total.",
  },
  "how-to-write-a-freelance-profile-that-gets-replies": {
    published: "2026-10-07", updated: "2026-10-07",
    shortAnswer: "A freelance profile that gets replies has a short, concrete title (who it is for and what you do), a two or three sentence description (what, where, how, when), clear photos of your own work and a stated pricing method. Avoid unmeasurable claims and anything you cannot prove.",
  },
  "how-to-write-a-freelance-proposal": {
    published: "2026-10-07", updated: "2026-10-07",
    shortAnswer: "A proposal that gets a reply is short and specific: greet by name, show you read the request, mention one relevant sample, ask one concrete question and suggest a next step. Do not copy-paste, do not overpromise and follow up once after two or three days.",
  },
  "how-to-price-your-first-freelance-services": {
    published: "2026-10-07", updated: "2026-10-07",
    shortAnswer: "To price your first services, estimate your time step by step, decide what an hour should be worth, add real costs and compare with a few similar local listings. Choose hourly, fixed or by-quote pricing, define scope and revisions in writing and adjust after your first jobs.",
  },
};
