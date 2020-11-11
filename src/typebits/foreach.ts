function delay (milliseconds: number, fcn: string, file: string) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ fcn, date: new Date(), file });
    }, milliseconds)
  })
}

async function forEachDelays () {
  const files = ["file1.json","file2.json","file3.json","file4.json"];
  console.log('forEach Delays...', new Date())

  files.forEach(async file => {
    const dateAfterOneSecond = await delay(1000, 'forEach', file)
    console.log(dateAfterOneSecond)  
  })

  return 'done'
}

async function forDelays () {
  const files = ["file1.json","file2.json","file3.json","file4.json"];
  console.log('for Delays...', new Date())

  for (const file of files) {
    const dateAfterOneSecond = await delay(1000, 'for', file)
    console.log(dateAfterOneSecond)  
  }

  return 'done'
}

async function mapDelays () {
  const files = ["file1.json","file2.json","file3.json","file4.json"];
  console.log('map Delays...', new Date())

  const promises = files.map(async file => {
    await delay(1000, 'map', file)
      .then(dateAfterOneSecond => {
        console.log(dateAfterOneSecond)  
      })
  })
  await Promise.all(promises);

  return 'done'
}

forEachDelays()
  .then(result => {
    console.log(`forEach after 4 seconds: ${result}`)
  })

forDelays()
  .then(result => {
    console.log(`for after 4 seconds: ${result}`)
  })

mapDelays()
  .then(result => {
    console.log(`map after 4 seconds: ${result}`)
  })
