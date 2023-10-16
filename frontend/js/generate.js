import OpenAI from "openai";

function Generate() {
  const me = {};

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  me.generate = async function (text) {
    try {
      const completion = await openai.completions.create({
        model: "gpt-3.5-turbo-instruct",
        prompt: generatePrompt(text),
        temperature: 0.6,
      });
      console.log("completion:", completion);
      return completion.choices[0].text;
    } catch (error) {
      // Consider adjusting the error handling logic for your use case
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  };

  function generatePrompt(text) {
    return `You are a professional making flash cards from given text for educational purposes for schools, universities, professional trainnings.
    Create as much as needed flash cards following these rules:
    - do not do duplicates.
    - you only provide the json for the flash cards, do not say anything else in the text, the text will be ignored.
    - questions should have all the context necessary for answering it, (not "How was this period called ? " but "How was the period between 1939 and 1945 called ?") because the flash cards will have no other context than the question.
    - make global question about the text when it makes sense
    - don't invent anything, only use the text
    - format: [{question: "question", answer: "answer"}, ...}]
    The is Text: ${text}`;
  }

  return me;
}

export const myGenerate = Generate();
