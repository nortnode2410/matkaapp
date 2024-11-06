

const AdminSisuEl = document.getElementById('admin-sisu')
let hikes = []
let selectedIndex = 0

function getLeftPaneHTML(hikes) {
    let returnHTML = '';
    let i = 0;
    for (h of hikes) {
        if (h.nimetus) {
            returnHTML +=     `
            <div onclick="setSelectedHikeIndex(${i})">
                ${h.nimetus}
            </div>
        `
        }
        i += 1
    }

    return returnHTML
}

function getParticipantRowHTML(name, email) {
    return `
    <div class="row">
        <div class="col-5">
            ${name}
        </div>
        <div class="col-5">
            ${email}
        </div>
        <div class="col-2">
            <div class="btn btn-link" onclick="deleteParticipant('${email}')" >Kustuta</div>
        </div>
    </div>
    `
}

function getParticipantHeaderHTML() {
    return `
    <div class="row">
        <div class="col-6">
            <strong>Nimi</strong>
        </div>
        <div class="col-6">
            <strong>Email</strong>
        </div>
    </div>
    `
}

function getRightPaneHTML(hike) {
    const headerHTML = getParticipantHeaderHTML()
    let participantsHTML = ''

    if (!hike || hike.length < 1) {
        return ''
    }

    for (p of hike.osalejad ) {
        participantsHTML += getParticipantRowHTML(p.nimi, p.email)
    }

    let returnHTML = `
    <h3>
        ${hike.nimetus}
    </h3>
    <div class="osalejad">
      ${headerHTML}
      ${participantsHTML}
    </div>  
    `
    return returnHTML
}

function getPageContentHTML() {
    const leftPaneHTML = getLeftPaneHTML(hikes)
    const rightPaneHTML = getRightPaneHTML(hikes[selectedIndex])
    return `
    <div class="row">
        Matkaklubi matkadele registreerunud
    </div>
    <div class="row">
        <div class="col-4">
          ${leftPaneHTML}
        </div>
        <div id="rightPane" class="col-8">
           ${rightPaneHTML}
        </div>
    </div>
    `
}

async function deleteParticipant(email) {
    console.log('About to delete participant ' + email + ' of hike ' + selectedIndex )
    const result = await fetch(`/api/matk/${selectedIndex}/osaleja/${email}`, {method: "DELETE"})
    if (result.ok) {
        const updatedHike = await result.json()
        const updatedRightPaneHTML = getRightPaneHTML(updatedHike)
        const rightPaneEL = document.getElementById('rightPane')
        rightPaneEL.innerHTML = updatedRightPaneHTML
    } else {
        console.log('kustutamine ebaõnnestus')
    }
}

function showPageContent() {
    AdminSisuEl.innerHTML = getPageContentHTML()
}

function setSelectedHikeIndex(index) {
    console.log(index)
    selectedIndex = index
    showPageContent()
}


async function fetchHikes() {
    let response = await fetch('/api/matk');

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response.json();
        // handle data
        console.log(data)
        hikes = data
        showPageContent()
    }
}


//showPageContent()
fetchHikes()