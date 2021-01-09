function gmailAutoarchive() {
  const threads = GmailApp.search("in:inbox label:read AND older_than:10d");
  
  Logger.log("found " + threads.length + " threads:");
  threads.forEach((thread, i) => {
       Logger.log((i+1) + ". " + thread.getFirstMessageSubject());
  })
  
  const batch_size = 100;
  while (threads.length) {
    const this_batch_size = Math.min(threads.length, batch_size);
    var this_batch = threads.splice(0, this_batch_size);
    
    GmailApp.moveThreadsToArchive(this_batch);
  }
}