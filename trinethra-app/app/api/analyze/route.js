import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { transcript, apiKey } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const keyToUse = apiKey || process.env.GROQ_API_KEY;
    if (!keyToUse) {
      return NextResponse.json(
        { error: 'Groq API Key is missing. Please provide it in the UI or set GROQ_API_KEY.' },
        { status: 401 }
      );
    }

    const groq = new Groq({ apiKey: keyToUse });

    // Read rubric and KPIs from data folder
    const dataDir = path.join(process.cwd(), 'data');
    const rubricStr = fs.readFileSync(path.join(dataDir, 'rubric.json'), 'utf-8');
    const rubricObj = JSON.parse(rubricStr);

    const systemPrompt = `You are an expert HR and psychology analyst working for DeepThought.
Your job is to analyze a supervisor's feedback transcript about a Fellow and produce a structured JSON assessment.

Here is the Rubric, KPIs, and Assessment Dimensions you must use:
${JSON.stringify(rubricObj, null, 2)}

Important Supervisor Biases to account for:
1. Helpfulness bias: Absorbing tasks is a 5-6, not systems building.
2. Presence bias: Being on the floor is rated higher than building trackers.
3. Halo/horn effect: One big story coloring the entire assessment.

You MUST respond strictly in the following JSON format:
{
  "score": {
    "value": <integer 1-10>,
    "label": "<string label from rubric>",
    "band": "<string band from rubric>",
    "justification": "<one paragraph justification citing evidence>"
  },
  "evidence": [
    {
      "quote": "<exact quote from transcript>",
      "signal": "<positive, negative, or neutral>",
      "dimension": "<execution, systems_building, kpi_impact, or change_management>",
      "interpretation": "<your interpretation>"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "<KPI Name from the list>",
      "evidence": "<summary of evidence for this KPI>",
      "systemOrPersonal": "<system or personal>"
    }
  ],
  "gaps": [
    {
      "dimension": "<dimension name>",
      "detail": "<what is missing from the transcript regarding this dimension>"
    }
  ],
  "followUpQuestions": [
    {
      "question": "<specific question for the intern to ask next time>",
      "targetGap": "<dimension or area>",
      "lookingFor": "<what you are hoping to find out>"
    }
  ]
}

Ensure your response is ONLY valid JSON.
Pay special attention to the Critical Boundary (6 vs 7). 6 is executing tasks defined by someone else. 7 is identifying problems independently.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the transcript to analyze:\n\n${transcript}` }
      ],
      model: 'llama3-70b-8192', // Fast, very capable of structured JSON output
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const resultText = chatCompletion.choices[0]?.message?.content || '{}';
    const resultObj = JSON.parse(resultText);

    return NextResponse.json(resultObj);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze transcript' }, { status: 500 });
  }
}
