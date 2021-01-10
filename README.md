# Autoarchiver

A quick and dirty scrupt to automatically archive and mark as read:

- ...any read gmail message after it's 5 days old.
- ...order confirmations or shipping notifications after it's a day old.
- ...any unread emails older than 14 days.

My inbox should be a list of items that need to be addressed. While I've set up
a number of rules for "skipping the inbox", but sometimes, I still want to be
notified (in case of order confirmations) then clean up the email afterwards.

## Creating your own autoarchive google apps script

1. Visit https://script.google.com/create
2. Paste in the contents of Code.js
3. Set a trigger for whatever interval you'd like.
