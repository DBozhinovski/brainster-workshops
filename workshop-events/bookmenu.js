// --- #1 generate a menu with local links for the paragraphs in the document ---
// Select all paragraphs
let paragraphs = document.querySelectorAll('p');

// Also fine with for; while; do-while; as long as they iterate to generate the menu
// Select the ul, we'll need it to add the menu items to it
let ul = document.querySelector('ul');

paragraphs.forEach(function(p) {
  let li = document.createElement('li'); // create a li container
  let a = document.createElement('a'); // create a link

  a.href = `#${p.id}`; // Also ok to do with "#" + p.id - the point is to create a hash link that scroll to the paragraph
  a.innerText = `Paragraph ${p.id}`;  // Also ok to do with "Paragraph" + p.id.

  li.appendChild(a); // Append the link to the li
  ul.appendChild(li); // Append the li to the ul we selected above;
});

// --- #2 when a menu item is clicked, add an "active" class to it in the sidebar; All other items should be deactivated ---

// Note: it's ok if they choose to reuse the previous loop
// IMPORTANT: No css selectors allowed. This is easily addressable by :active / :visited, but that's not the point 

const links = document.querySelectorAll('nav a'); // pick all a tags from nav

function clickHandler(event) {
  // IMPORTANT: since these are local links, we don't want to .preventDefault() them!
  // we still want the scrolling behavior
  links.forEach(function(a) { 
    a.classList.remove('active'); // first, remove all active classes from all links in the sidebar
  });

  event.currentTarget.classList.add('active'); // then add it to the one that was clicked
}

// Note: for future reference: if they are ok with for; while; do-while, it's fine to use that instead of forEach
// The solution is for illustrative purposes only.
links.forEach(function(a) {
  a.addEventListener('click', clickHandler); // attach the event handlers for all links in the sidebar
});

// --- #3 when a menu item is clicked, add an "activeP" class to its paragraphs too ---
// Note: there are multiple solutions for this. One is to handle it via the existing clickHandler above,
// using he same method - remove the class from the paragraphs, find the one we need by id, add the class to it.
// For practice purposes, encourage them to use "hashchange":

function toggleParagraphs(event) {
  paragraphs.forEach(function(p) {
    p.classList.remove('activeP');
  });

  let activeId = window.location.hash; // get the active internal link, which is always equal to the paragraph id we need to activate
  document.querySelector(activeId).classList.add('activeP');
}

window.addEventListener('hashchange', toggleParagraphs); // attach to hashchange event, tracking when an internal link triggered

// --- #4 preseve the state of the menu and active paragraphs on page reload ---

function activateOnLoad(event) {
  // The paragraph is easy - we do the same thing as with toggleParagraph: find the currently active link (if any)
  let activeId = window.location.hash; 

  if (activeId) { // there's a chance this is null on load, which will throw an error
    let activeElement = document.querySelector(activeId)
    activeElement.classList.add('activeP'); // we add the paragraph class to an element (if there is one)
    activeElement.scrollIntoView(); // see #5 for this
    // The link is however harder to find:
    // There are multiple ways of finding it (parsing the number, then finding the index), but the fastest is selecting it by the href attribute
    let link = document.querySelector(`a[href='${activeId}`); // It's OK to show them this line and the selector before they start
    link.classList.add('active');
  }
}

window.addEventListener('load', activateOnLoad);

// --- #5 BONUS ROUND: Also scroll to the active paragraph element on the page on reload --- 
// This also requires a hint: tell them about the scrollIntoView() method (see line #68).
// Another way is to check .top and scroll the window to the given .top param (although more complicated).


// --- #6 Add a div element (via JavaScript) which tracks which paragraphs is currently active ---
// The css for it is already written, just make sure to change it's contents when the page hash changes (and on page load)
let tracker = document.createElement('div'); // create the necessary element
tracker.classList.add('tracker'); // add the class
document.body.appendChild(tracker); // append it to the body

// From here on, there are two ways to solve this: either add code to the existing hashchange / load listeners for window, or create new ones
// For the solution, I'll create new ones (although it's more efficient to have them in a single listener instead).

function updatePageTracker(event) {
  // get the has, if there is one
  let activeId = window.location.hash;

  if (activeId) {
    tracker.innerText = activeId;
  }
  // otherwise - show nothing. Showing null / undefined should be considered incorrect.
}

// We can reuse the same function here, and it might be a good idea to demonstrate this to them
// The point is to convey that code can be reusable, especially for events and functions
window.addEventListener('hashchange', updatePageTracker);
window.addEventListener('load', updatePageTracker);

// From here onward, it gets more difficult. The important points are up to 6, anything after this is extra
// practice - it's harder and requires more thinking / planning on their part.
// Help them more if they get stuck.

// --- #7 Hiding and showing paragraphs instead of scrolling through them ---
// If they get to here, let them "turn" pages instead of having them scroll through paragraphs
// Each paragraph represents a page

// This code is for #9, ignore it for now
let scrollingMode = false;

