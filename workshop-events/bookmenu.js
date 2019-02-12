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

  tracker.innerText = activeId;
}

// We can reuse the same function here, and it might be a good idea to demonstrate this to them
// The point is to convey that code can be reusable, especially for events and functions
window.addEventListener('hashchange', updatePageTracker);
window.addEventListener('load', updatePageTracker);

