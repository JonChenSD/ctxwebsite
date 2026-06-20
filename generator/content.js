/**
 * Youth Artist Giving Circle — Invitation & Self-Assessment content.
 * Placeholders: {place}, {deadline}, {email}, {location}
 */
export const PLACE_PRESETS = {
  germantown: { label: 'Germantown', place: 'Germantown' },
  rhinelander: { label: 'Rhinelander', place: 'Rhinelander' },
  template: { label: 'Blank template', place: '[Your neighborhood]' },
};

export const DEFAULTS = {
  place: 'Germantown',
  deadline: '[Date]',
  email: '[Email]',
  location: '[Location]',
  year: '2026',
};

export const RATING_QUESTIONS = [
  'I want to learn more about my community.',
  'I\u2019m interested in how art and creativity can support people\u2019s wellbeing.',
  'I\u2019m comfortable working with other people in a group.',
  'I\u2019m open to hearing different opinions and perspectives.',
  'I can respectfully speak up when I disagree with something.',
  'I\u2019m willing to work through disagreements instead of avoiding them.',
  'I\u2019m interested in helping decide how money and resources are used in my community.',
  'I\u2019m willing to commit time and energy to this process.',
  'I\u2019m open to guidance and support from adult facilitators.',
  'Creativity or self-expression is already an important part of my life.',
];

export const REFLECTION_QUESTIONS = [
  {
    num: 1,
    text:
      'In what ways do you express yourself creatively? This could include art, music, writing, dance, fashion, cooking, storytelling, organizing, content creation, or anything else that feels creative to you.',
  },
  {
    num: 2,
    text:
      'After reading about the Youth Artist Giving Circle, what interests you most about participating, and why?',
  },
  {
    num: 3,
    text:
      'In {place}, where do you see places, people, or situations that could use more care, support, or attention? What ideas do you have for how art, creativity, or culture might help?',
  },
  {
    num: 4,
    text:
      'What do you hope to learn, experience, or contribute if you are selected to participate in the circle?',
  },
];

export const AGREEMENTS = [
  {
    title: 'Show Up',
    text: 'We commit to being present, participating, and communicating honestly when we can\u2019t make it to a session.',
  },
  {
    title: 'Respect Each Other',
    text: 'We listen to one another, make space for different perspectives, and treat each other with care\u2014even when we disagree.',
  },
  {
    title: 'Speak Up & Stay Engaged',
    text: 'If something doesn\u2019t feel right, we say so. We stay in the conversation, even when it feels challenging or uncomfortable.',
  },
  {
    title: 'Practice Accountability & Repair',
    text: 'We take responsibility for our actions, work through conflict honestly, and prioritize learning and repair over punishment.',
  },
  {
    title: 'Trust the Process',
    text: 'We are willing to learn and practice shared decision-making together. Adults help guide the process, but young people lead the decisions.',
  },
];

