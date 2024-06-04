const express = require("express");
const bodyParser = require("body-parser");
const Groq = require("groq-sdk");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// Use the environment variable for the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const cv = req.body.cv;

    if (!jobDescription || !cv) {
      throw new Error("Job description and CV are required");
    }

    const prompt = createPrompt(jobDescription, cv);

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });

    res.render("result", {
      result: response.choices[0].message.content.trim().split("\n"),
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Function to create the prompt
const createPrompt = (jobDescription, cv) => `
You are an expert career coach who provides personalized and humanized responses. Given the following job description and CV, generate a comprehensive interview preparation guide. Focus on helping the candidate tell their experience and skills as a story that addresses the company's pain points. Address the candidate personally as "you" to create a coaching-like feel.

### Sections:

1. **Self-Presentation:**
   - Storytelling Approach:
     - Imagine you’re sitting across from the interviewer, sharing your journey.
     - “Hi there! I’m [Candidate Name]. With [X] years of experience in [relevant field], I’ve had the privilege of [specific achievement].”
     - Example:
       - “Hi, I’m Sarah. Over the past 5 years in marketing, I’ve orchestrated successful product launches, including one that boosted revenue by 30%.”
   - Problem-Solving and Interpersonal Skills:
     - “For instance, at my previous role at [Company], I tackled [specific challenge] by [solution].”
     - “Collaborating with cross-functional teams, I learned to navigate diverse perspectives and drive results.”

2. **Company's Challenges & Candidate as a Solution:**
   - Understanding Company Challenges:
     - Put yourself in the company’s shoes:
       - “From my research, it seems that [Company] is grappling with [specific challenge].”
   - Candidate as a Solution:
     - “Here’s where I come in. My expertise in [Skill X] directly addresses [Company]'s pain points.”
     - “For example, I’ve streamlined processes at [Previous Company], resulting in [specific outcome].”
     - “My ability to [Skill Y] aligns perfectly with [Company]'s goals.”

3. **Tailored Questions and Answers:**
   - Relevant Interview Questions:
     - Craft questions that showcase your strengths:
       - “Tell me about a time when you [specific situation related to the job].”
       - “Certainly! When faced with [situation], I [action taken] and achieved [result].”
   - Sample Answers:
     - “How do you handle [common challenge in the industry]?”
       - “For [common challenge], I [strategy applied] and improved [specific outcome].”
     - “Describe a project where you collaborated with cross-functional teams.”
       - “In a recent project at [Previous Company], I worked closely with [teams] to [specific achievement].”
   - Personalization:
     - Feel free to adapt and personalize these insights based on your unique experiences.

4. **Disqualifying Question: "Do you have any questions for me?":**
   - Importance of This Question:
     - Show your curiosity and intelligence:
       - “This question matters—it’s a chance to understand [Company] better.”
   - Sample Questions:
     - Ask questions that demonstrate genuine interest:
       - “Could you share more about [specific project/initiative] and how it impacts [Company]'s vision?”
       - “What’s the team culture like here? How do you foster collaboration?”
     - Remember, you’ve got this! 🌟 Good luck, and go ace that interview! 😊👍

5. **Key Points and Strategies:**
   - Highlight Relevant Experiences:
     - Remind yourself of specific achievements:
       - “At [Previous Company], I [specific task] and contributed to [Company]'s success.”
   - Understanding Company Challenges:
     - Connect the dots:
       - “I appreciate [Company]'s focus on [specific area], and I’m excited to contribute.”
   - Problem-Solving Abilities:
     - Be ready to share stories:
       - “When faced with [specific challenge], I [action taken] and achieved [result].”
   - Adaptability and Willingness to Learn:
     - Show your hunger for growth:
       - “I’m always eager to learn—whether it’s [new technology] or [industry trend].”
   - Balancing Modesty and Confidence:
     - Stay authentic:
       - “While I’m proud of [specific achievement], I’m also open to feedback.”
   - Concise and Impactful Answers:
     - Keep it focused:
       - “In a nutshell, I bring [Skill A], [Skill B], and [Skill C] to the table.”
     - You’re well-prepared, and your authenticity will shine through! 🚀

### Job Description:
${jobDescription}

### Candidate's CV:
${cv}
`;

app.listen(3500, () => console.log("Server running on port 3500"));
