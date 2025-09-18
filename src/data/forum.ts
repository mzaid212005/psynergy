import { ForumPost, ForumReply } from '@/types'

// Sample forum posts for the peer support platform
export const forumPosts: ForumPost[] = [
  {
    id: 'post_1',
    userId: 'user_1',
    title: 'Dealing with exam anxiety - need advice',
    content: `Hi everyone,

I'm a 3rd year engineering student and I've been struggling with severe exam anxiety. Every time exams approach, I get panic attacks, can't sleep, and my mind goes completely blank during the test even though I've studied well.

Has anyone else experienced this? What techniques have helped you manage exam stress? I've tried breathing exercises but they don't seem to work when I'm in the exam hall.

Any advice would be really appreciated. Thanks!`,
    category: 'Academic Stress',
    isAnonymous: false,
    tags: ['exam anxiety', 'panic attacks', 'study stress', 'coping strategies'],
    upvotes: 23,
    downvotes: 1,
    replies: [],
    isModerated: true,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'post_2',
    userId: 'anonymous_1',
    title: 'Feeling overwhelmed by family expectations',
    content: `I don't know where else to turn, so I'm posting here anonymously.

My parents have very high expectations for my career. They want me to become a doctor, but I'm more interested in psychology and counseling. Every conversation at home turns into pressure about my grades and future.

I feel like I'm living someone else's life. Has anyone else dealt with family pressure about career choices? How did you handle it?

I love my parents but I'm starting to feel depressed about my future.`,
    category: 'Family Issues',
    isAnonymous: true,
    tags: ['family pressure', 'career choices', 'depression', 'expectations'],
    upvotes: 45,
    downvotes: 2,
    replies: [],
    isModerated: true,
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-19T15:45:00Z'
  },
  {
    id: 'post_3',
    userId: 'user_3',
    title: 'Success story: How I overcame social anxiety',
    content: `I wanted to share my journey with social anxiety because I know many of you might be going through something similar.

Two years ago, I couldn't even speak up in class or make friends. I would eat lunch alone and avoid group projects. It was really affecting my college experience.

Here's what helped me:
1. Started with small goals - saying "hi" to one person each day
2. Joined a hobby club (photography) where I could focus on something I loved
3. Practiced conversations with my roommate
4. Got counseling through our campus center
5. Gradually pushed my comfort zone

Today, I gave a presentation to 50+ people and actually enjoyed it! It's possible to overcome this. Don't give up on yourself.

Happy to answer any questions or chat with anyone going through this. You're not alone! 💪`,
    category: 'Personal Growth',
    isAnonymous: false,
    tags: ['social anxiety', 'success story', 'personal growth', 'counseling'],
    upvotes: 78,
    downvotes: 0,
    replies: [],
    isModerated: true,
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T09:15:00Z'
  },
  {
    id: 'post_4',
    userId: 'user_4',
    title: 'Study group for mindfulness and meditation',
    content: `Hey everyone!

I've been practicing mindfulness for about 6 months now and it's really helped with my stress levels. I was wondering if anyone would be interested in forming a virtual study group where we can:

- Practice guided meditations together
- Share mindfulness techniques
- Support each other in building consistent habits
- Discuss how mindfulness helps with academic stress

We could meet once a week on video call for 30-45 minutes. No experience necessary - beginners are very welcome!

Comment below if you're interested. Let's build a supportive community! 🧘‍♀️✨`,
    category: 'Wellness',
    isAnonymous: false,
    tags: ['mindfulness', 'meditation', 'study group', 'stress relief'],
    upvotes: 34,
    downvotes: 1,
    replies: [],
    isModerated: true,
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T14:20:00Z'
  },
  {
    id: 'post_5',
    userId: 'anonymous_2',
    title: 'Struggling with loneliness and homesickness',
    content: `I'm in my first year and staying in hostel. I miss home so much and feel really lonely here. My roommate is nice but we don't have much in common.

I try to call home but it makes me more homesick. I see other students having fun in groups and I feel left out. I'm starting to wonder if I made the right choice coming to this college.

How do you deal with homesickness? When does it get better? I don't want to worry my parents by telling them how I feel.`,
    category: 'Relationships',
    isAnonymous: true,
    tags: ['loneliness', 'homesickness', 'first year', 'hostel life'],
    upvotes: 29,
    downvotes: 0,
    replies: [],
    isModerated: true,
    createdAt: '2024-01-16T20:10:00Z',
    updatedAt: '2024-01-16T20:10:00Z'
  }
]