function showActiveParagraph(event) {
  // The if condition is added for #9 - ignore otherwise.
  if (!scrollingMode) {
    // First, we hide all of the existing paragraphs
    paragraphs.forEach(function(p) {
      p.style.display = 'none';
    });
  
    // Then, we pick the one that's active (by hash) and show only that one
    // If none are active, we show nothing.
    let activeId = window.location.hash;
  
    if (activeId) {
      document.querySelector(activeId).style.display = 'block';
    }

  }
}

// Again, it's ok to reuse existing event bindings. It's also OK for them to use new ones:
window.addEventListener('hashchange', showActiveParagraph);
window.addEventListener('load', showActiveParagraph);

// --- #8 Below the articles, append two buttons to the body that can change the previous / next paragraph. Show alerts for first / last "page",
// if someone tries to click past those

// step one: Add a container div for the buttons:
let pager = document.createElement('div');
// step two: Add the pager class to the element
pager.classList.add('pager');
// step three: Define two buttons: previous and next
let next = document.createElement('button');
let previous = document.createElement('button');
// step four: Set the text of the buttons
next.innerText = "next >";
previous.innerText = "< previous";
// step five: Add the buttons to the div;
pager.appendChild(previous);
pager.appendChild(next);
// step six: Append pager to main
document.querySelector('main').appendChild(pager);

// step seven: Define event handlers for previous and next

// This time, getting to the next and previous elements is a bit more complex
function nextPage(event) {
  // Again, we pick the one that's active (by hash)
  let activeId = window.location.hash;
  // First off, we pick the currently active element (if there is one):
  if (activeId) {
    let currentElement = document.querySelector(activeId);
    // Then, using the nextElementSibling selector, we pick the neighboring element of the same type:
    let nextElement = currentElement.nextElementSibling; // It's OK to show them this one - they don't know it yet.
    // First, we need to check whether the next element is a paragraph or not
    if (nextElement.tagName === 'P') {
      // And in order to reuse existing functionality, we can just change the hash on the page
      // by using the id of the next element
      window.location.hash = `#${nextElement.id}`;
      // again, we need to manually activate the link in the sidebar - for consistency
      links.forEach(function(a) { 
        a.classList.remove('active');
      });
      let link = document.querySelector(`a[href='#${nextElement.id}`);
      link.classList.add('active');
    } else {
      alert('This is the last paragraph.');
    }
  }

}

// same as nextPage, but in reverse
function previousPage(event) {
  // Again, we pick the one that's active (by hash)
  let activeId = window.location.hash;
  // First off, we pick the currently active element (if there is one):
  if (activeId) {
    let currentElement = document.querySelector(activeId);
    // Then, using the previousElementSibling selector, we pick the previous neighboring element of the same type:
    let previousElement = currentElement.previousElementSibling; // It's OK to show them this one - they don't know it yet.
    // First, we need to check whether the next element is a paragraph or not
    if (previousElement.tagName === 'P') {
      // And in order to reuse existing functionality, we can just change the hash on the page
      // by using the id of the next element
      window.location.hash = `#${previousElement.id}`;
      // again, we need to manually activate the link in the sidebar - for consistency
      links.forEach(function(a) { 
        a.classList.remove('active');
      });
      let link = document.querySelector(`a[href='#${previousElement.id}`);
      link.classList.add('active');
    } else {
      alert('This is the first paragraph.');
    }
  }
}

next.addEventListener('click', nextPage);
previous.addEventListener('click', previousPage);

// --- #9 And if by some miracle they even get here, add a checkbox for scrolling mode when checked (all articles visible) and a paging mode when unchecked (clicking previous / next):
// Note: we also need to address the paragraph hiding - so we need to change how showActivePargraph operates (see above).
let scrollCheck = document.createElement('input');
let scrollLabel = document.createElement('label');
let scrollCheckContainer = document.createElement('div');

scrollCheckContainer.classList.add('scrollCheck');

scrollLabel.innerText = "Enable scrolling mode"
scrollCheck.type = 'checkbox';

scrollCheckContainer.appendChild(scrollLabel);
scrollCheckContainer.appendChild(scrollCheck);

document.body.appendChild(scrollCheckContainer);

function handleScrollMode(event) {
  let element = event.currentTarget;

  if (element.checked) {
    // first, enable scrolling mode (for the event handler above)
    scrollingMode = true;
    // Show all paragraphs and hide the pager
    paragraphs.forEach(function(p) {
      p.style.display = 'block';
    });

    pager.style.display = 'none';
  } else {
    // first, enable scrolling mode (for the event handler above)
    scrollingMode = false;
    // Hide all paragraphs and show the pager
    paragraphs.forEach(function(p) {
      p.style.display = 'none';
    });

    pager.style.display = 'block';

    let activeId = window.location.hash;

    if (activeId) {
      document.querySelector(activeId).style.display = 'block';
      document.querySelector(activeId).scrollIntoView(); // and scroll it into view for consistency
    }
  }
}

scrollCheck.addEventListener('change', handleScrollMode);

// If they happen to solve all and want more:
// Add a 'favorite' button to each paragraph - once clicked, the page should load there (using localStorage)
// If they happen to also do that, let them make the page responsive :)

