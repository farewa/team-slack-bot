import { getBotSlackId } from "../integrations/slack/consts";

const {
  sendSlackMessage,
  getUserIDInText,
} = require("../integrations/slack/messages");

// TODO: Add more / make it funnier :)
// Got compliments from various sources:
// * Some I thought about
// * https://pairedlife.com/friendship/Funny-Compliments-for-Friends
// * https://www.theodysseyonline.com/compliments-cheer-somebody-up
// * https://www.grammarly.com/blog/compliments-for-any-person/
const COMPLIMENTS_POOL = [
  "Just so you'll know - I thinks you're as bright as a button! :purple_heart:",
  "Are you a beaver? Because damn!",
  "I would trust you to delete my browser history if something bad happened to me.",
  "I would delete your browser history for you if you suddenly died.",
  "You should be thanked more often. So, thank you, thank you, and thank you!",
  "It’s a good thing you’re not a drug, because I would be extremely addicted if you were, and I would then have to waste money and time on rehab.",
  "I bet you could survive the a zombie apocalypse, because you’re such a bad-ass!",
  "You know what’s awesome? Chocolate cake! And oh, your face as well.",
  "The hardest part about having you as a friend is that I have to pretend that I like my other friends as much as I like you.",
  "I brag about you to my other friends.",
  "You make me want to be a better bot. :purple_heart:",
  "You’re the only person who gets my sarcasm.",
  "Puppies and kittens probably share photos of you with one another in their very own social network.",
  "Even if you were cloned, you’d still be one of a kind. And the better-looking one.",
  "The more you talk, the more I like you.",
  "You're at the top of the bell curve!",
  "The more I get to know you, the more I believe unicorns might be real too.",
  "Wait, let me wear my sunglasses, you shine way too bright.",
  "I like puppies, but I think I like you way more.",
  "So… you’re the angel who fell.",
  "I don’t like to see you first thing in the morning, but you know I’m a liar.",
  "How many medals did your mum and dad receive for raising you so well?",
  "You’re the only person in the world I’m willing to talk to before my first cup of coffee.",
  "Actions speak louder than words, and yours tell an incredible story.",
  "Any team would be lucky to have you on it.",
  "As cheesy as this is, I'm telling the truth: on a scale from 1 to 10, you're an 11.",
  "Everything seems brighter when you are near",
  'If there was a superlative about you, it would be "most likely to keep being awesome."',
  "Short, sweet, and to the point: You're wonderful.",
  "You are a great role model to others.",
  "Your positivity is infectious.",
  "You should be so proud of yourself.",
  "You’re amazing!",
  "You’re a true gift to the people in your life.",
  "You’re an incredible friend.",
  "I really appreciate everything that you do.",
  "Your smile makes me smile.",
  "Thank you for being such a great person.",
  "The way you carry yourself is truly admirable.",
  "You are such a good listener.",
  "You have a remarkable sense of humor.",
  "Thanks for being you!",
  "You set a great example for everyone around you.",
  "I love your perspective on life.",
  "Being around you makes everything better.",
  "You always know the right thing to say.",
  "The world would be a better place if more people were like you!",
  "You are one of a kind.",
  "You make me want to be the best version of myself.",
  "You always have the best ideas.",
  "I’m so lucky to have you in my life.",
  "Your capacity for generosity knows no bounds.",
  "I wish I were more like you.",
  "You are so strong.",
  "I’ve never met someone as kind as you are.",
  "You have such a great heart.",
  "Simply knowing you has made me a better person.",
  "You are beautiful inside and out.",
  "You are so special to everyone you know.",
  "Your mere presence is reassuring to me.",
  "Your heart must be 10 times the average size.",
  "You are my favorite person to talk to.",
  "You’ve accomplished so many incredible things.",
  "I appreciate your friendship more than you can know.",
  "I love how you never compromise on being yourself.",
  "I tell other friends how wonderful you are.",
  "You helped me realize my own worth.",
  "Your point of view is so refreshing.",
  "You always make me feel welcome.",
  "You deserve everything you’ve achieved.",
  "I’m lucky just to know you.",
  "You are so down to earth.",
  "You know just how to make my day!",
  "You spark so much joy in my life.",
  "You are making a real difference in the world.",
  "You’re so unique.",
  "You are wise beyond your years.",
  "You’re worthy of all the good things that come to you.",
  "How did you learn to be so great?",
  "Never stop being you!",
  "You inspire me in so many different ways.",
  "You continue to impress me.",
  "You make the small things count.",
  "You are a ray of sunshine.",
  "You have the courage of your convictions.",
  "You’re incredibly thoughtful.",
  "You have the best ideas.",
  "You’re the most perfect ‘you’ there is.",
  "You are the epitome of a good person.",
  "You always know how to find the silver lining.",
  "You’re the person that everyone wants on their team.",
  "I always learn so much when I’m around you.",
  "Is there anything you can’t do!?",
];

const getRandomCompliment = function () {
  const random = Math.floor(Math.random() * COMPLIMENTS_POOL.length);
  return COMPLIMENTS_POOL[random];
};

export const compliment_action = async function (event: any) {
  // TODO: Think of a better way to use the sender / receiver in the message
  const compliment = getRandomCompliment();

  let receiver = getUserIDInText(event.text);

  // If there is no receiver, ignore the compliment request
  if (!receiver) {
    // Handle a 'compliment yourself' sitation
    if (event.text.includes("compliment yourself")) {
      receiver = `<@${getBotSlackId()}>`;
      console.log(receiver);
    } else {
      console.log(`Did not find a receiver in ${event.text}`);
      return;
    }
  }

  await sendSlackMessage(
    `${receiver} ${compliment}`,
    event.channel,
    event.thread_ts
  );
};