// Sample forum replies
export const forumReplies: ForumReply[] = [
  {
    id: 'reply_1',
    postId: 'post_1',
    userId: 'user_5',
    content: `I totally understand what you're going through! I had the same issue in my 2nd year. What really helped me was:

1. **Progressive muscle relaxation** before exams - tense and release each muscle group
2. **Positive self-talk** - instead of "I'll fail" try "I'm prepared and I can do this"
3. **Arrive early** to the exam hall and do breathing exercises in your seat
4. **Practice past papers** under timed conditions to simulate exam pressure

Also, talk to your professors - many are understanding about anxiety and might allow you to sit in a quieter area. You've got this! 💪`,
    isAnonymous: false,
    upvotes: 15,
    downvotes: 0,
    createdAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 'reply_2',
    postId: 'post_1',
    userId: 'user_6',
    content: `Have you tried the 5-4-3-2-1 grounding technique during exams? When you feel panic starting:
- 5 things you can see
- 4 things you can touch  
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

It helps bring your mind back to the present moment. Also, our campus counseling center has specific workshops for test anxiety - highly recommend!`,
    isAnonymous: false,
    upvotes: 12,
    downvotes: 0,
    createdAt: '2024-01-20T13:20:00Z'
  },
  {
    id: 'reply_3',
    postId: 'post_2',
    userId: 'user_7',
    content: `I'm going through something very similar. My parents want me in engineering but I'm passionate about environmental science. 

What's helping me is having honest conversations with them about my interests and showing them career prospects in my field. I also found a mentor in my desired field who spoke to my parents about opportunities.

It's not easy, but remember - it's YOUR life. You have to live with your career choice every day. Maybe start by exploring psychology courses as electives to show your parents you're serious about it?

Feel free to DM me if you want to talk more. You're not alone in this! ❤️`,
    isAnonymous: false,
    upvotes: 18,
    downvotes: 0,
    createdAt: '2024-01-19T17:30:00Z'
  }
]

// Forum categories
export const forumCategories = [
  {
    id: 'academic_stress',
    name: 'Academic Stress',
    description: 'Study pressure, exam anxiety, academic performance',
    icon: '📚',
    color: 'blue',
    postCount: 45,
    isActive: true
  },
  {
    id: 'mental_health',
    name: 'Mental Health',
    description: 'Depression, anxiety, emotional wellbeing',
    icon: '🧠',
    color: 'purple',
    postCount: 67,
    isActive: true
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Family, friends, romantic relationships, social issues',
    icon: '💝',
    color: 'pink',
    postCount: 34,
    isActive: true
  },
  {
    id: 'family_issues',
    name: 'Family Issues',
    description: 'Family pressure, expectations, communication',
    icon: '👨‍👩‍👧‍👦',
    color: 'green',
    postCount: 28,
    isActive: true
  },
  {
    id: 'personal_growth',
    name: 'Personal Growth',
    description: 'Self-improvement, confidence, life skills',
    icon: '🌱',
    color: 'emerald',
    postCount: 52,
    isActive: true
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Physical health, mindfulness, self-care',
    icon: '🌟',
    color: 'yellow',
    postCount: 41,
    isActive: true
  },
  {
    id: 'crisis_support',
    name: 'Crisis Support',
    description: 'Immediate help, emergency situations',
    icon: '🆘',
    color: 'red',
    postCount: 12,
    isActive: true
  },
  {
    id: 'success_stories',
    name: 'Success Stories',
    description: 'Inspirational journeys, overcoming challenges',
    icon: '🏆',
    color: 'orange',
    postCount: 23,
    isActive: true
  }
]

// Popular forum tags
export const forumTags = [
  'exam anxiety', 'depression', 'family pressure', 'social anxiety',
  'study stress', 'loneliness', 'career choices', 'relationships',
  'self-esteem', 'panic attacks', 'homesickness', 'peer pressure',
  'time management', 'motivation', 'confidence', 'communication',
  'mindfulness', 'coping strategies', 'success story', 'support group'
]

