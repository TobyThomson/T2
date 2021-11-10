# T2
A beautiful (though I do say so myself) ultimate tic tac toe game for the web. Built with NodeJS, Lobby.js, socket.io, browserify, shortid and createjs's easeljs. Rules can be found at https://mathwithbaddrawings.com/2013/06/16/ultimate-tic-tac-toe/

Enjoy!

## Tools to Implement
1. Gulp: Automates everything
2. Cypress: Unit + Functionality testing (possibly all falls under the "end-to-end" testing umbrella.

## Plan of Attack
1. Setup node
2. Implement build framework (includes bundling)
3. Implement test framework
4. Write first set of tests
5. Draw UI
6. Use ServiceWorkers to allow the app to work offline.

## Desired Feature List
1. Carry on using the app once internet connection lost
2. Detect if the other player has disconnected (heartbeat?)
3. Choose local or online game
4. Detect which player has won and end the game once someone has won
5. Manage player turns
6. Illustrate who's turn it is and which square they may play in
7. Resize to different computer screens and work on laptops and phones (resize live as required)
8. Vey fast (no silly bloat)
9. Display which version of the app we're using (useful for knowing if game has updated once back online)
10. Notifiy user if the app has been updated if brought back online.