# T2
A beautiful (though I do say so myself) ultimate tic tac toe game for the web. Built with NodeJS, Lobby.js, socket.io, browserify, shortid and createjs's easeljs. Rules can be found at https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/

Enjoy!

This is an addition to the README

## Tools to Implement
1. Gulp: Automates everything
2. Cypress: Unit + Functionality testing (possibly all falls under the "end-to-end" testing umbrella.

## Plan of Attack
1. [x] Setup NodeJS
2. [x] Implement build framework (includes bundling)
3. [x] Implement test framework
4. [ ] Write first set of tests
5. [ ] Use ServiceWorkers to allow the app to work offline.
6. [ ] Write UI tests
7. [ ] Draw UI
8. [ ] Write simple game logic tests
9. [ ] Implement simple game logic

## Desired Feature List
* Carry on using the app once internet connection lost
* Detect if the other player has disconnected (heartbeat?)
* Choose local or online game
* Detect which player has won and end the game once someone has won
* Manage player turns
* Illustrate who's turn it is and which square they may play in
* Resize to different computer screens and work on laptops and phones (resize live as required)
* Vey fast (no silly bloat)
* Display which version of the app we're using (useful for knowing if game has updated once back online)
* Notifiy user if the app has been updated if brought back online.