// Community guidelines
export const communityGuidelines = [
  {
    id: 'respect',
    title: 'Be Respectful and Kind',
    description: 'Treat all community members with respect, empathy, and understanding. No harassment, bullying, or discriminatory language.',
    icon: '🤝'
  },
  {
    id: 'confidentiality',
    title: 'Respect Privacy and Confidentiality',
    description: 'Do not share personal information about other members. Respect anonymous posts and maintain confidentiality.',
    icon: '🔒'
  },
  {
    id: 'support',
    title: 'Provide Constructive Support',
    description: 'Offer helpful, constructive advice. Share your experiences to help others, but avoid giving medical or professional advice.',
    icon: '💪'
  },
  {
    id: 'safety',
    title: 'Prioritize Safety',
    description: 'If someone expresses thoughts of self-harm, encourage them to seek professional help immediately. Report concerning posts to moderators.',
    icon: '🛡️'
  },
  {
    id: 'authenticity',
    title: 'Be Authentic and Honest',
    description: 'Share genuine experiences and feelings. Avoid spam, promotional content, or misleading information.',
    icon: '✨'
  },
  {
    id: 'moderation',
    title: 'Follow Moderation Guidelines',
    description: 'Respect moderator decisions. Report inappropriate content rather than engaging in arguments.',
    icon: '⚖️'
  }
]

// Volunteer badge system
export const volunteerBadges = [
  {
    id: 'helper',
    name: 'Community Helper',
    description: 'Provided helpful responses to 10+ posts',
    icon: '🤝',
    color: 'blue',
    requirement: 'helpful_responses_10'
  },
  {
    id: 'supporter',
    name: 'Peer Supporter',
    description: 'Consistently provided emotional support to community members',
    icon: '💝',
    color: 'pink',
    requirement: 'support_responses_25'
  },
  {
    id: 'mentor',
    name: 'Student Mentor',
    description: 'Guided newcomers and shared valuable experiences',
    icon: '🌟',
    color: 'yellow',
    requirement: 'mentor_interactions_15'
  },
  {
    id: 'advocate',
    name: 'Mental Health Advocate',
    description: 'Promoted mental health awareness and resources',
    icon: '🧠',
    color: 'purple',
    requirement: 'advocacy_posts_5'
  },
  {
    id: 'guardian',
    name: 'Community Guardian',
    description: 'Helped maintain a safe and supportive environment',
    icon: '🛡️',
    color: 'green',
    requirement: 'moderation_reports_20'
  },
  {
    id: 'inspiration',
    name: 'Source of Inspiration',
    description: 'Shared inspiring success stories and positive messages',
    icon: '✨',
    color: 'orange',
    requirement: 'inspirational_posts_8'
  }
]

// Moderation tools and filters
export const moderationKeywords = [
  // Crisis indicators
  'suicide', 'kill myself', 'end it all', 'not worth living', 'better off dead',
  'self-harm', 'cutting', 'overdose', 'jump off', 'hang myself',
  
  // Inappropriate content
  'spam', 'advertisement', 'buy now', 'click here', 'promotion',
  
  // Harassment indicators
  'stupid', 'idiot', 'loser', 'worthless', 'pathetic', 'failure'
]

// Helper functions
export function getPostsByCategory(categoryId: string): ForumPost[] {
  return forumPosts.filter(post => 
    post.category.toLowerCase().replace(' ', '_') === categoryId
  )
}

export function getPostsByTag(tag: string): ForumPost[] {
  return forumPosts.filter(post =>
    post.tags.some(postTag => 
      postTag.toLowerCase().includes(tag.toLowerCase())
    )
  )
}

export function searchPosts(query: string): ForumPost[] {
  const searchTerm = query.toLowerCase()
  return forumPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function getRepliesForPost(postId: string): ForumReply[] {
  return forumReplies.filter(reply => reply.postId === postId)
}

export function detectCrisisContent(content: string): boolean {
  const crisisKeywords = moderationKeywords.slice(0, 10) // First 10 are crisis indicators
  return crisisKeywords.some(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  )
}

export function getUserBadges(userId: string): string[] {
  // TODO: Implement badge calculation based on user activity
  // This would check user's post history, helpful responses, etc.
  return ['helper', 'supporter'] // Sample badges
}
