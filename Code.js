
const PAGE_SIZE = 150

// execute to install
function setDailyArchiveTrigger() {
  ScriptApp
    .newTrigger('archive')
    .timeBased()
    .everyDays(1)
    .create()
}


function setArchiveMoreTrigger(){
  ScriptApp.newTrigger('archive-more')
  .timeBased()
  .at(new Date((new Date()).getTime() + 1000 * 60 * 2))
  .create()
}


//Deletes all triggers that call the purgeMore function.
function removeArchiveMoreTriggers(){
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if(trigger.getHandlerFunction() === 'archive-more'){
      ScriptApp.deleteTrigger(trigger)
    }
  })
}

// execute to cleanup
function removeAllTriggers() {
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    ScriptApp.deleteTrigger(trigger)
  })
}

function gmailAutoarchive() {
  // always cleanup any old retry triggers before starting a new run.
  removeArchiveMoreTriggers()

  let totalThreads = 0
  let rescheduled = false

  const clearThreads = (query) => {
    const threads = GmailApp.search(query)

    // there's a 6 minute limit on these scripts. So, just in case we're doing
    // too much in one script, try again in a few.
  
    totalThreads = totalThreads + threads.length
 
    if (totalThreads > PAGE_SIZE && !rescheduled) {
      setArchiveMoreTrigger()
    }

    Logger.log("Found " + threads.length + " threads:");

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
  
  const queries = [
    // Remove anything read that's over 10 days old.
    "in:inbox label:read AND older_than:5d", 
     // any order confirmation that's over one day can get archived.
    'in:inbox label:"Order-Confirmation" AND older_than:1d',
    // any unread emails older than a month probably aren't going to be read.
    'in:inbox label:unread AND older_than:14d'
  ]

  queries.forEach(clearThreads)
}