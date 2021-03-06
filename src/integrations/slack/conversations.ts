// This is a util function that is able to look for the ID of a conversation / channel by name
import { BOT_SLACK_ID, SlackWebClient } from "./consts";
import {
  ConversationsHistoryArguments,
  ConversationsListArguments,
} from "@slack/web-api";

export const getConversationId = async function (
  name: string,
  types_list: string = "public_channel",
  cursor: string = ""
): Promise<string> {
  // Get the channels list from slack
  const options: ConversationsListArguments = {
    types: types_list,
    cursor: cursor,
    exclude_archived: true,
  };
  if (cursor) {
    options["cursor"] = cursor;
  }
  const channelsList = await SlackWebClient.conversations.list(options);

  // Look for the channel details in the results
  const filtered = channelsList.channels.filter(function (el: any) {
    return el.name === name;
  });

  // If we've found it, return the ID.
  if (filtered.length > 0) {
    // TODO: If there's more than 1, we'll return the first
    return filtered[0].id;
  } else {
    //  If possible, get the next cursor and look again
    if (!channelsList.response_metadata.next_cursor) {
      // No more data, we didn't find return empty
      return "";
    } else {
      return getConversationId(
        name,
        types_list,
        channelsList.response_metadata.next_cursor
      );
    }
  }
};

export const getConversationHistory = async function (
  channel_id: string,
  oldest: string = "" // Start of time range of messages to include in results (in seconds).
): Promise<any[]> {
  // TODO: Handle a 'channel not found' error / 'not_in_channel' error

  // Get the channels list from slack
  const options: ConversationsHistoryArguments = {
    channel: channel_id,
    oldest: oldest,
    limit: 100,
  };

  const results: any[] = [];

  let response = await SlackWebClient.conversations.history(options);
  response.messages.forEach(function (message: any) {
    // Filter out messages that has a subtype (like 'channel_join') and messages that are commands to the bot
    if (
      !message.subtype &&
      !message.text.includes(`<@${BOT_SLACK_ID}>`) &&
      message.user != BOT_SLACK_ID
    ) {
      results.push(message);
    }
  });

  while (response.has_more) {
    options["cursor"] = response.response_metadata.next_cursor;
    response = await SlackWebClient.conversations.history(options);

    // Add the messages
    // TODO: Remove redundancy / extract the logic
    response.messages.forEach(function (message: any) {
      // Filter out messages that has a subtype (like 'channel_join') and messages that are commands to the bot
      if (
        !message.subtype &&
        !message.text.includes(`<@${BOT_SLACK_ID}>`) &&
        !message.user != BOT_SLACK_ID
      ) {
        results.push(message);
      }
    });
  }

  return results;
};
