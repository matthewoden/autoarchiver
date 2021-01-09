function gmailAutoarchive() {
  // Remove anything read that's over 10 days old.
  const readItems = "in:inbox label:read AND older_than:10d"
  // any order confirmation that's over one day can get archived.
  const orderConfirmations = 'in:inbox label:"Order-Confirmation" AND older_than:1d'

  const clearThreads = (query) => {
    const threads = GmailApp.search(query)
    Logger.log("found " + threads.length + " threads:");

    threads.forEach((thread, i) => {
      Logger.log((i+1) + ". " + thread.getFirstMessageSubject());
      thread.markRead()
    })
  
    const batchSize = 100;
    while (threads.length) {      
      GmailApp.moveThreadsToArchive(
        threads.splice(
          0, 
          Math.min(threads.length, batchSize)
        )
      );
    } 
  };
  
  const queries = [readItems, orderConfirmations]
  queries.forEach(clearThreads)
}