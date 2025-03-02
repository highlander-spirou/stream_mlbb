const MATCH_ID = 'ASFJHASJFGHJK'
const BLOCK_INPUT_ID = '273113f8-a8ab-4fec-99a6-fab6aceb8bd2'



async function beginLiveMatch() {
  let i = 1

  const matchInterval = setInterval(async () => {
    async function updateTeamName() {

      async function saveData() {

      }
      
      async function fetchData() {
        await saveData()
      }


      async function sendVmixCommand() {

        const rsp = await fetchData()
        

        await fetch(`http://localhost:8088/api/?Function=SetText&Input=${BLOCK_INPUT_ID}&SelectedName=Headline.Text&Value=${'CONCAC' + i}`)
        await fetch(`http://localhost:8088/api/?Function=SetText&Input=${BLOCK_INPUT_ID}&SelectedName=Description.Text&Value=${'cailz' + i}`)
        i += 1
      }
      sendVmixCommand()

    }

    updateTeamName()

    console.log('updating headline', i)
  }, 1000)

}


beginLiveMatch()