export function interpolate(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

export function buildDocumentPages(vars) {
  const v = { ...DEFAULTS, ...vars };
  const p = (text) => interpolate(text, v);

  return [
    {
      type: 'cover',
      place: v.place,
      year: v.year,
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'Hey \u2014 thanks for reading',
          body: [
            'We\u2019re inviting a small group of young people to be part of the first **Youth Artist Giving Circle** in our neighborhood.',
            'This project is supported by a group called **culturetherapy**, which believes young people should have real power in shaping healthier, more creative communities. https://culturetherapy.plus/',
            'This isn\u2019t just another youth program where adults make all the decisions.',
            'This circle is about trusting young people with real responsibility, real ideas, real money and making the decisions \u2014 and creating space to imagine what care for our community could look like through art, creativity, culture and connection.',
          ],
        },
      ],
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'So, what\u2019s a Giving Circle?',
          body: [
            '**A giving circle is a group of people who come together to decide how money and resources should support their community.**',
          ],
          list: [
            'Funding local projects that already exist',
            'Supporting artists or creative events',
            'Creating new spaces or experiences',
            'Using your own gifts to help people feel more connected, safe, seen, inspired, or supported',
          ],
          afterList: [
            p(
              '*For this circle, culturetherapy will provide an initial gift for the group to use in ways that support community wellbeing through art and creative expression in {place}.*'
            ),
          ],
          subheading: 'The young people in the circle will help decide:',
          sublist: [
            'What matters most',
            'What the community needs',
            'Where the money should go',
            'What kinds of creative ideas are worth supporting',
          ],
          closing: 'Adults are there to support the process, but they won\u2019t control your decisions.',
        },
      ],
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'Our Core Belief',
          body: [
            'Art and creativity are not \u201cextras\u201d. They are an essential part of what helps people survive, heal, connect, express themselves, and imagine better futures.',
          ],
        },
        {
          heading: 'What are the goals of the circle?',
          intro: 'The goals are to:',
          list: [
            'Support art, creativity, and self-expression in your neighborhood',
            'Create projects or opportunities that positively impact young people\u2019s wellbeing',
            'Help young people build confidence in their ability to shape and care for their communities',
            'Learn how to make decisions together, work through differences, and move resources with intention',
            'Build something that could continue to repeat or grow in the future here or in other places across the country',
          ],
        },
      ],
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'Who is this for?',
          intro: 'This circle is for young people ages 14\u201326 who:',
          list: [
            'Care about creativity, art, culture, or self-expression',
            'Want to support their community',
            'Are interested in working with others',
            'Are open to learning and trying something new',
          ],
          closing:
            'You do **NOT** need to be a professional artist. You might make music, draw, dance, write poems or plays or journal entries, organize events, make clothes, take photos, tell stories, create online, care deeply about culture and expression, or just know how important creativity is in your own life.',
        },
      ],
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'How we agree to show up together',
          body: [
            'The people in the circle will help shape their own group agreements, but these are the basic expectations we\u2019ll start with:',
          ],
          agreements: AGREEMENTS,
          closing:
            'These are our starting agreements. During our first sessions, the circle will have the opportunity to add to and strengthen them together. If challenges arise, the group and facilitator will work together to address them through conversation, accountability, and repair. In rare situations where someone\u2019s actions repeatedly harm the group or make collaboration unsafe, the circle may decide that a member should step away. We believe this is unlikely, but we want to be clear about our shared responsibility to care for the wellbeing of the group.',
        },
      ],
    },
    {
      type: 'content',
      sections: [
        {
          heading: 'Time Commitment and Money',
          body: [
            'The circle giving will take place over about **6 months** beginning with the group\u2019s first meeting. The timeline can shift depending on the needs and energy of the group.',
          ],
          subheading: '**Participants will receive:**',
          sublist: [
            'A stipend of **$1,000** for being active members of the circle',
            'Experience working together to move real resources in their community',
            'Support from facilitators and mentors throughout the process',
          ],
        },
        {
          heading: 'The Youth Artist Giving Circle Gift',
          body: [
            'The group will collectively decide how to use a **$5000** gift to support creativity, wellbeing, and community care in their neighborhood.',
          ],
          subheading: '**At the end of the pilot, the group may also decide to:**',
          sublist: [
            'Continue the circle',
            'Raise more money',
            'Create new projects',
            'Invite new members',
            'Or just stay friends and do cool stuff',
          ],
        },
      ],
    },
    {
      type: 'assessment',
      heading: 'Self Assessment',
      intro: [
        '*Please read through the questions below and rate each one from:*',
        '*1 = Strongly disagree*',
        '*to*',
        '*5 = Strongly agree*',
        'There are no \u201cright\u201d answers. This is mainly a chance to reflect on whether this feels like a real fit for you.',
      ],
      questionOffset: 0,
      questions: RATING_QUESTIONS.slice(0, 5),
    },
    {
      type: 'assessment',
      heading: 'Self Assessment (continued)',
      intro: null,
      showQuestionsHeading: false,
      questionOffset: 5,
      questions: RATING_QUESTIONS.slice(5),
    },
    {
      type: 'reflection',
      heading: 'Reflection',
      intro:
        '*Please respond to the questions below in **2\u20135 sentences each**. There are no right or wrong answers. We\u2019re interested in hearing your perspective and getting to know you better.*',
      questions: REFLECTION_QUESTIONS.slice(0, 2).map((q) => ({
        ...q,
        text: p(q.text),
      })),
    },
    {
      type: 'reflection',
      heading: 'Reflection (continued)',
      intro: null,
      questions: REFLECTION_QUESTIONS.slice(2).map((q) => ({
        ...q,
        text: p(q.text),
      })),
      footer: {
        website: 'To learn more about culture therapy, visit: https://culturetherapy.plus/',
        websiteNote:
          'When you enter the website, you\u2019ll find an interactive welcome experience for people interested in this work and ideas behind it.',
        return: p(
          'Please return this self assessment and reflection no later than: {deadline} by sending it to {email} or dropping it off at {location}.'
        ),
      },
    },
  ];
}
