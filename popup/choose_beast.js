//wyświetlenie listy boardów
//skąd id użytkownika wziąć?
//jak to wysłać do backendu?




apihost = 'http://127.0.0.1:8000/hints/?start='
let id = 2
let list = document.querySelector('.popup-content')
console.log(list)

fetch(apihost + id).then(
    function (resp){
      if (!resp.ok) {
        alert('brak jsona')
      }
      console.log(resp.json())
      return resp.json()
    }
).then(
    function (resp) {
      return resp.boards_list.forEach(function (e){
        let div = document.createElement('div')
        div.innerText = e
        console.log(div)
        console.log(list)
        list.appendChild(div)
      })
    }
)

    function getURL() {
        return window.location.href;
    }
let url = getURL()


/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;



/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

//czeka na klik
function listenForClicks() {
  document.addEventListener("click", (e) => {

    /**
     * Given the name of a beast, get the URL to the corresponding image.
     */
//to nie będzie potrzebne
    function beastNameToURL(beastName) {
      switch (beastName) {
        case "sun":
          return browser.extension.getURL("sun.png");
        case "maracas":
          return browser.extension.getURL("maracas.png");
      }
    }

    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the beast URL and
     * send a "beastify" message to the content script in the active tab.
     */

    // to nie będzie potrzebne, ale trzeba zrobić fukcję która tworzy command
    function beastify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = beastNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "beastify",
          beastURL: url
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */

        // to nie będzie potrzebne, ale trzeba zrobić fukcję która tworzy command
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */

    // ok
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */

    //to trzeba zmienić - co ma zrobić jak board zostanie wybrany
    if (e.target.classList.contains("beast")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(beastify)
        .catch(reportError);
    }
    else if (e.target.classList.contains("reset")) {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */

//to jest wywołanie beastify.js, czyli wyświetla obrazki. W moim przypadku ma wysłać jsona do backendu
browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);
